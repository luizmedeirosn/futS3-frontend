import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ParameterDTO } from 'src/app/models/dto/parameter/response/ParameterDTO';
import { ParameterWeightDTO } from 'src/app/models/dto/position/data/ParameterWeightDTO';
import { PositionRequestDTO } from 'src/app/models/dto/position/request/PositionRequestDTO';
import { PositionDTO } from 'src/app/models/dto/position/response/PositionDTO';
import { PositionMinDTO } from 'src/app/models/dto/position/response/PositionMinDTO';
import { EnumPositionEventsCrud } from 'src/app/models/enums/EnumPositionEventsCrud';
import { ParameterService } from 'src/app/services/parameter/parameter.service';
import { PositionService } from 'src/app/services/position/position.service';
import { ChangesOnService } from 'src/app/shared/services/changes-on/changes-on.service';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog/custom-dialog.service';

@Component({
    selector: 'app-edit-position-form',
    templateUrl: './edit-position-form.component.html',
    styleUrls: ['./edit-position-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditPositionFormComponent {

    private readonly $destroy: Subject<void> = new Subject();
    private readonly toastLife: number = 2000;

    @ViewChild('positionsTable') public playersTable!: Table;
    private positionsTablePages: Array<Array<PositionDTO>> = new Array();

    public $viewTable: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public closeableDialog: boolean = false;

    public positions!: Array<PositionDTO>;
    public selectedPosition!: PositionDTO | undefined;
    public parameters!: Array<ParameterDTO>;
    private parametersOff: Array<ParameterDTO> = new Array();
    public positionParameters: Array<ParameterWeightDTO> = new Array();

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
        this.positionService.findAllWithParameters()
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (positions) => {
                    this.positions = positions;

                    let increment: number = 0;
                    let page: Array<PositionDTO> = new Array();

                    positions.forEach((position, index, array) => {
                        page.push(position);
                        increment += 1;
                        if (increment === 5 || index === array.length - 1) {
                            this.positionsTablePages.push(page);
                            page = new Array();
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
                next: (parameters) => {
                    this.parameters = parameters;
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
            this.positionService.findByIdWithParameters($event)
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
        this.closeableDialog && this.customDialogService.closeEndDialog(false);

        this.$viewTable.next(true); // Activate the view child before referencing the table
        setTimeout(() => {
            if (this.selectedPosition?.id !== undefined) {
                const selectedPosition: PositionDTO | undefined =
                    this.positions.find(position => position.id === this.selectedPosition?.id);

                if (selectedPosition) {
                    const index = this.positions.indexOf(selectedPosition);
                    const numPage: number = Math.floor(index / 5);
                    const page = this.positionsTablePages.at(numPage);
                    const firstPositionPage: PositionDTO | undefined = page?.at(0);

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
        }
        this.positionParameterForm.reset();
    }

    private compareParameters = (p1: any, p2: any) => {
        if (p1.name < p2.name) {
            return -1;
        } else if (p1.name > p2.name) {
            return 1;
        }
        return 0;
    }

    public handleDeletePositionParameter($event: number): void {
        this.positionParameters = this.positionParameters.filter(p => p.id !== $event);
        const parameter: ParameterDTO | undefined = this.parametersOff.find((p) => p.id === $event);
        parameter && this.parameters.push(parameter);
        this.parameters.sort(this.compareParameters);
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
        this.parameters.sort(this.compareParameters);
        this.parametersOff = new Array();
        this.positionParameters = new Array();
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

}
