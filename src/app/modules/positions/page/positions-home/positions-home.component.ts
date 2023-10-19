import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PositionDTO } from 'src/app/models/interfaces/position/response/PositionDTO';
import { PositionService } from 'src/app/services/position/position.service';

@Component({
  selector: 'app-positions-home',
  templateUrl: './positions-home.component.html',
  styleUrls: []
})
export class PositionsHomeComponent implements OnInit, OnDestroy {

    private readonly destroy$: Subject<void> = new Subject();

    public positions: PositionDTO[] = [];

    constructor (
        private positionService: PositionService
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
                    if (positions.length > 0) {
                        this.positions = positions;
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
