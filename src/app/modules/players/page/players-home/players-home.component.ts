import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
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
import {PlayersTableComponent} from "../../components/players-table/players-table.component";
import {TableLazyLoadEvent} from "primeng/table";

@Component({
    selector: 'app-players-home',
    templateUrl: './players-home.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None
})
export class PlayersHomeComponent implements OnInit, OnDestroy {

    private readonly $destroy: Subject<void> = new Subject();
    private readonly messageLife: number = 3000;

    @ViewChild('playersTableComponent')
    public playersTableComponent!: PlayersTableComponent;

    private $tableLazyLoadEventPreview!: TableLazyLoadEvent;
    public indexFirstRow!: number;
    public loading!: boolean;
    public page: PageMin<PlayerMinDTO> = {
        content: new Array<PlayerMinDTO>(),
        pageNumber: 0,
        pageSize: 0,
        totalElements: 0
    }

    public player!: PlayerFullDTO;
    public playerView: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public dynamicDialogRef!: DynamicDialogRef;

    public constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private playerService: PlayerService,
        private messageService: MessageService,
        private customDialogService: CustomDialogService,
        private confirmationService: ConfirmationService,
        private changesOnService: ChangesOnService,
    ) {
    }

    public ngOnInit(): void {
        this.page.totalElements === 0 && this.setPlayersWithApi(0, 5);

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
                        this.setPlayersWithApi(this.page.pageNumber, this.page.pageSize);

                        const changedPlayerId: number | undefined = this.playerService.changedPlayerId;
                        changedPlayerId ? this.selectPlayer(changedPlayerId) : this.handleBackAction();
                    }
                },
                error: (err) => {
                    console.log(err);
                }
            });
    }

    private setPlayersWithApi(pageNumber: number, pageSize: number): void {
        this.loading = true;
        this.indexFirstRow = pageNumber * pageSize;
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


                                this.loading = false;
                            }
                        },
                        error: (err) => {
                            err.status != 403 && this.messageService.add(
                                {
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'Unexpected error!',
                                    life: this.messageLife
                                }
                            );
                            console.log(err);

                            this.loading = false;
                        }
                    }
                );
        }, 1000);
    }

    public handleChangePageAction($event: ChangePageAction) {
        if ($event) {
            this.setPlayersWithApi($event.pageNumber, $event.pageSize);
        }
    }

    public handleViewFullDataPlayerAction($event: ViewAction): void {
        if ($event) {
            $event.tableLazyLoadEventPreview && (this.$tableLazyLoadEventPreview = $event.tableLazyLoadEventPreview);
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
        this.playersTableComponent.changePlayersPage(this.$tableLazyLoadEventPreview);
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
