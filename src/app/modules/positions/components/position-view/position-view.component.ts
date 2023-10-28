import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FullDataPosition } from 'src/app/models/interfaces/position/data/FullDataPosition';

@Component({
    selector: 'app-position-view',
    templateUrl: './position-view.component.html',
    styleUrls: ['./position-view.component.scss']
})
export class PositionViewComponent {

    @Input()
    public position!: FullDataPosition;

    @Output()
    public backEvent: EventEmitter<void> = new EventEmitter();


    public handleBackEvent() {
        this.backEvent.emit();
    }

}
