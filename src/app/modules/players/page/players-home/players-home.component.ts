import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EditOrDeletePlayerAction } from 'src/app/models/events/EditOrDeletePlayerAction';
import { ViewAction } from 'src/app/models/events/ViewAction';
import { PlayerFullDTO } from 'src/app/models/dto/player/response/PlayerFullDTO';
import { PlayerMinDTO } from 'src/app/models/dto/player/response/PlayerMinDTO';
import { EnumPlayerEventsCrud } from 'src/app/models/enums/EnumPlayerEventsCrud';
import { PlayerService } from 'src/app/services/player/player.service';
import { EditPlayerFormComponent } from 'src/app/shared/components/forms/player-forms/edit-player-form/edit-player-form.component';
import { ChangesOnService } from 'src/app/shared/services/changed-on/changes-on.service';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog/custom-dialog.service';

@Component({
    selector: 'app-players-home',
    templateUrl: './players-home.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None
})
export class PlayersHomeComponent implements OnInit, OnDestroy {

    private readonly $destroy: Subject<void> = new Subject();
    private readonly messageLife: number = 3000;

    public players!: Array<PlayerMinDTO>;
    public player!: PlayerFullDTO;
    public playerView!: boolean;
    public dynamicDialogRef!: DynamicDialogRef;

    public constructor(
        private playerService: PlayerService,
        private messageService: MessageService,
        private customDialogService: CustomDialogService,
        private confirmationService: ConfirmationService,
        private changesOnService: ChangesOnService,
    ) {
    }

    public ngOnInit(): void {
        this.setPlayerWithApi();

        this.playerService.$playerView
            .pipe(takeUntil(this.$destroy))
            .subscribe(
                {
                    next: (playerView) => {
                        this.playerView = playerView;
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
                        this.setPlayerWithApi();

                        const changedPlayerId: number | undefined = this.playerService.changedPlayerId;
                        changedPlayerId && this.selectPlayer(changedPlayerId);
                    }
                },
                error: (err) => {
                    console.log(err);
                }
            });
    }

    private setPlayerWithApi(): void {
        this.playerService.findAll()
            .pipe(takeUntil(this.$destroy))
            .subscribe(
                {
                    next: (players: PlayerMinDTO[]) => {
                        if (players.length > 0) {
                            this.players = players;
                        }
                    },
                    error: (err) => {
                        this.messageService.clear();
                        this.messageService.add(
                            {
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Please check your internet connection!',
                                life: this.messageLife
                            }
                        );
                        console.log(err);
                    }
                }
            );
    }

    private selectPlayer(id: number): void {
        id && this.playerService.findFullById(id)
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

    public handleViewFullDataPlayerAction($event: ViewAction): void {
        if ($event) {
            this.selectPlayer($event.id)
            this.playerService.$playerView.next(true);
        }
    }

    public handleBackAction(): void {
        this.playerService.$playerView.next(false);
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

    public handleEditOrDeletePlayerEvent($event: EditOrDeletePlayerAction): void {
        if ($event && $event.action === EnumPlayerEventsCrud.EDIT) {
            this.dynamicDialogRef = this.customDialogService.open(
                EditPlayerFormComponent,
                {
                    Player: 'top',
                    header: EnumPlayerEventsCrud.EDIT.valueOf(),
                    contentStyle: { overflow: 'auto' },
                    baseZIndex: 10000,
                    data: {
                        $event: EnumPlayerEventsCrud.EDIT,
                        selectedPlayerId: $event.id
                    }
                });

            this.dynamicDialogRef.onClose
                .pipe(takeUntil(this.$destroy))
                .subscribe(() => this.selectPlayer($event.id));
        }

        $event && $event.action === EnumPlayerEventsCrud.DELETE && this.deletePlayerConfirmation();
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

}
