import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ParameterDTO } from 'src/app/models/dto/parameter/response/ParameterDTO';
import { ParameterWeightDTO } from 'src/app/models/dto/position/data/ParameterWeightDTO';
import { PositionRequestDTO } from 'src/app/models/dto/position/request/PositionRequestDTO';
import { ParameterService } from 'src/app/services/parameter/parameter.service';
import { PositionService } from 'src/app/services/position/position.service';

@Component({
    selector: 'app-save-position-form',
    templateUrl: './save-position-form.component.html',
    styleUrls: []
})
export class SavePositionFormComponent implements OnInit, OnDestroy {

    private readonly $destroy: Subject<void> = new Subject();
    private readonly toastLife: number = 2000;

    public parameters!: Array<ParameterDTO>;
    private parametersOff: Array<ParameterDTO> = new Array();
    public positionParameters: Array<ParameterWeightDTO> = new Array();

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
    };

    public handleDeletePositionParameter($event: number): void {
        this.positionParameters = this.positionParameters.filter(p => p.id !== $event);
        const parameter: ParameterDTO | undefined = this.parametersOff.find((p) => p.id === $event);
        parameter && this.parameters.push(parameter);
        this.parameters.sort(this.compareParameters);
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
                        this.positionService.setChangesOn(true);
                        this.messageService.clear();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Position successfully registered!',
                            life: this.toastLife
                        });
                    },
                    error: (err) => {
                        this.positionService.setChangesOn(false);
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
        this.parameters.sort(this.compareParameters);
        this.parametersOff = new Array();
        this.positionParameters = new Array();
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

}
