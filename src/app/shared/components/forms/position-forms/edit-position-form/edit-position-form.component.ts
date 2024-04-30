import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import {BehaviorSubject, Observable, Subject, takeUntil, zip} from 'rxjs';
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
import Pageable from "../../../../../models/dto/generics/request/Pageable";
import PageMin from "../../../../../models/dto/generics/response/PageMin";
import {TableLazyLoadEvent} from "primeng/table";

@Component({
    selector: 'app-edit-position-form',
    templateUrl: './edit-position-form.component.html',
    styleUrls: ['./edit-position-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditPositionFormComponent implements OnInit, OnDestroy {

    private readonly destroy$: Subject<void> = new Subject();
    private readonly toastLife: number = 2000;

    public pageable!: Pageable;
    public loading$!: BehaviorSubject<boolean>;
    public page!: PageMin<PositionMinDTO>;

    public viewTable$: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public closeableDialog: boolean = false;

    public selectedPosition!: PositionDTO | undefined;
    public totalParameters!: ParameterDTO[];
    public positionParameters!: ParameterWeightDTO[];

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
        private changeDetectorRef: ChangeDetectorRef,
        private dynamicDialogConfig: DynamicDialogConfig,
        private positionService: PositionService,
        private parameterService: ParameterService,
        private customDialogService: CustomDialogService,
        private changesOnService: ChangesOnService
    ) {
        this.pageable = new Pageable('', 0, 5);
        this.loading$ = new BehaviorSubject(false);
        this.page = {
            content: [],
            pageNumber: 0,
            pageSize: 5,
            totalElements: 0
        };
    }

    public ngOnInit(): void {
        this.page.totalElements === 0 && this.setPositionsWithApi(this.pageable);

        const action = this.dynamicDialogConfig.data;
        if (action && action.$event === EnumPositionEventsCrud.EDIT) {
            this.handleSelectPosition(action.selectedPositionId);
            this.closeableDialog = true;
        }
    }

    private setPositionsWithApi(pageable: Pageable): void {
        this.pageable = pageable;

        this.loading$.next(true);

        setTimeout(() => {
            this.positionService.findAll(pageable)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (positionsPage: Page<PositionMinDTO>) => {
                        this.page.content = positionsPage.content;
                        this.page.pageNumber = positionsPage.pageable.pageNumber;
                        this.page.pageSize = positionsPage.pageable.pageSize;
                        this.page.totalElements = positionsPage.totalElements;

                        this.loading$.next(false);
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

                        this.loading$.next(false);
                    }
                });
        }, 500);
    }

    public handleChangePageAction(event$: TableLazyLoadEvent): void {
        if (event$ && event$.first !== undefined && event$.rows) {
            const pageNumber = Math.ceil(event$.first / event$.rows);
            const pageSize = event$.rows !== 0 ? event$.rows : 5;

            const pageable = new Pageable(this.pageable.keyword, pageNumber, pageSize);
            this.setPositionsWithApi(pageable);
        }
    }

    public handleSelectPosition(id: number): void {
        if (id) {
            // Reset available parameters whenever a new game mode is chosen due to the strategy of deleting positions that already belong to the selected position
            const totalParameters$: Observable<Page<ParameterDTO>> =
                this.parameterService.findAllWithTotalRecords();

            const selectedPosition$: Observable<PositionDTO> =
                this.positionService.findById(id);
            const combined$: Observable<[Page<ParameterDTO>, PositionDTO]> =
                zip(totalParameters$, selectedPosition$);

            // It's necessary to synchronize the requests to avoid issues with undefined in 'this.totalParameters' in the 'deleteIncludedParameters' method
            combined$
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (response: [Page<ParameterDTO>, PositionDTO]) => {
                        let parametersPage: Page<ParameterDTO>;
                        let position: PositionDTO;
                        [parametersPage, position] = response;

                        this.totalParameters = parametersPage.content;

                        this.selectedPosition = position;
                        this.editPositionForm.setValue({
                            name: position?.name,
                            description: position?.description,
                        });
                        this.positionParameters = position.parameters;
                        this.deleteIncludedParameters();

                        this.viewTable$.next(false);
                    },
                    error: (err) => {
                        console.log(err);
                    }
                });
        }
    }

    private deleteIncludedParameters(): void {
        const positionParametersIds: number[] = this.positionParameters.map(p => p.id);
        this.totalParameters = this.totalParameters.filter(p => !positionParametersIds.includes(p.id));
    }

    public handleBackAction(): void {
        this.closeableDialog ?
            this.customDialogService.closeEndDialog() : this.viewTable$.next(true);

        this.selectedPosition = undefined;

        this.changeDetectorRef.detectChanges();
    }

    public handleAddNewPositionParameter(): void {
        const parameter: ParameterDTO | undefined = this.positionParameterForm.value?.parameter as ParameterDTO | undefined;
        const weight = this.positionParameterForm.value?.weight as number | undefined;

        if (parameter && weight) {
            this.totalParameters = this.totalParameters.filter(p => p.id !== parameter.id);

            this.positionParameters.push(new ParameterWeightDTO(parameter.id, parameter.name, weight));
            this.sortParametersByName(this.positionParameters);
        }

        this.positionParameterForm.reset();
    }

    public handleDeletePositionParameter(id: number): void {
        if (id) {
            const parameterWeightDTO: ParameterWeightDTO | undefined = this.positionParameters.find((p) => p.id === id);
            if (parameterWeightDTO) {
                const parameter: ParameterDTO = new ParameterDTO(parameterWeightDTO.id, parameterWeightDTO.name);

                this.positionParameters = this.positionParameters.filter(p => p.id !== parameter.id);

                this.totalParameters.push(parameter);
                this.sortParametersByName(this.totalParameters);
            }
        }
    }

    private sortParametersByName(parameters: ParameterDTO[] | ParameterWeightDTO[]): void {
        parameters.sort((p1, p2) => p1.name.toUpperCase().localeCompare(p2.name.toUpperCase()));
    }

    public handleSubmitEditPositionForm(): void {
        if (this.editPositionForm.valid && this.editPositionForm.value) {
            const positionRequest: PositionRequestDTO = {
                name: this.editPositionForm.value.name as string,
                description: this.editPositionForm.value.description as string,
                parameters: this.positionParameters
            }

            this.selectedPosition && this.positionService.updateById(this.selectedPosition?.id, positionRequest)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (position: PositionMinDTO) => {
                        const positionUpdated = this.page.content.find(p => p.id === this.selectedPosition?.id);
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
                        this.messageService.clear();
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Invalid registration!',
                            life: this.toastLife
                        });

                        console.log(err);

                        this.changesOnService.setChangesOn(false);
                    }
                });
        }
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
