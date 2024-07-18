import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ParameterDTO } from 'src/app/models/dto/parameter/response/ParameterDTO';
import { ParameterService } from 'src/app/services/parameter/parameter.service';
import { ChangesOnService } from 'src/app/shared/services/changes-on/changes-on.service';
import Page from '../../../../models/dto/generics/response/Page';
import Pageable from '../../../../models/dto/generics/request/Pageable';
import PageMin from '../../../../models/dto/generics/response/PageMin';
import ChangePageAction from '../../../../models/events/ChangePageAction';

@Component({
  selector: 'app-parameters-home',
  templateUrl: './parameters-home.component.html',
  styleUrls: [],
})
export class ParametersHomeComponent implements OnInit, OnDestroy {
  private readonly $destroy: Subject<void> = new Subject();
  private readonly messageLife: number = 3000;

  public pageable!: Pageable;
  public $loading!: BehaviorSubject<boolean>;
  public page!: PageMin<ParameterDTO>;

  public constructor(
    private parameterService: ParameterService,
    private messageService: MessageService,
    private changesOnService: ChangesOnService,
  ) {
    this.pageable = new Pageable('', 0, 5);
    this.$loading = new BehaviorSubject(false);
    this.page = {
      content: [],
      pageNumber: 0,
      pageSize: 5,
      totalElements: 0,
    };
  }

  public ngOnInit(): void {
    this.page.totalElements === 0 && this.setParametersWithApi(this.pageable);

    this.changesOnService
      .getChangesOn()
      .pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (changesOn: boolean) => {
          if (changesOn) {
            this.setParametersWithApi(this.pageable);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  private setParametersWithApi(pageable: Pageable): void {
    this.pageable = pageable;

    this.$loading.next(true);

    setTimeout(() => {
      this.parameterService
        .findAll(pageable)
        .pipe(takeUntil(this.$destroy))
        .subscribe({
          next: (parametersPage: Page<ParameterDTO>) => {
            this.page.content = parametersPage.content;
            this.page.pageNumber = parametersPage.pageable.pageNumber;
            this.page.pageSize = parametersPage.pageable.pageSize;
            this.page.totalElements = parametersPage.totalElements;

            this.$loading.next(false);
          },
          error: (err) => {
            this.messageService.clear();
            err.status != 403 &&
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Unexpected error!',
                life: this.messageLife,
              });

            console.log(err);

            this.$loading.next(false);
          },
        });
    }, 500);
  }

  public handleChangePageAction($event: ChangePageAction) {
    if ($event && $event.keyword !== undefined) {
      this.setParametersWithApi(new Pageable($event.keyword, $event.pageNumber, $event.pageSize));
    }
  }

  public ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
