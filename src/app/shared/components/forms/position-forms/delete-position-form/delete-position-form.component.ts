import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {BehaviorSubject, Subject, takeUntil} from 'rxjs';
import PositionMinDTO from 'src/app/models/dto/position/response/PositionMinDTO';
import {PositionService} from 'src/app/services/position/position.service';
import {ChangesOnService} from 'src/app/shared/services/changes-on/changes-on.service';
import Page from "../../../../../models/dto/generics/response/Page";
import Pageable from "../../../../../models/dto/generics/request/Pageable";
import PageMin from "../../../../../models/dto/generics/response/PageMin";
import {TableLazyLoadEvent} from "primeng/table";

@Component({
    selector: 'app-delete-position-form',
    templateUrl: './delete-position-form.component.html',
    styleUrls: ['./delete-position-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DeletePositionFormComponent implements OnInit, OnDestroy {

    private readonly $destroy: Subject<void> = new Subject();
    private readonly toastLife: number = 2000;

    public pageable!: Pageable;
    public $loading!: BehaviorSubject<boolean>;
    public page!: PageMin<PositionMinDTO>;

    public constructor(
        private positionService: PositionService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private changesOnService: ChangesOnService,
    ) {
        this.pageable = new Pageable('', 0, 5);
        this.$loading = new BehaviorSubject(false);
        this.page = {
            content: [],
            pageNumber: 0,
            pageSize: 5,
            totalElements: 0
        };
    }

    public ngOnInit(): void {
        this.page.totalElements === 0 && this.setPositionsWithApi(this.pageable);
    }

    private setPositionsWithApi(pageable: Pageable): void {
        this.pageable = pageable;

        this.$loading.next(true);

        setTimeout(() => {
            this.positionService.findAll(pageable)
                .pipe(takeUntil(this.$destroy))
                .subscribe({
                    next: (positionsPage: Page<PositionMinDTO>) => {
                        this.page.content = positionsPage.content;
                        this.page.pageNumber = positionsPage.pageable.pageNumber;
                        this.page.pageSize = positionsPage.pageable.pageSize;
                        this.page.totalElements = positionsPage.totalElements;

                        this.$loading.next(false);
                    },
                    error: (err) => {
                        this.messageService.clear();
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to retrieve the data!',
                            life: this.toastLife
                        });

                        console.log(err);

                        this.$loading.next(false);
                    }
                });
        }, 500);
    }

    public handleChangePageAction($event: TableLazyLoadEvent) {
        if ($event && $event.first !== undefined && $event.rows) {
            const pageNumber = Math.ceil($event.first / $event.rows);
            const pageSize = $event.rows !== 0 ? $event.rows : 5;

            this.setPositionsWithApi(new Pageable(this.pageable.keyword, pageNumber, pageSize));
        }
    }

    public handleDeletePositionEvent($event: PositionMinDTO): void {
        if ($event) {
            this.confirmationService.confirm({
                message: `Confirm the deletion of position: ${$event?.name}?`,
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Yes',
                rejectLabel: 'No',
                acceptButtonStyleClass: 'p-button-danger',
                rejectButtonStyleClass: 'p-button-text',
                acceptIcon: "none",
                rejectIcon: "none",
                accept: () => this.handleDeletePositionAction($event?.id)
            });
        }
    }

    public handleDeletePositionAction(id: number): void {
        if (id) {
            this.messageService.clear();

            this.$loading.next(true);

            setTimeout(() => {
                this.positionService.deleteById(id)
                .pipe(takeUntil(this.$destroy))
                .subscribe({
                    next: () => {
                        this.positionService.changedPositionId = undefined;
                        this.changesOnService.setChangesOn(true);

                        this.$loading.next(false);

                        this.setPositionsWithApi(this.pageable);

                        this.messageService.clear();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Position deleted successfully!',
                            life: this.toastLife
                        });
                    },
                    error: (err) => {
                        this.messageService.clear();
                        this.messageService.add({
                            key: 'deletion-error',
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Is the position part of a game mode or a player!',
                            life: 6000
                        });

                        console.log(err);

                        this.changesOnService.setChangesOn(false);

                        this.$loading.next(false);
                    }
                });
            }, 500);
        }
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }
}
