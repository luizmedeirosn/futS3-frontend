import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameModeMinDTO } from 'src/app/models/dto/gamemode/response/GameModeMinDTO';
import { ViewAction } from 'src/app/models/events/ViewAction';

@Component({
    selector: 'app-gamemodes-table',
    templateUrl: './gamemodes-table.component.html',
    styleUrls: []
})
export class GameModesTableComponent {

    @Input()
    public gameModes!: GameModeMinDTO[];

    @Output()
    public viewEvent: EventEmitter<ViewAction> = new EventEmitter();

    public handleViewFullDataGameModeEvent(id: number): void {
        this.viewEvent.emit(
            {
                id
            }
        );
    }

}
