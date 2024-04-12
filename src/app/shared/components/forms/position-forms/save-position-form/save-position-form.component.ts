import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ParameterDTO } from 'src/app/models/dto/parameter/response/ParameterDTO';
import { ParameterWeightDTO } from 'src/app/models/dto/position/data/ParameterWeightDTO';
import { PositionRequestDTO } from 'src/app/models/dto/position/request/PositionRequestDTO';
import { ParameterService } from 'src/app/services/parameter/parameter.service';
import { PositionService } from 'src/app/services/position/position.service';
import { ChangesOnService } from 'src/app/shared/services/changes-on/changes-on.service';

@Component({
    selector: 'app-save-position-form',
    templateUrl: './save-position-form.component.html',
    styleUrls: []
})
export class SavePositionFormComponent implements OnInit, OnDestroy {

    private readonly $destroy: Subject<void> = new Subject();
    private readonly toastLife: number = 2000;

    public parameters!: Array<ParameterDTO>;
    private parametersOff: Array<ParameterDTO> = [];
    public positionParameters: Array<ParameterWeightDTO> = [];

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
    ) { }

    public ngOnInit(): void {
        this.parameterService.findAll()
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (parameters: Array<ParameterDTO>) => {
                    this.parameters = parameters;
                },
                error: (err) => {
                    console.log(err);
                }
            });
    }

    public handleAddNewParameter(): void {
        const parameter = this.positionParameterForm.value?.parameter as ParameterDTO | undefined;
        const weight = this.positionParameterForm.value?.weight as number | undefined;

        if (parameter && weight) {
            const parameterName: string = this.parameters.filter((p) => p.name === parameter.name)[0].name;

            this.parametersOff.push(parameter);
            this.parameters = this.parameters.filter(p => p.name !== parameterName);

            const parameterWeight: ParameterWeightDTO = {
                id: parameter.id,
                weight: Number(this.positionParameterForm.value.weight),
                name: parameterName
            };

            this.positionParameters.push(parameterWeight);
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

    public handleSubmitSavePositionForm(): void {
        if (this.newPositionForm.valid && this.newPositionForm.value) {
            const positionRequest: PositionRequestDTO = {
                name: this.newPositionForm.value.name as string,
                description: this.newPositionForm.value.description as string,
                parameters: this.positionParameters
            }

            this.newPositionForm.reset();
            this.positionService.save(positionRequest)
                .pipe(takeUntil(this.$destroy))
                .subscribe({
                    next: () => {
                        this.changesOnService.setChangesOn(true);
                        this.messageService.clear();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Position registered successfully!',
                            life: this.toastLife
                        });
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
                    }
                });
        }

        this.newPositionForm.reset();
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
