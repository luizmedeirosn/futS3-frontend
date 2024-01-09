import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ParameterRequestDTO } from 'src/app/models/dto/parameter/request/ParameterRequestDTO';
import { ParameterDTO } from 'src/app/models/dto/parameter/response/ParameterDTO';
import { ParameterService } from 'src/app/services/parameter/parameter.service';

@Component({
    selector: 'app-edit-parameter-form',
    templateUrl: './edit-parameter-form.component.html',
    styleUrls: ['./edit-parameter-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditParameterFormComponent implements OnInit, OnDestroy {

    private readonly $destroy: Subject<void> = new Subject();
    private readonly toastLife: number = 2000;

    @ViewChild('parametersTable') public parametersTable!: Table;
    private parametersTablePages: Array<Array<ParameterDTO>> = new Array();

    public $viewTable: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public parameters!: Array<ParameterDTO>;
    public selectedParameter!: ParameterDTO | undefined;

    public editParameterForm: any = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        description: ['', Validators.maxLength(2000)],
    });

    public constructor(
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private parameterService: ParameterService
    ) {
    }

    public ngOnInit(): void {
        this.setParametersWithApi();
    }

    private setParametersWithApi(): void {
        this.parameterService.findAll()
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (parameters: Array<ParameterDTO>) => {
                    if (parameters.length > 0) {
                        this.parameters = parameters;

                        let increment: number = 0;
                        let page: Array<ParameterDTO> = new Array();

                        parameters.forEach((parameter, index, array) => {
                            page.push(parameter);
                            increment += 1;
                            if (increment === 5 || index === array.length - 1) {
                                this.parametersTablePages.push(page);
                                page = new Array();
                                increment = 0;
                            }
                        });
                    }
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

    public handleSelectParameter($event: number): void {
        if ($event) {
            this.setParametersWithApi();
            this.parameterService.findById($event)
                .pipe(takeUntil(this.$destroy))
                .subscribe({
                    next: (parameter: ParameterDTO) => {
                        if (parameter) {
                            this.selectedParameter = parameter;
                            this.editParameterForm.setValue({
                                name: parameter?.name,
                                description: parameter?.description,
                            });
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
        this.$viewTable.next(true); // Ativar a view child antes de referenciar a tabela.
        setTimeout(() => {
            if (this.selectedParameter?.id) {
                const selectedParameter: ParameterDTO | undefined = this.parameters.find(parameter => parameter.id === this.selectedParameter?.id);

                if (selectedParameter) {
                    const index = this.parameters.indexOf(selectedParameter);
                    const numPage: number = Math.floor(index / 5);
                    const page = this.parametersTablePages.at(numPage);
                    const firstParameterPage: ParameterDTO | undefined = page?.at(0);

                    if (firstParameterPage) {
                        const parameter: ParameterDTO | undefined = this.parameters.find(parameter => parameter.id === firstParameterPage.id);

                        this.parametersTable.first = parameter && this.parameters.indexOf(parameter);
                        console.log(this.parameters)
                        console.log(firstParameterPage);
                    }
                }
            }
            this.selectedParameter = undefined;
        }, 10);
    }

    public handleSubmitEditParameterForm(): void {
        const parameterResquest: ParameterRequestDTO = {
            name: this.editParameterForm.value.name as string,
            description: this.editParameterForm.value.description as string
        };

        this.selectedParameter &&
            this.parameterService.updateById(this.selectedParameter?.id, parameterResquest)
                .pipe(takeUntil(this.$destroy))
                .subscribe({
                    next: (parameter: ParameterDTO) => {
                        const parameterUpdated = this.parameters.find(p => p.id === this.selectedParameter?.id);
                        parameterUpdated && (parameterUpdated.name = parameter.name);

                        this.parameterService.setChangesOn(true);
                        this.messageService.clear();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Parameter successfully registered!',
                            life: this.toastLife
                        });

                        this.handleBackAction();
                    },
                    error: (err) => {
                        this.parameterService.setChangesOn(false);
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

        this.editParameterForm.reset();
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

}
