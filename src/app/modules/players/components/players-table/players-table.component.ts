import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ViewFullDataPlayerEvent } from 'src/app/models/interfaces/player/events/ViewFullDataPlayerEvent';
import { PlayerMinDTO } from 'src/app/models/interfaces/player/response/PlayerMinDTO';

@Component({
  selector: 'app-players-table',
  templateUrl: './players-table.component.html',
  styleUrls: ['./players-table.component.scss']
})
export class PlayersTableComponent {

    @Input()
    public players: Array<PlayerMinDTO> = [];

    @Output()
    public viewEvent: EventEmitter<ViewFullDataPlayerEvent> = new EventEmitter<ViewFullDataPlayerEvent>();

    public handleViewFullDataPlayerEvent(id: number) {
        this.viewEvent.emit({ id });
    }

}
