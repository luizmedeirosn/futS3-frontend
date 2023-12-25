import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { PlayerFullDTO } from 'src/app/models/dto/player/response/PlayerFullDTO';

@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
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
