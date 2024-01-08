import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { FullDataPosition } from 'src/app/models/dto/position/data/FullDataPosition';
import { ViewPositionAction } from 'src/app/models/dto/position/events/ViewPositionAction';
import { PositionMinDTO } from 'src/app/models/dto/position/response/PositionMinDTO';
import { PositionService } from 'src/app/services/position/position.service';

@Component({
    selector: 'app-positions-home',
    templateUrl: './positions-home.component.html',
    styleUrls: []
})
export class PositionsHomeComponent implements OnInit, OnDestroy {

    private readonly $destroy: Subject<void> = new Subject();
    private readonly messageLife: number = 3000;

    public positions!: PositionMinDTO[];

    public positionView!: boolean;
    public position!: FullDataPosition;

    constructor(
        private positionService: PositionService,
        private messageService: MessageService,
    ) {
    }

    public ngOnInit(): void {
        this.setPositions();

        this.positionService.$positionView
            .pipe(takeUntil(this.$destroy))
            .subscribe(
                {
                    next: (positionView) => {
                        this.positionView = positionView;
                    },
                    error: (err) => {
                        console.log(err);
                    }
                }
            );

        this.positionService.getChangesOn()
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (changesOn: boolean) => {
                    if (changesOn) {
                        this.setPositions();
                    }
                },
                error: (err) => {
                    console.log(err);
                }
            });
    }

    private setPositions(): void {
        this.positionService.findAll()
            .pipe(takeUntil(this.$destroy))
            .subscribe(
                {
                    next: (positions) => {
                        this.positions = positions;
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

    public handleViewFullDataPositionAction($event: ViewPositionAction): void {
        this.messageService.clear();
        if ($event) {
            this.positionService.findByIdWithParameters($event.id)
                .pipe(takeUntil(this.$destroy))
                .subscribe(
                    {
                        next: (position) => {
                            this.position = position;
                            this.positionService.$positionView.next(true);
                            this.messageService.add(
                                {
                                    severity: 'success',
                                    summary: 'Success',
                                    detail: 'Access granted successfully!',
                                    life: this.messageLife
                                }
                            );
                        },
                        error: (err) => {
                            this.messageService.add(
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
        this.positionService.$positionView.next(false);
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

}
