import { Component, Input } from '@angular/core';
import { PlayerFullDTO } from 'src/app/models/interfaces/player/response/PlayerFullDTO';

@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: []
})
export class PlayerViewComponent {

    @Input()
    public player!: PlayerFullDTO;

}
