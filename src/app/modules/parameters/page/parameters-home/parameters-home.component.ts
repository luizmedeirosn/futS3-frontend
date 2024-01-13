import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ParameterDTO } from 'src/app/models/dto/parameter/response/ParameterDTO';
import { ParameterService } from 'src/app/services/parameter/parameter.service';
import { ChangesOnService } from 'src/app/shared/services/changed-on/changes-on.service';

@Component({
    selector: 'app-parameters-home',
    templateUrl: './parameters-home.component.html',
    styleUrls: []
})
export class ParametersHomeComponent implements OnInit, OnDestroy {

    private readonly $destroy: Subject<void> = new Subject();
    private readonly messageLife: number = 3000;


    public parameters!: ParameterDTO[];

    public constructor(
        private parameterService: ParameterService,
        private messageService: MessageService,
        private changesOnService: ChangesOnService
    ) {
    }

    public ngOnInit(): void {
        this.setParameters();

        this.changesOnService.getChangesOn()
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (changesOn: boolean) => {
                    if (changesOn) {
                        this.setParameters();
                    }
                },
                error: (err) => {
                    console.log(err);
                }
            });
    }

    private setParameters(): void {
        this.parameterService.findAll()
            .pipe(takeUntil(this.$destroy))
            .subscribe(
                {
                    next: (parameters) => {
                        if (parameters.length > 0) {
                            this.parameters = parameters;
                        }
                    },
                    error: (err) => {
                        this.messageService.clear();
                        this.messageService.add(
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
        this.$destroy.next();
        this.$destroy.complete();
    }

}
