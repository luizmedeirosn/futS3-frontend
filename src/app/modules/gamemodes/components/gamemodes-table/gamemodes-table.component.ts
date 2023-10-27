import { Component, Input } from '@angular/core';
import { GameModeMinDTO } from '../../../../models/interfaces/gamemode/response/GameModeMinDTO';

@Component({
  selector: 'app-gamemodes-table',
  templateUrl: './gamemodes-table.component.html',
  styleUrls: []
})
export class GameModesTableComponent {

    @Input()
    public gameModes: GameModeMinDTO[]= [];

}
