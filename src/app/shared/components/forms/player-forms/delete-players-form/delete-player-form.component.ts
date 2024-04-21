import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import PlayerMinDTO from 'src/app/models/dto/player/response/PlayerMinDTO';
import { PlayerService } from 'src/app/services/player/player.service';
import { ChangesOnService } from 'src/app/shared/services/changes-on/changes-on.service';
import PageMin from "../../../../../models/dto/generics/response/PageMin";
import Page from "../../../../../models/dto/generics/response/Page";
import {TableLazyLoadEvent} from "primeng/table";

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

    public loading!: boolean;
    public page: PageMin<PlayerMinDTO> = {
        content: [],
        pageNumber: 0,
        pageSize: 10,
        totalElements: 0
    };

    public constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,

        private playerService: PlayerService,
        private changesOnService: ChangesOnService,
    ) { }

    public ngOnInit(): void {
        this.page.totalElements === 0 &&
            this.setPlayersWithApi(0, 10);
    }

    private setPlayersWithApi(pageNumber: number, pageSize: number): void {
        this.loading = true;
        setTimeout(() => {
            this.playerService.findAll(pageNumber, pageSize)
                .pipe(takeUntil(this.$destroy))
                .subscribe(
                    {
                        next: (playersPage: Page<PlayerMinDTO>) => {
                            if (playersPage.size > 0) {
                                this.page.content = playersPage.content;
                                this.page.pageNumber = pageNumber;
                                this.page.pageSize = pageSize;
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

    public handleChangePlayersPage($event: TableLazyLoadEvent) {
        if ($event && $event.first !== undefined && $event.rows) {
            const pageNumber = Math.ceil($event.first / $event.rows);
            const pageSize = $event.rows !== 0 ? $event.rows : 5;
            this.setPlayersWithApi(pageNumber, pageSize);
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
                            this.setPlayersWithApi(this.page.pageNumber, this.page.pageSize);

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
