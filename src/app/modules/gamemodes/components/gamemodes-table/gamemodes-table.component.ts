import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GameModeMinDTO } from 'src/app/models/dto/gamemode/response/GameModeMinDTO';
import { ViewAction } from 'src/app/models/events/ViewAction';
import Pageable from '../../../../models/dto/generics/request/Pageable';
import { BehaviorSubject, Subject } from 'rxjs';
import PageMin from '../../../../models/dto/generics/response/PageMin';
import ChangePageAction from '../../../../models/events/ChangePageAction';
import { TableLazyLoadEvent } from 'primeng/table';

@Component({
  selector: 'app-gamemodes-table',
  templateUrl: './gamemodes-table.component.html',
  styleUrls: [],
})
export class GameModesTableComponent implements OnInit {
  @Input()
  public pageable!: Pageable;

  @Input()
  public $loading!: BehaviorSubject<boolean>;

  @Input()
  public page!: PageMin<GameModeMinDTO>;

  // The change detection is related to the change of state of the view
  @Input()
  public gameModeView$!: Subject<boolean>;

  // Access to the change detector of the parent component to notify the changes
  @Input()
  public homeChangeDetectorRef!: ChangeDetectorRef;

  @Output()
  public changePageEvent: EventEmitter<ChangePageAction> = new EventEmitter();

  @Output()
  public viewEvent: EventEmitter<ViewAction> = new EventEmitter();

  public ngOnInit() {
    // Changes in the table state through positionView$ from the menubar need to be detected by the 'parent component'
    this.gameModeView$.subscribe(() => this.homeChangeDetectorRef.detectChanges());
  }

  public handleChangePageEvent($event: TableLazyLoadEvent): void {
    if ($event && $event.first !== undefined && $event.rows) {
      const pageNumber: number = Math.ceil($event.first / $event.rows);
      const pageSize: number = $event.rows !== 0 ? $event.rows : 5;

      this.pageable = new Pageable(this.pageable.keyword, pageNumber, pageSize);

      this.changePageEvent.emit({
        keyword: this.pageable.keyword,
        pageNumber,
        pageSize,
      });
    }
  }

  public handleViewFullDataGameModeEvent(id: number): void {
    this.viewEvent.emit({
      id,
    });
  }
}
