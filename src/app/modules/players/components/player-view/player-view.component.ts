import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { EditOrDeletePlayerAction } from 'src/app/models/events/EditOrDeletePlayerAction';
import { PlayerFullDTO } from 'src/app/models/dto/player/response/PlayerFullDTO';
import { EnumPlayerEventsCrud } from 'src/app/models/enums/EnumPlayerEventsCrud';

@Component({
    selector: 'app-player-view',
    templateUrl: './player-view.component.html',
    styleUrls: ['./player-view.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PlayerViewComponent {

    public readonly playerEvents = EnumPlayerEventsCrud;

    @Input()
    public player!: PlayerFullDTO;

    @Output()
    public backEvent: EventEmitter<void> = new EventEmitter();

    @Output()
    public editOrDeletePlayerEvent: EventEmitter<EditOrDeletePlayerAction> = new EventEmitter();

    public handleBackEvent() {
        this.backEvent.emit();
    }

    public handleEditOrDeletePlayerEvent($event: EditOrDeletePlayerAction) {
        this.editOrDeletePlayerEvent.emit($event);
    }

}
