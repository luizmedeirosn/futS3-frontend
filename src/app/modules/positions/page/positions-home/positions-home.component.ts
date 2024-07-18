import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { FullDataPosition } from 'src/app/models/dto/position/aux/FullDataPosition';
import { EditOrDeletePositionAction } from 'src/app/models/events/EditOrDeletePositionAction';
import PositionMinDTO from 'src/app/models/dto/position/response/PositionMinDTO';
import { EnumPositionEventsCrud } from 'src/app/models/enums/EnumPositionEventsCrud';
import { PositionService } from 'src/app/services/position/position.service';
import { EditPositionFormComponent } from 'src/app/shared/components/forms/position-forms/edit-position-form/edit-position-form.component';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog/custom-dialog.service';
import { ChangesOnService } from '../../../../shared/services/changes-on/changes-on.service';
import { ViewAction } from 'src/app/models/events/ViewAction';
import Page from '../../../../models/dto/generics/response/Page';
import Pageable from '../../../../models/dto/generics/request/Pageable';
import PageMin from '../../../../models/dto/generics/response/PageMin';
import ChangePageAction from '../../../../models/events/ChangePageAction';

@Component({
  selector: 'app-positions-home',
  templateUrl: './positions-home.component.html',
  styleUrls: [],
})
export class PositionsHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  private readonly messageLife: number = 3000;

  public pageable!: Pageable;
  public loading$!: BehaviorSubject<boolean>;
  public page!: PageMin<PositionMinDTO>;

  // The view is also controlled by the menu bar, so the observable is necessary. Use case: The view screen is active and the 'Find All' is triggered
  public positionView$!: Subject<boolean>;

  public position!: FullDataPosition;

  private dynamicDialogRef!: DynamicDialogRef;

  public constructor(
    public changeDetectorRef: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private positionService: PositionService,
    private customDialogService: CustomDialogService,
    private changesOnService: ChangesOnService,
  ) {
    this.pageable = new Pageable('', 0, 5);
    this.loading$ = new BehaviorSubject(false);
    this.page = {
      content: [],
      pageNumber: 0,
      pageSize: 5,
      totalElements: 0,
    };

    this.positionView$ = this.positionService.positionView$;
  }

  public ngOnInit(): void {
    this.page.totalElements === 0 && this.setPositionsWithApi(this.pageable);

    this.changesOnService
      .getChangesOn()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (changesOn: boolean) => {
          if (changesOn) {
            this.setPositionsWithApi(this.pageable);

            const changedPositionId: number | undefined = this.positionService.changedPositionId;
            changedPositionId ? this.selectPosition(changedPositionId) : this.handleBackAction();
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  private setPositionsWithApi(pageable: Pageable): void {
    this.pageable = pageable;

    this.loading$.next(true);

    setTimeout(() => {
      this.positionService
        .findAll(pageable)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (positionsPage: Page<PositionMinDTO>) => {
            this.page.content = positionsPage.content;
            this.page.pageNumber = positionsPage.pageable.pageNumber;
            this.page.pageSize = positionsPage.pageable.pageSize;
            this.page.totalElements = positionsPage.totalElements;

            this.loading$.next(false);
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

            this.loading$.next(false);
          },
        });
    }, 500);
  }

  public handleChangePageAction($event: ChangePageAction) {
    if ($event && $event.keyword !== undefined) {
      this.setPositionsWithApi(new Pageable($event.keyword, $event.pageNumber, $event.pageSize));
    }
  }

  public handleViewFullDataPositionAction($event: ViewAction): void {
    this.selectPosition($event.id);
  }

  private selectPosition(id: number) {
    id &&
      this.positionService
        .findById(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (position) => {
            this.position = position;
            this.positionService.changedPositionId = id;

            this.positionService.positionView$.next(true);
          },
          error: (err) => {
            this.messageService.clear();
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Unable to access the position!',
              life: this.messageLife,
            });

            console.log(err);
          },
        });
  }

  public handleBackAction(): void {
    // Disable the selection of a game mode set in getChangesOn when the back button is pressed
    this.positionService.changedPositionId = undefined;

    // Do not change the order of actions
    this.positionService.positionView$.next(false);
    this.changeDetectorRef.detectChanges();
  }

  public handleEditOrDeletePositionEvent($event: EditOrDeletePositionAction): void {
    if ($event && $event.action === EnumPositionEventsCrud.EDIT) {
      this.dynamicDialogRef = this.customDialogService.open(EditPositionFormComponent, {
        position: 'top',
        header: EnumPositionEventsCrud.EDIT.valueOf(),
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        data: {
          $event: EnumPositionEventsCrud.EDIT,
          selectedPositionId: $event.id,
        },
      });

      this.dynamicDialogRef.onClose.pipe(takeUntil(this.destroy$)).subscribe(() => this.selectPosition($event.id));
    }

    $event && $event.action === EnumPositionEventsCrud.DELETE && this.deletePositionConfirmation();
  }

  private deletePosition(id: number): void {
    id &&
      this.positionService
        .deleteById(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.clear();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Position deleted successfully!',
              life: 2000,
            });

            this.positionService.changedPositionId = undefined;
            this.changesOnService.setChangesOn(true);

            this.handleBackAction();
          },
          error: (err) => {
            console.log(err);
            this.messageService.clear();
            this.messageService.add({
              key: 'deletion-error',
              severity: 'error',
              summary: 'Error',
              detail: 'Is the position part of a game mode or a player!',
              life: 6000,
            });

            this.changesOnService.setChangesOn(false);
          },
        });
  }

  private deletePositionConfirmation(): void {
    this.position &&
      this.confirmationService.confirm({
        message: `Confirm the deletion of position: ${this.position.name}?`,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Yes',
        rejectLabel: 'No',
        acceptButtonStyleClass: 'p-button-danger',
        rejectButtonStyleClass: 'p-button-text',
        acceptIcon: 'none',
        rejectIcon: 'none',
        accept: () => this.deletePosition(this.position.id),
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
