import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ViewPlayerAction } from 'src/app/models/dto/player/events/ViewPlayerAction';
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
    public viewEvent: EventEmitter<ViewPlayerAction> = new EventEmitter();

    public handleViewFullDataPlayerEvent(id: number): void {
        this.viewEvent.emit({ id });
    }

}
