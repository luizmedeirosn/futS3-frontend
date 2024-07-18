import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { GameModeDTO } from 'src/app/models/dto/gamemode/response/GameModeDTO';
import { EnumGameModeEventsCrud } from 'src/app/models/enums/EnumGameModeEventsCrud';
import { EditOrDeleteGameModeAction } from 'src/app/models/events/EditOrDeleteGameModeAction';

@Component({
  selector: 'app-gamemode-view',
  templateUrl: './gamemode-view.component.html',
  styleUrls: ['./gamemode-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GamemodeViewComponent {
  public readonly gameModeEvents = EnumGameModeEventsCrud;

  @Input()
  public gameMode!: GameModeDTO;

  @Output()
  public backEvent: EventEmitter<void> = new EventEmitter();

  @Output()
  public editOrDeleteGameModeEvent: EventEmitter<EditOrDeleteGameModeAction> = new EventEmitter();

  public handleBackEvent() {
    this.backEvent.emit();
  }

  public handleEditOrDeleteGameModeEvent($event: EditOrDeleteGameModeAction) {
    this.editOrDeleteGameModeEvent.emit($event);
  }
}
