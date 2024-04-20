import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {ViewAction} from 'src/app/models/events/ViewAction';
import PlayerMinDTO from 'src/app/models/dto/player/response/PlayerMinDTO';
import PageMin from "../../../../models/dto/generics/response/PageMin";
import {Table, TableLazyLoadEvent} from "primeng/table";
import ChangePageAction from "../../../../models/events/ChangePageAction";

@Component({
    selector: 'app-players-table',
    templateUrl: './players-table.component.html',
    styleUrls: ['./players-table.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PlayersTableComponent implements OnInit {

    private $tableLazyLoadEventPreview!: TableLazyLoadEvent;

    @Input()
    public indexFirstRow!: number;

    @Input()
    public page!: PageMin<PlayerMinDTO>;

    @Input()
    public loading!: boolean;

    @ViewChild('playersTable')
    public playersTable!: Table;

    @Output()
    public changePageEvent: EventEmitter<ChangePageAction> = new EventEmitter();

    @Output()
    public viewEvent: EventEmitter<ViewAction> = new EventEmitter();

    public constructor(
        private changeDetectorRef: ChangeDetectorRef
    ) {
    }

    public ngOnInit(): void {
        this.changeDetectorRef.detectChanges();
        this.playersTable.first = this.indexFirstRow;
    }

    public handleViewFullDataPlayerEvent(id: number): void {
        if (id) {
            this.viewEvent.emit({
                id: id,
                tableLazyLoadEventPreview: this.$tableLazyLoadEventPreview
            });
        }
    }

    public changePlayersPage($event: TableLazyLoadEvent): void {
        if ($event && $event.first !== undefined && $event.rows) {
            this.$tableLazyLoadEventPreview = $event;
            const pageNumber = Math.ceil($event.first / $event.rows);
            const pageSize = $event.rows;
            console.log(pageNumber, pageSize);
            this.changePageEvent.emit({
                pageNumber,
                pageSize
            });
        }
    }
}
