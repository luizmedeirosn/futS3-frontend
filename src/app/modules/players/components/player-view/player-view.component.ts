import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlayerFullDTO } from 'src/app/models/interfaces/player/response/PlayerFullDTO';

@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.scss']
})
export class PlayerViewComponent {

    @Input()
    public player!: PlayerFullDTO;

    @Output()
    public backEvent: EventEmitter<void> = new EventEmitter();

    public handleBackEvent() {
        this.backEvent.emit();
    }
}
