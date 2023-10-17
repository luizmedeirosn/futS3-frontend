import { Component, Input } from '@angular/core';
import { GameModeDTO } from './../../../../models/interfaces/gamemode/response/GameModeDTO';

@Component({
  selector: 'app-gamemodes-table',
  templateUrl: './gamemodes-table.component.html',
  styleUrls: []
})
export class GameModesTableComponent {

    @Input()
    public gameModes: GameModeDTO[]= [];

}
