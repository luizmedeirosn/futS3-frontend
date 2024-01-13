import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PositionMinDTO } from 'src/app/models/dto/position/response/PositionMinDTO';
import { ViewAction } from 'src/app/models/events/ViewAction';

@Component({
    selector: 'app-positions-table',
    templateUrl: './positions-table.component.html',
    styleUrls: []
})
export class PositionsTableComponent {

    @Input()
    public positions!: PositionMinDTO[];

    @Output()
    public viewEvent: EventEmitter<ViewAction> = new EventEmitter();

    public handleViewFullDataPositionEvent(position: PositionMinDTO): void {
        this.viewEvent.emit(
            {
                id: position.id,
                name: position.name,
                description: position.description
            }
        );
    }

}
