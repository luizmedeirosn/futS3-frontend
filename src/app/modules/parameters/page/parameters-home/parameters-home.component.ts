import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ParameterDTO } from 'src/app/models/interfaces/parameter/response/ParameterDTO';
import { ParameterService } from 'src/app/services/parameter/parameter.service';

@Component({
  selector: 'app-parameters-home',
  templateUrl: './parameters-home.component.html',
  styleUrls: []
})
export class ParametersHomeComponent implements OnInit, OnDestroy {

    private readonly destroy$: Subject<void> = new Subject();
    private readonly messageLife: number = 2500;


    public parameters!: ParameterDTO[];

    public constructor (
        private parameterService: ParameterService,

        private messageService: MessageService
    ) {
    }

    public ngOnInit(): void {
        this.setParameters();
    }

    private setParameters(): void {
        this.messageService.clear();
        this.parameterService.findAll()
        .pipe(takeUntil(this.destroy$))
        .subscribe (
            {
                next: (parameters) => {
                    if (parameters.length > 0) {
                        this.parameters = parameters;
                        this.messageService.add (
                            {
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Successful search completed!',
                                life: this.messageLife
                            }
                        );

                    }
                },
                error: (err) => {
                    this.messageService.add (
                        {
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Please check your internet connection!',
                            life: this.messageLife
                        }
                    );
                    console.log(err);
                }
            }
        );
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
