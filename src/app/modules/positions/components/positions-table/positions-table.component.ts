import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import PositionMinDTO from 'src/app/models/dto/position/response/PositionMinDTO';
import {ViewAction} from 'src/app/models/events/ViewAction';
import Pageable from "../../../../models/dto/generics/request/Pageable";
import {BehaviorSubject, Subject} from "rxjs";
import PageMin from "../../../../models/dto/generics/response/PageMin";
import ChangePageAction from "../../../../models/events/ChangePageAction";
import {TableLazyLoadEvent} from "primeng/table";

@Component({
    selector: 'app-positions-table',
    templateUrl: './positions-table.component.html',
    styleUrls: []
})
export class PositionsTableComponent implements OnInit {

    @Input()
    public pageable!: Pageable;

    @Input()
    public loading$!: BehaviorSubject<boolean>;

    @Input()
    public page!: PageMin<PositionMinDTO>;

    // The change detection is related to the change of state of the view
    @Input()
    public positionView$!: Subject<boolean>;

    // Access to the change detector of the parent component to notify the changes
    @Input()
    public homeChangeDetectorRef!: ChangeDetectorRef

    @Output()
    public changePageEvent: EventEmitter<ChangePageAction> = new EventEmitter();

    @Output()
    public viewEvent: EventEmitter<ViewAction> = new EventEmitter();

    public ngOnInit() {
        // Changes in the table state through positionView$ from the menubar need to be detected by the 'parent component'
        this.positionView$.subscribe(() => this.homeChangeDetectorRef.detectChanges());
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

    public handleViewFullDataPositionEvent(id: number): void {
        this.viewEvent.emit({
            id
        });
    }
}
