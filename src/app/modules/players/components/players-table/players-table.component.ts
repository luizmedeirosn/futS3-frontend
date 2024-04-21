import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {ViewAction} from 'src/app/models/events/ViewAction';
import PlayerMinDTO from 'src/app/models/dto/player/response/PlayerMinDTO';
import PageMin from "../../../../models/dto/generics/response/PageMin";
import {TableLazyLoadEvent} from "primeng/table";
import ChangePageAction from "../../../../models/events/ChangePageAction";

@Component({
    selector: 'app-players-table',
    templateUrl: './players-table.component.html',
    styleUrls: ['./players-table.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PlayersTableComponent {

    @Input()
    public indexFirstRow!: number;

    @Input()
    public page!: PageMin<PlayerMinDTO>;

    @Input()
    public loading!: boolean;

    @Output()
    public changePageEvent: EventEmitter<ChangePageAction> = new EventEmitter();

    @Output()
    public viewEvent: EventEmitter<ViewAction> = new EventEmitter();

    public handleViewFullDataPlayerEvent(id: number): void {
        if (id) {
            this.viewEvent.emit({
                id: id,
            });
        }
    }

    public changePlayersPage($event: TableLazyLoadEvent): void {
        if ($event && $event.first !== undefined && $event.rows) {
            console.log($event);
            const pageNumber = Math.ceil($event.first / $event.rows);
            const pageSize = $event.rows !== 0 ? $event.rows : 5;
            this.changePageEvent.emit({
                pageNumber,
                pageSize
            });
        }
    }
}
