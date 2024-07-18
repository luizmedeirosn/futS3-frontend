import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ParameterDTO } from 'src/app/models/dto/parameter/response/ParameterDTO';
import Pageable from '../../../../models/dto/generics/request/Pageable';
import { BehaviorSubject } from 'rxjs';
import PageMin from '../../../../models/dto/generics/response/PageMin';
import ChangePageAction from '../../../../models/events/ChangePageAction';
import { TableLazyLoadEvent } from 'primeng/table';

@Component({
  selector: 'app-parameters-table',
  templateUrl: './parameters-table.component.html',
  styleUrls: [],
})
export class ParametersTableComponent {
  @Input()
  public pageable!: Pageable;

  @Input()
  public $loading!: BehaviorSubject<boolean>;

  @Input()
  public page!: PageMin<ParameterDTO>;

  @Output()
  public changePageEvent: EventEmitter<ChangePageAction> = new EventEmitter();

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
}
