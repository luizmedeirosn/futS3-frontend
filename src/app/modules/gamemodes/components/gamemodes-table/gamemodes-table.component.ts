import { GameModeMinDTO } from 'src/app/models/dto/gamemode/response/GameModeMinDTO';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ViewGameModeAction } from 'src/app/models/dto/gamemode/event/ViewGameModeAction';

@Component({
    selector: 'app-gamemodes-table',
    templateUrl: './gamemodes-table.component.html',
    styleUrls: []
})
export class GameModesTableComponent {

    @Input()
    public gameModes!: GameModeMinDTO[];

    @Output()
    public viewEvent: EventEmitter<ViewGameModeAction> = new EventEmitter();

    public handleViewFullDataGameModeEvent(id: number): void {
        this.viewEvent.emit(
            {
                id
            }
        );
    }

}
