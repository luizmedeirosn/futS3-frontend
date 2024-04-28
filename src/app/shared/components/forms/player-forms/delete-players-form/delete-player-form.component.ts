import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {BehaviorSubject, Subject, takeUntil} from 'rxjs';
import PlayerMinDTO from 'src/app/models/dto/player/response/PlayerMinDTO';
import {PlayerService} from 'src/app/services/player/player.service';
import {ChangesOnService} from 'src/app/shared/services/changes-on/changes-on.service';
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

    private readonly $destroy!: Subject<void>;
    private readonly toastLife!: number;

    public pageable!: Pageable;
    private previousKeyword!: string;
    public $loading!: BehaviorSubject<boolean>;
    public page!: PageMin<PlayerMinDTO>;

    public constructor (
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private playerService: PlayerService,
        private changesOnService: ChangesOnService,
    ) {
        this.$destroy = new Subject<void>();
        this.toastLife = 2000;

        this.pageable = new Pageable('', 0, 10, "name", 1);
        this.$loading = new BehaviorSubject(false);
        this.page = {
            content: [],
            pageNumber: 0,
            pageSize: 10,
            totalElements: 0
        };
    }

    public ngOnInit(): void {
        this.page.totalElements === 0 && this.setPlayersWithApi(this.pageable);
    }

    private setPlayersWithApi(pageable: Pageable): void {
        pageable.keyword = pageable.keyword.trim();
        this.previousKeyword = pageable.keyword;
        this.pageable = pageable;

        this.$loading.next(true);

        setTimeout(() => {
            this.playerService.findAll(pageable)
                .pipe(takeUntil(this.$destroy))
                .subscribe(
                    {
                        next: (playersPage: Page<PlayerMinDTO>) => {
                            this.page.content = playersPage.content;
                            this.page.pageNumber = playersPage.pageable.pageNumber;
                            this.page.pageSize = playersPage.pageable.pageSize;
                            this.page.totalElements = playersPage.totalElements;

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
                    }
                );
        }, 500);
    }

    public handleChangePageAction($event: TableLazyLoadEvent) {
        if ($event && $event.first !== undefined && $event.rows) {
            const pageNumber = Math.ceil($event.first / $event.rows);
            const pageSize = $event.rows !== 0 ? $event.rows : 10;

            const fields = $event.sortField ?? "name";
            const sortField = Array.isArray(fields) ? fields[0] : fields;

            const sortDirection = $event.sortOrder ?? 1;

            this.setPlayersWithApi(new Pageable(this.pageable.keyword, pageNumber, pageSize, sortField, sortDirection));
        }
    }

    public handleFindByKeywordAction(): void {
        if (this.pageable.keywordIsValid() && this.previousKeyword !== this.pageable.keyword.trim()) {
            this.setPlayersWithApi(this.pageable);
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
            this.messageService.clear();

            // Locks the table until deletion is completed
            this.$loading.next(true);

            setTimeout(() => {
                this.playerService.deleteById($event)
                    .pipe(takeUntil(this.$destroy))
                    .subscribe({
                        next: () => {
                            this.playerService.changedPlayerId = undefined;
                            this.changesOnService.setChangesOn(true);

                            this.$loading.next(false);

                            this.setPlayersWithApi(this.pageable);

                            this.messageService.clear();
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Player deleted successfully!'
                            });
                        },
                        error: (err) => {
                            this.messageService.clear();
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Unable to delete the player!',
                                life: this.toastLife
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
