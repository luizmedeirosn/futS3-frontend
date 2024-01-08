import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ParameterRequestDTO } from 'src/app/models/dto/parameter/request/ParameterRequestDTO';
import { ParameterDTO } from 'src/app/models/dto/parameter/response/ParameterDTO';
import { ParameterService } from 'src/app/services/parameter/parameter.service';

@Component({
    selector: 'app-save-parameter-form',
    templateUrl: './save-parameter-form.component.html',
    styleUrls: []
})
export class SaveParameterFormComponent implements OnDestroy {

    private readonly $destroy: Subject<void> = new Subject();
    private readonly toastLife: number = 2000;

    public newParameterForm: any = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        description: ['', Validators.maxLength(2000)],
    });

    public constructor(
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private parameterService: ParameterService
    ) {
    }

    public handleSubmitSaveParameterForm(): void {
        const parameterResquest: ParameterRequestDTO = {
            name: this.newParameterForm.value.name as string,
            description: this.newParameterForm.value.description as string
        };

        this.parameterService.save(parameterResquest)
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (parameter: ParameterDTO) => {
                    this.parameterService.setChangesOn(true);
                    this.messageService.clear();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Parameter registered successfully!',
                        life: this.toastLife
                    });
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
                }
            });

        this.newParameterForm.reset();
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

}
