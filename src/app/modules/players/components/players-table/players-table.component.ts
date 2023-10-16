import { Component, Input } from '@angular/core';
import { FindAllPlayers } from 'src/app/models/interfaces/player/response/FindAllPlayers';

@Component({
  selector: 'app-players-table',
  templateUrl: './players-table.component.html',
  styleUrls: []
})
export class PlayersTableComponent {

    @Input()
    public players: Array<FindAllPlayers> = [];

}
