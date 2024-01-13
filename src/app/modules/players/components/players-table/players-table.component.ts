import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ViewAction } from 'src/app/models/events/ViewAction';
import { PlayerMinDTO } from 'src/app/models/dto/player/response/PlayerMinDTO';

@Component({
    selector: 'app-players-table',
    templateUrl: './players-table.component.html',
    styleUrls: ['./players-table.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PlayersTableComponent {

    @Input()
    public players!: Array<PlayerMinDTO>;

    @Output()
    public viewEvent: EventEmitter<ViewAction> = new EventEmitter();

    public handleViewFullDataPlayerEvent(id: number): void {
        this.viewEvent.emit({ id });
    }

}
