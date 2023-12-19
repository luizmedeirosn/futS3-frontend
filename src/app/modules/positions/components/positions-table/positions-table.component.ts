import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ViewPositionAction } from 'src/app/models/interfaces/position/events/ViewPositionAction';
import { PositionDTO } from 'src/app/models/interfaces/position/response/PositionDTO';

@Component({
    selector: 'app-positions-table',
    templateUrl: './positions-table.component.html',
    styleUrls: []
})
export class PositionsTableComponent {

    @Input()
    public positions!: PositionDTO[];

    @Output()
    public viewEvent: EventEmitter<ViewPositionAction> = new EventEmitter();

    public handleViewFullDataPositionEvent(position: PositionDTO): void {
        this.viewEvent.emit(
            {
                id: position.id,
                name: position.name,
                description: position.description
            }
        );
    }

}
