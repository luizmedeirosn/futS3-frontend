import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FullDataPosition } from 'src/app/models/dto/position/data/FullDataPosition';

@Component({
    selector: 'app-position-view',
    templateUrl: './position-view.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None,
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
