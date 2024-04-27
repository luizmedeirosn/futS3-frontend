import {Component, EventEmitter, Input, Output} from '@angular/core';
import PositionMinDTO from 'src/app/models/dto/position/response/PositionMinDTO';
import {ViewAction} from 'src/app/models/events/ViewAction';
import Pageable from "../../../../models/dto/generics/request/Pageable";
import {BehaviorSubject} from "rxjs";
import PageMin from "../../../../models/dto/generics/response/PageMin";
import ChangePageAction from "../../../../models/events/ChangePageAction";
import {TableLazyLoadEvent} from "primeng/table";

@Component({
    selector: 'app-positions-table',
    templateUrl: './positions-table.component.html',
    styleUrls: []
})
export class PositionsTableComponent {

    @Input()
    public pageable!: Pageable;

    @Input()
    public $loading!: BehaviorSubject<boolean>;

    @Input()
    public page!: PageMin<PositionMinDTO>;

    @Output()
    public changePageEvent: EventEmitter<ChangePageAction> = new EventEmitter();

    @Output()
    public viewEvent: EventEmitter<ViewAction> = new EventEmitter();

    public handleViewFullDataPositionEvent(id: number): void {
        this.viewEvent.emit({
                id
            });
    }

    public handleChangePageEvent($event: TableLazyLoadEvent): void {
        if ($event && $event.first !== undefined && $event.rows) {
            const pageNumber: number = Math.ceil($event.first / $event.rows);
            const pageSize: number = $event.rows !== 0 ? $event.rows : 5;

            this.pageable = new Pageable(this.pageable.keyword, pageNumber, pageSize);

            this.changePageEvent.emit({
                keyword : this.pageable.keyword,
                pageNumber,
                pageSize
            });
        }
    }
}
