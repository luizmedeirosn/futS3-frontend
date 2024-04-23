import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {BehaviorSubject, Subject, takeUntil} from 'rxjs';
import {EditOrDeletePlayerAction} from 'src/app/models/events/EditOrDeletePlayerAction';
import {ViewAction} from 'src/app/models/events/ViewAction';
import PlayerFullDTO from 'src/app/models/dto/player/response/PlayerDTO';
import PlayerMinDTO from 'src/app/models/dto/player/response/PlayerMinDTO';
import {EnumPlayerEventsCrud} from 'src/app/models/enums/EnumPlayerEventsCrud';
import {PlayerService} from 'src/app/services/player/player.service';
import {
    EditPlayerFormComponent
} from 'src/app/shared/components/forms/player-forms/edit-player-form/edit-player-form.component';
import {ChangesOnService} from 'src/app/shared/services/changes-on/changes-on.service';
import {CustomDialogService} from 'src/app/shared/services/custom-dialog/custom-dialog.service';
import Page from "../../../../models/dto/generics/response/Page";
import PageMin from "../../../../models/dto/generics/response/PageMin";
import ChangePageAction from "../../../../models/events/ChangePageAction";
import Pageable from "../../../../models/dto/generics/request/Pageable";

@Component({
    selector: 'app-players-home',
    templateUrl: './players-home.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None
})
export class PlayersHomeComponent implements OnInit, OnDestroy {

    private readonly $destroy: Subject<void> = new Subject();
    private readonly messageLife: number = 3000;

    public pageable!: Pageable;
    public previousKeyword!: string;
    public $loading!: BehaviorSubject<boolean>;
    public page!: PageMin<PlayerMinDTO>;

    public player!: PlayerFullDTO;
    public playerView: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public dynamicDialogRef!: DynamicDialogRef;

    public constructor(
        private messageService: MessageService,
        private changeDetectorRef: ChangeDetectorRef,
        private confirmationService: ConfirmationService,
        private playerService: PlayerService,
        private customDialogService: CustomDialogService,
        private changesOnService: ChangesOnService,
    ) {
        this.pageable = new Pageable('', 0, 5, "name", 1);
        this.$loading = new BehaviorSubject(false);
        this.page = {
            content: [],
            pageNumber: 0,
            pageSize: 5,
            totalElements: 0
        };
    }

    public ngOnInit(): void {
        this.page.totalElements === 0 &&
        this.setPlayersWithApi(this.pageable);

        this.playerService.$playerView
            .pipe(takeUntil(this.$destroy))
            .subscribe(
                {
                    next: (playerView) => {
                        this.playerView.next(playerView);
                    },
                    error: (err) => {
                        console.log(err);
                    }
                }
            );

        this.changesOnService.getChangesOn()
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (changesOn: boolean) => {
                    if (changesOn) {
                        this.setPlayersWithApi(this.pageable);

                        const changedPlayerId: number | undefined = this.playerService.changedPlayerId;
                        changedPlayerId ? this.selectPlayer(changedPlayerId) : this.handleBackAction();
                    }
                },
                error: (err) => {
                    console.log(err);
                }
            });
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
                        },
                        error: (err) => {
                            this.messageService.clear();
                            err.status != 403 && this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Unexpected error!',
                                life: this.messageLife
                            });
                            console.log(err);
                        }
                    }
                );
            this.$loading.next(false);
        }, 500);
    }

    public handleChangePageAction($event: ChangePageAction) {
        console.log($event);
        if ($event && $event.keyword !== undefined && $event.sortField && $event.sortDirection) {
            this.setPlayersWithApi(new Pageable(
                $event.keyword,
                $event.pageNumber,
                $event.pageSize,
                $event.sortField,
                $event.sortDirection
            ));
        }
    }

    public handleViewFullDataPlayerAction($event: ViewAction): void {
        if ($event) {
            this.selectPlayer($event.id)
            this.playerService.$playerView.next(true);
        }
    }

    private selectPlayer(id: number): void {
        id && this.playerService.findById(id)
            .pipe(takeUntil(this.$destroy))
            .subscribe(
                {
                    next: (player) => {
                        player && (this.player = player);
                        this.playerService.changedPlayerId = id;
                    },
                    error: (err) => {
                        this.messageService.add(
                            {
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Unable to access the player!',
                                life: this.messageLife
                            }
                        );
                        console.log(err);
                    }
                }
            );
    }

    public handleBackAction(): void {
        // Do not change the order of actions
        this.playerService.$playerView.next(false);
        this.changeDetectorRef.detectChanges();
    }

    public handleEditOrDeletePlayerEvent($event: EditOrDeletePlayerAction): void {
        if ($event && $event.action === EnumPlayerEventsCrud.EDIT) {
            this.dynamicDialogRef = this.customDialogService.open(
                EditPlayerFormComponent,
                {
                    position: 'top',
                    header: EnumPlayerEventsCrud.EDIT.valueOf(),
                    contentStyle: {overflow: 'auto'},
                    baseZIndex: 10000,
                    data: {
                        $event: EnumPlayerEventsCrud.EDIT,
                        selectedPlayerId: $event.id
                    }
                });

            this.dynamicDialogRef.onClose
                .pipe(takeUntil(this.$destroy))
                .subscribe(() => $event.id && this.selectPlayer($event.id));
        }

        $event && $event.action === EnumPlayerEventsCrud.DELETE && this.deletePlayerConfirmation();
    }

    private deletePlayerConfirmation(): void {
        this.player && this.confirmationService.confirm({
            message: `Confirm the deletion of player: ${this.player.name}?`,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes',
            rejectLabel: 'No',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-text',
            acceptIcon: "none",
            rejectIcon: "none",
            accept: () => this.deletePlayer(this.player.id)
        });
    }

    private deletePlayer(id: number): void {
        id && this.playerService.deleteById(id)
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: () => {
                    this.messageService.clear();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Player deleted successfully!',
                        life: 2000
                    });

                    this.playerService.changedPlayerId = undefined;
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
                        detail: 'Unable to delete the player!',
                        life: 6000
                    });

                    this.changesOnService.setChangesOn(false);
                }
            });
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }
}
