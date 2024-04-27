import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import {Table} from 'primeng/table';
import {BehaviorSubject, Subject, takeUntil} from 'rxjs';
import {ParameterDTO} from 'src/app/models/dto/parameter/response/ParameterDTO';
import {ParameterWeightDTO} from 'src/app/models/dto/position/aux/ParameterWeightDTO';
import {PositionRequestDTO} from 'src/app/models/dto/position/request/PositionRequestDTO';
import {PositionDTO} from 'src/app/models/dto/position/response/PositionDTO';
import PositionMinDTO from 'src/app/models/dto/position/response/PositionMinDTO';
import {EnumPositionEventsCrud} from 'src/app/models/enums/EnumPositionEventsCrud';
import {ParameterService} from 'src/app/services/parameter/parameter.service';
import {PositionService} from 'src/app/services/position/position.service';
import {ChangesOnService} from 'src/app/shared/services/changes-on/changes-on.service';
import {CustomDialogService} from 'src/app/shared/services/custom-dialog/custom-dialog.service';
import Page from "../../../../../models/dto/generics/response/Page";

@Component({
    selector: 'app-edit-position-form',
    templateUrl: './edit-position-form.component.html',
    styleUrls: ['./edit-position-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditPositionFormComponent implements OnInit {

    private readonly $destroy: Subject<void> = new Subject();
    private readonly toastLife: number = 2000;

    @ViewChild('positionsTable') public playersTable!: Table;
    private positionsTablePages: Array<Array<PositionMinDTO>> = [];

    public $viewTable: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public closeableDialog: boolean = false;

    public positions!: Array<PositionMinDTO>;
    public selectedPosition!: PositionDTO | undefined;
    public parameters!: Array<ParameterDTO>;
    private parametersOff: Array<ParameterDTO> = [];
    public positionParameters: Array<ParameterWeightDTO> = [];

    public editPositionForm: any = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        description: ['', [Validators.maxLength(2000)]],
    });

    public positionParameterForm = this.formBuilder.group({
        parameter: ['', Validators.required],
        weight: ['', [Validators.required, Validators.pattern(/^-?\d*\.?\d*$/), Validators.min(1), Validators.max(100)]],
    });

    public constructor(
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private positionService: PositionService,
        private parameterService: ParameterService,
        private customDialogService: CustomDialogService,
        private dynamicDialogConfig: DynamicDialogConfig,
        private changesOnService: ChangesOnService,
    ) { }

    public ngOnInit(): void {
        this.setPositionsWithApi();
        this.setParametersWithApi();

        const action = this.dynamicDialogConfig.data;
        if (action && action.$event === EnumPositionEventsCrud.EDIT) {
            this.handleSelectPosition(action.selectedPositionId);
            this.closeableDialog = true;
        }
    }

    private setPositionsWithApi(): void {
        this.positionService.findAllWithTotalRecords()
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (positionsPage: Page<PositionMinDTO>) => {
                    this.positions = positionsPage.content;

                    let increment: number = 0;
                    let page: Array<PositionMinDTO> = [];

                    positionsPage.content.forEach((position, index, array) => {
                        page.push(position);
                        increment += 1;
                        if (increment === 5 || index === array.length - 1) {
                            this.positionsTablePages.push(page);
                            page = [];
                            increment = 0;
                        }
                    });
                },
                error: (err) => {
                    this.messageService.clear();
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to retrieve the data!',
                        life: this.toastLife
                    });
                    console.log(err);
                }
            });
    }

    private setParametersWithApi(): void {
        this.parameterService.findAll()
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (parametersPage: Page<ParameterDTO>) => {
                    this.parameters = parametersPage.content;
                },
                error: (err) => {
                    console.log(err);
                }
            });
    }

    private deleteIncludedPositionParameters(): void {
        if (this.positionParameters) {
            const parametersNames = this.positionParameters.map(p => p.name);
            this.parameters.forEach(parameter => {
                if (parametersNames.includes(parameter.name)) {
                    this.parametersOff.push(parameter);
                    this.parameters = this.parameters.filter(p => p.name != parameter.name);
                }
            });
        }
    }

    public handleSelectPosition($event: number): void {
        if ($event) {
            this.setParametersWithApi();
            this.positionService.findById($event)
                .pipe(takeUntil(this.$destroy))
                .subscribe({
                    next: (position) => {
                        if (position) {
                            this.selectedPosition = position;

                            this.editPositionForm.setValue({
                                name: position?.name,
                                description: position?.description,
                            });

                            this.positionParameters = position?.parameters;
                            this.deleteIncludedPositionParameters();

                            this.$viewTable.next(false);
                        }
                    },
                    error: (err) => {
                        console.log(err);
                    }
                });
        }
    }

    public handleBackAction(): void {
        this.closeableDialog && this.customDialogService.closeEndDialog();

        // Activate the view child before referencing the table
        this.$viewTable.next(true);

        // Delay until activating the viewChild
        setTimeout(() => {
            if (this.selectedPosition?.id !== undefined) {
                const selectedPosition: PositionMinDTO | undefined =
                    this.positions.find(position => position.id === this.selectedPosition?.id);

                if (selectedPosition) {
                    const index = this.positions.indexOf(selectedPosition);
                    const numPage: number = Math.floor(index / 5);
                    const page = this.positionsTablePages.at(numPage);
                    const firstPositionPage: PositionMinDTO | undefined = page?.at(0);

                    this.playersTable &&
                        (this.playersTable.first =
                            firstPositionPage && this.positions.indexOf(firstPositionPage));
                }
            }
            this.selectedPosition = undefined;
        }, 10);
    }

    public handleAddNewParameter(): void {
        const parameter = this.positionParameterForm.value?.parameter as ParameterDTO | undefined;
        const weight = this.positionParameterForm.value?.weight as number | undefined;

        if (parameter && weight) {
            const parameterName: string = this.parameters.filter((p) => p.name === parameter.name)[0].name;

            this.parametersOff.push(parameter);
            this.parameters = this.parameters.filter(p => p.name !== parameterName);

            const playerParameterScore: ParameterWeightDTO = {
                id: parameter.id,
                name: parameterName,
                weight: weight
            };

            this.positionParameters.push(playerParameterScore);
            this.positionParameters.sort((p1, p2) => p1.name.toUpperCase().localeCompare(p2.name.toUpperCase()));
        }

        this.positionParameterForm.reset();
    }

    public handleDeletePositionParameter(id: number): void {
        if (id) {
            this.positionParameters = this.positionParameters.filter(p => p.id !== id);

            const parameter: ParameterDTO | undefined = this.parametersOff.find((p) => p.id === id);
            parameter && this.parameters.push(parameter);
            this.parameters.sort((p1, p2) => p1.name.toUpperCase().localeCompare(p2.name.toUpperCase()));
        }
    }

    public handleSubmitEditPositionForm(): void {
        if (this.editPositionForm.valid && this.editPositionForm.value) {
            const positionRequest: PositionRequestDTO = {
                name: this.editPositionForm.value.name as string,
                description: this.editPositionForm.value.description as string,
                parameters: this.positionParameters
            }

            this.selectedPosition && this.positionService.updateById(this.selectedPosition?.id, positionRequest)
                .pipe(takeUntil(this.$destroy))
                .subscribe({
                    next: (position: PositionMinDTO) => {
                        const positionUpdated = this.positions.find(p => p.id === this.selectedPosition?.id);
                        positionUpdated && (positionUpdated.name = position.name);

                        this.changesOnService.setChangesOn(true);

                        this.messageService.clear();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Position edited successfully.',
                            life: this.toastLife
                        });

                        this.handleBackAction();
                    },
                    error: (err) => {
                        this.changesOnService.setChangesOn(false);

                        this.messageService.clear();
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Invalid registration!',
                            life: this.toastLife
                        });
                        console.log(err);

                        this.handleBackAction();
                    }
                });
        }
        this.editPositionForm.reset();
        this.positionParameterForm.reset();

        this.parametersOff.forEach(e => this.parameters.push(e));
        this.parameters.sort((p1, p2) => p1.name.toUpperCase().localeCompare(p2.name.toUpperCase()));
        this.parametersOff = [];
        this.positionParameters = [];
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

}
