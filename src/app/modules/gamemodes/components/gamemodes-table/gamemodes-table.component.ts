import { GameModeMinDTO } from 'src/app/models/interfaces/gamemode/response/GameModeMinDTO';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ViewFullDataGameModeEvent } from 'src/app/models/interfaces/gamemode/event/ViewFullDataGameModeEvent';

@Component({
  selector: 'app-gamemodes-table',
  templateUrl: './gamemodes-table.component.html',
  styleUrls: []
})
export class GameModesTableComponent {

    @Input()
    public gameModes!: GameModeMinDTO[];

    @Output()
    public viewEvent: EventEmitter<ViewFullDataGameModeEvent> = new EventEmitter();

    public handleViewFullDataGameModeEvent(id: number): void {
        this.viewEvent.emit(
            {
                id
            }
        );
    }

}
