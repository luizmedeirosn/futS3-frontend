import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {Subject, takeUntil} from 'rxjs';
import {ParameterDTO} from 'src/app/models/dto/parameter/response/ParameterDTO';
import {ParameterWeightDTO} from 'src/app/models/dto/position/aux/ParameterWeightDTO';
import {PositionRequestDTO} from 'src/app/models/dto/position/request/PositionRequestDTO';
import {ParameterService} from 'src/app/services/parameter/parameter.service';
import {PositionService} from 'src/app/services/position/position.service';
import {ChangesOnService} from 'src/app/shared/services/changes-on/changes-on.service';
import Page from "../../../../../models/dto/generics/response/Page";

@Component({
    selector: 'app-save-position-form',
    templateUrl: './save-position-form.component.html',
    styleUrls: []
})
export class SavePositionFormComponent implements OnInit, OnDestroy {

    private readonly $destroy: Subject<void> = new Subject();
    private readonly toastLife: number = 2000;

    public totalParameters!: ParameterDTO[];
    public positionParameters!: ParameterWeightDTO[];

    public newPositionForm: any = this.formBuilder.group({
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
        private changesOnService: ChangesOnService,
    ) {
        this.positionParameters = [];
    }

    public ngOnInit(): void {
        this.setParametersWithApi();
    }

    private setParametersWithApi(): void {
        this.parameterService.findAll()
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (parametersPage: Page<ParameterDTO>) => {
                    this.totalParameters = parametersPage.content;
                },
                error: (err) => {
                    console.log(err);
                }
            });
    }

    public handleAddNewParameter(): void {
        const parameter: ParameterDTO | undefined = this.positionParameterForm.value?.parameter as ParameterDTO | undefined;
        const weight = this.positionParameterForm.value?.weight as number | undefined;

        if (parameter && weight) {
            this.totalParameters = this.totalParameters.filter(p => p.id !== parameter.id);

            this.positionParameters.push(new ParameterWeightDTO(parameter.id, parameter.name, weight));
            this.sortParametersByName(this.positionParameters);
        }

        this.positionParameterForm.reset();
    }

    public handleDeleteParameter(id: number): void {
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

    public handleSubmitSavePositionForm(): void {
        if (this.newPositionForm.valid && this.newPositionForm.value) {
            const positionRequest: PositionRequestDTO = {
                name: this.newPositionForm.value.name as string,
                description: this.newPositionForm.value.description as string,
                parameters: this.positionParameters
            }

            this.positionService.save(positionRequest)
                .pipe(takeUntil(this.$destroy))
                .subscribe({
                    next: () => {
                        this.changesOnService.setChangesOn(true);


                        this.newPositionForm.reset();
                        this.positionParameterForm.reset();

                        // Reset totalParameters and positionParameters
                        this.positionParameters = [];
                        this.setParametersWithApi();

                        this.messageService.clear();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Position registered successfully!',
                            life: this.toastLife
                        });
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
        this.$destroy.next();
        this.$destroy.complete();
    }
}
