import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { FullDataPosition } from 'src/app/models/interfaces/position/data/FullDataPosition';
import { ViewFullDataPositionEvent } from 'src/app/models/interfaces/position/events/ViewFullDataPositionEvent';
import { PositionDTO } from 'src/app/models/interfaces/position/response/PositionDTO';
import { PositionService } from 'src/app/services/position/position.service';

@Component({
  selector: 'app-positions-home',
  templateUrl: './positions-home.component.html',
  styleUrls: []
})
export class PositionsHomeComponent implements OnInit, OnDestroy {

    private readonly destroy$: Subject<void> = new Subject();
    private readonly messageLife: number = 2500;

    public positions!: PositionDTO[];

    public positionView!: boolean;
    public position!: FullDataPosition;

    constructor (
        private positionService: PositionService,

        private messageService: MessageService
    ) {
    }

    public ngOnInit(): void {
        this.setPositions();
        this.positionService.positionView$
        .pipe(takeUntil(this.destroy$))
        .subscribe (
            {
                next: (positionView) => {
                    this.positionView = positionView;
                },
                error: (err) => {
                    console.log(err);
                }
            }
        );
    }

    private setPositions(): void {
        this.messageService.clear();
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
                            life: this.messageLife
                        }
                    );
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

    public handleViewFullDataPositionAction($event: ViewFullDataPositionEvent): void {
        this.messageService.clear();
        if ($event) {
            this.positionService.findPositionParametersById($event.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe (
                {
                    next: (parameters) => {
                        const position: FullDataPosition = {
                            id: $event.id,
                            name: $event.name,
                            description: $event.description,
                            parameters: parameters
                        };
                        this.position = position;
                        this.positionService.positionView$.next(true);
                        this.messageService.add (
                            {
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Access granted successfully!',
                                life: this.messageLife
                            }
                        );
                    },
                    error: (err) => {
                        this.messageService.add (
                            {
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Unable to access the position!',
                                life: this.messageLife
                            }
                        );
                        console.log(err);
                    }
                }
            );
        }
    }

    public handleBackAction(): void {
        this.positionService.positionView$.next(false);
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
