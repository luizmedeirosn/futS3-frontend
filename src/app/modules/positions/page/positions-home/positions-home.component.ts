import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ViewFullDataPositionEvent } from 'src/app/models/interfaces/position/events/ViewFullDataPositionEvent';
import { PositionDTO } from 'src/app/models/interfaces/position/response/PositionDTO';
import { PositionService } from 'src/app/services/position/position.service';

@Component({
  selector: 'app-positions-home',
  templateUrl: './positions-home.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})
export class PositionsHomeComponent implements OnInit, OnDestroy {

    private readonly destroy$: Subject<void> = new Subject();
    private readonly toastLife: number = 1500;

    public positions: PositionDTO[] = [];

    constructor (
        private positionService: PositionService,

        private messageService: MessageService
    ) {
    }

    public ngOnInit(): void {
        this.setPositions();
    }

    private setPositions(): void {
        this.positionService.findAll()
        .pipe(takeUntil(this.destroy$))
        .subscribe (
            {
                next: (positions) => {
                    this.positions = positions;
                    this.messageService.add (
                        {
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Successful search completed!',
                            life: this.toastLife
                        }
                    );
                },
                error: (err) => {
                    this.messageService.add (
                        {
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Please check your internet connection!',
                            life: this.toastLife
                        }
                    );
                    console.log(err);
                }
            }
        );
    }

    public handleViewFullDataPositionAction($event: ViewFullDataPositionEvent): void {
        if ($event) {
            this.positionService.findPositionParametersById($event.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe (
                {
                    next: (parameters) => {
                        console.log(parameters);
                    },
                    error: (err) => {
                        console.log(err);
                    }
                }
            );
        }
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
