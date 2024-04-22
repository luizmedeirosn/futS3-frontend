import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import PlayerMinDTO from 'src/app/models/dto/player/response/PlayerMinDTO';
import { PlayerService } from 'src/app/services/player/player.service';
import { ChangesOnService } from 'src/app/shared/services/changes-on/changes-on.service';
import PageMin from "../../../../../models/dto/generics/response/PageMin";
import Page from "../../../../../models/dto/generics/response/Page";
import {TableLazyLoadEvent} from "primeng/table";
import Pageable from "../../../../../models/dto/generics/request/Pageable";

@Component({
    selector: 'app-delete-players-form',
    templateUrl: './delete-player-form.component.html',
    styleUrls: ['./delete-player-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DeletePlayerFormComponent implements OnInit, OnDestroy {

    private readonly $destroy: Subject<void> = new Subject();
    private readonly toastLife: number = 2000;

    public $loadingDeletion: BehaviorSubject<boolean> =
        new BehaviorSubject(false);

    private pageable!: Pageable;
    public loading!: boolean;
    public page!: PageMin<PlayerMinDTO>;

    public constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,

        private playerService: PlayerService,
        private changesOnService: ChangesOnService,
    ) {
        this.page = {
            content: [],
            pageNumber: 0,
            pageSize: 5,
            totalElements: 0
        };
        this.pageable = new Pageable(0, 10, "name", 1);
    }

    public ngOnInit(): void {
        this.page.totalElements === 0 &&
            this.setPlayersWithApi(this.pageable);
    }

    private setPlayersWithApi(pageable: Pageable): void {
        this.pageable = pageable;
        this.loading = true;
        setTimeout(() => {
            this.playerService.findAll(pageable)
                .pipe(takeUntil(this.$destroy))
                .subscribe(
                    {
                        next: (playersPage: Page<PlayerMinDTO>) => {
                            if (playersPage.size > 0) {
                                this.page.content = playersPage.content;
                                this.page.pageNumber = playersPage.pageable.pageNumber;
                                this.page.pageSize = playersPage.pageable.pageSize;
                                this.page.totalElements = playersPage.totalElements;
                            }
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
                        }
                    }
                );

            this.loading = false;
        }, 500);
    }

    public handleChangePageAction($event: TableLazyLoadEvent) {
        if ($event && $event.first !== undefined && $event.rows) {
            const pageNumber = Math.ceil($event.first / $event.rows);
            const pageSize = $event.rows !== 0 ? $event.rows : 10;

            const fields = $event.sortField ?? "name";
            const sortField = Array.isArray(fields) ? fields[0]: fields;

            const sortDirection = $event.sortOrder ?? 1;

            this.setPlayersWithApi(new Pageable(pageNumber, pageSize, sortField, sortDirection));
        }
    }

    public handleDeletePlayerEvent($event: PlayerMinDTO): void {
        if ($event) {
            this.confirmationService.confirm({
                message: `Confirm the deletion of player: ${$event?.name}?`,
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Yes',
                rejectLabel: 'No',
                acceptButtonStyleClass: 'p-button-danger',
                rejectButtonStyleClass: 'p-button-text',
                acceptIcon: "none",
                rejectIcon: "none",
                accept: () => this.handleDeletePlayerAction($event?.id)
            });
        }
    }

    public handleDeletePlayerAction($event: number): void {
        if ($event) {
            this.$loadingDeletion.next(true);
            this.messageService.clear();

            this.playerService.deleteById($event)
                .pipe(takeUntil(this.$destroy))
                .subscribe({
                    next: () => {
                        setTimeout(() => {
                            this.$loadingDeletion.next(false);
                            this.setPlayersWithApi(this.pageable);

                            this.messageService.clear();
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Player deleted successfully!'
                            });

                            this.playerService.changedPlayerId = undefined;
                            this.changesOnService.setChangesOn(true);
                        }, 1000);
                    },
                    error: (err) => {
                        console.log(err);
                        this.messageService.clear();
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Unable to delete the player!'
                        });

                        this.changesOnService.setChangesOn(false);
                    }
                });
        }

    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }
}
