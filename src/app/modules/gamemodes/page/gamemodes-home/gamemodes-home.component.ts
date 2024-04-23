import {Component, OnDestroy, OnInit} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {Subject, takeUntil} from 'rxjs';
import {GameModeDTO} from 'src/app/models/dto/gamemode/response/GameModeDTO';
import {GameModeMinDTO} from 'src/app/models/dto/gamemode/response/GameModeMinDTO';
import {EnumGameModeEventsCrud} from 'src/app/models/enums/EnumGameModeEventsCrud';
import {EditOrDeleteGameModeAction} from 'src/app/models/events/EditOrDeleteGameModeAction';
import {ViewAction} from 'src/app/models/events/ViewAction';
import {GameModeService} from 'src/app/services/gamemode/gamemode.service';
import {
    EditGamemodeFormComponent
} from 'src/app/shared/components/forms/gamemode-forms/edit-gamemode-form/edit-gamemode-form.component';
import {ChangesOnService} from 'src/app/shared/services/changes-on/changes-on.service';
import {CustomDialogService} from 'src/app/shared/services/custom-dialog/custom-dialog.service';
import Page from "../../../../models/dto/generics/response/Page";

@Component({
    selector: 'app-gamemodes-home',
    templateUrl: './gamemodes-home.component.html',
    styleUrls: []
})
export class GameModesHomeComponent implements OnInit, OnDestroy {

    private readonly $destroy: Subject<void> = new Subject();
    private readonly messageLife: number = 3000;

    public gameModes!: GameModeMinDTO[];

    public gameModeView: Subject<boolean> = this.gameModeService.$gameModeView;
    public gameMode!: GameModeDTO;

    private dynamicDialogRef!: DynamicDialogRef;

    public constructor(
        private gameModeService: GameModeService,
        private messageService: MessageService,
        private customDialogService: CustomDialogService,
        private confirmationService: ConfirmationService,
        private changesOnService: ChangesOnService,
    ) {
    }

    public ngOnInit(): void {
        this.setGameModesWithApi();

        this.changesOnService.getChangesOn()
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (changesOn: boolean) => {
                    if (changesOn) {
                        this.setGameModesWithApi();

                        const gameModeIdInPreview: number | undefined = this.gameModeService.gameModeIdInPreview;
                        gameModeIdInPreview ? this.selectGameMode(gameModeIdInPreview) : this.handleBackAction();
                    }
                },
                error: (err) => {
                    console.log(err);
                }
            });
    }

    private setGameModesWithApi(): void {
        this.gameModeService.findAll()
            .pipe(takeUntil(this.$destroy))
            .subscribe(
                {
                    next: (gameModesPage: Page<GameModeMinDTO>) => {
                        this.gameModes = gameModesPage.content;
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
    }

    private selectGameMode(id: number) {
        id && this.gameModeService.findById(id)
            .pipe(takeUntil(this.$destroy))
            .subscribe(
                {
                    next: (gameMode) => {
                        gameMode && (this.gameMode = gameMode);
                        this.gameModeService.changedGameModeId = id;
                        this.gameModeService.gameModeIdInPreview = id;
                    },
                    error: (err) => {
                        this.messageService.add(
                            {
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Unable to access the game mode!',
                                life: this.messageLife
                            }
                        );
                        console.log(err);
                    }
                }
            );
    }

    public handleViewFullDataGameModeAction($event: ViewAction): void {
        if ($event) {
            this.selectGameMode($event.id);
        }
        this.gameModeService.$gameModeView.next(true);

    }

    public handleBackAction() {
        this.gameModeService.$gameModeView.next(false);
    }

    private deleteGameMode(id: number): void {
        id && this.gameModeService.deleteById(id)
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: () => {
                    this.messageService.clear();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Game mode deleted successfully!',
                        life: 2000
                    });

                    this.gameModeService.changedGameModeId = undefined;
                    this.gameModeService.gameModeIdInPreview = undefined;
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
                        detail: 'Unable to delete the game mode!',
                        life: 6000
                    });

                    this.changesOnService.setChangesOn(false);
                }
            });
    }

    private deleteGameModeConfirmation(): void {
        this.gameMode && this.confirmationService.confirm({
            message: `Confirm the deletion of game mode: ${this.gameMode.formationName}?`,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes',
            rejectLabel: 'No',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-text',
            acceptIcon: "none",
            rejectIcon: "none",
            accept: () => this.deleteGameMode(this.gameMode.id)
        });
    }

    public handleEditOrDeleteGameModeEvent($event: EditOrDeleteGameModeAction): void {
        if ($event && $event.action === EnumGameModeEventsCrud.EDIT) {
            this.dynamicDialogRef = this.customDialogService.open(
                EditGamemodeFormComponent,
                {
                    position: 'top',
                    header: EnumGameModeEventsCrud.EDIT.valueOf(),
                    contentStyle: {overflow: 'auto'},
                    baseZIndex: 10000,
                    data: {
                        $event: EnumGameModeEventsCrud.EDIT,
                        selectedGameModeId: $event.id
                    }
                });

            this.dynamicDialogRef.onClose
                .pipe(takeUntil(this.$destroy))
                .subscribe(() => this.selectGameMode($event.id));
        }

        $event && $event.action === EnumGameModeEventsCrud.DELETE && this.deleteGameModeConfirmation();
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }
}
