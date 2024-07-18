import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FullDataPosition } from 'src/app/models/dto/position/aux/FullDataPosition';
import { EditOrDeletePositionAction } from 'src/app/models/events/EditOrDeletePositionAction';
import { EnumPositionEventsCrud } from 'src/app/models/enums/EnumPositionEventsCrud';

@Component({
  selector: 'app-position-view',
  templateUrl: './position-view.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
})
export class PositionViewComponent {
  public readonly positionEvents = EnumPositionEventsCrud;

  @Input()
  public position!: FullDataPosition;

  @Output()
  public backEvent: EventEmitter<void> = new EventEmitter();

  @Output()
  public editOrDeletePositionEvent: EventEmitter<EditOrDeletePositionAction> = new EventEmitter();

  public handleBackEvent() {
    this.backEvent.emit();
  }

  public handleEditOrDeletePositionEvent($event: EditOrDeletePositionAction) {
    this.editOrDeletePositionEvent.emit($event);
  }
}
