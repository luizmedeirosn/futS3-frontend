import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { GameModeFullDTO } from 'src/app/models/dto/gamemode/response/GameModeFullDTO';

@Component({
    selector: 'app-gamemode-view',
    templateUrl: './gamemode-view.component.html',
    styleUrls: ['./gamemode-view.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class GamemodeViewComponent {

    @Input()
    public gameMode!: GameModeFullDTO;

    @Output()
    public backEvent: EventEmitter<void> = new EventEmitter();

    public handleBackEvent(): void {
        this.backEvent.emit();
    }

}
