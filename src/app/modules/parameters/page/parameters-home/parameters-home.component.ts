import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ParameterMinDTO } from 'src/app/models/interfaces/parameters/response/ParameterMinDTO';
import { ParameterService } from 'src/app/services/parameter/parameter.service';

@Component({
  selector: 'app-parameters-home',
  templateUrl: './parameters-home.component.html',
  styleUrls: []
})
export class ParametersHomeComponent implements OnInit, OnDestroy {

    private readonly destroy$: Subject<void> = new Subject();

    public parameters: ParameterMinDTO[] = [];

    constructor (
        private parameterService: ParameterService
    ) {
    }

    public ngOnInit(): void {
        this.parameterService.findAllParameters()
        .pipe(takeUntil(this.destroy$))
        .subscribe (
            {
                next: (parameters) => {
                    if (parameters.length > 0) {
                        this.parameters = parameters;
                    }
                },
                error: (err) => {
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
