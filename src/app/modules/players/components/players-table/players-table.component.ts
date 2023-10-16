import { Component, Input } from '@angular/core';
import { FindAllPlayersDTO } from 'src/app/models/interfaces/player/response/FindAllPlayersDTO';

@Component({
  selector: 'app-players-table',
  templateUrl: './players-table.component.html',
  styleUrls: []
})
export class PlayersTableComponent {

    @Input()
    public players: Array<FindAllPlayersDTO> = [];

}
