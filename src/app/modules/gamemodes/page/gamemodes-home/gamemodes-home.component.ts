import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {BehaviorSubject, Subject, takeUntil} from 'rxjs';
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
import Pageable from "../../../../models/dto/generics/request/Pageable";
import PageMin from "../../../../models/dto/generics/response/PageMin";
import ChangePageAction from "../../../../models/events/ChangePageAction";

@Component({
    selector: 'app-gamemodes-home',
    templateUrl: './gamemodes-home.component.html',
    styleUrls: []
})
export class GameModesHomeComponent implements OnInit, OnDestroy {

    private readonly $destroy: Subject<void> = new Subject();
    private readonly messageLife: number = 3000;

    public pageable!: Pageable;
    public $loading!: BehaviorSubject<boolean>;
    public page!: PageMin<GameModeMinDTO>;

    // The view is also controlled by the menu bar, so the observable is necessary. Use case: The view screen is active and the 'Find All' is triggered
    public $gameModeView!: Subject<boolean>;

    public gameMode!: GameModeDTO;

    private dynamicDialogRef!: DynamicDialogRef;

    public constructor(
        private messageService: MessageService,
        private changeDetectorRef: ChangeDetectorRef,
        private confirmationService: ConfirmationService,
        private gameModeService: GameModeService,
        private customDialogService: CustomDialogService,
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

        this.$gameModeView = this.gameModeService.$gameModeView;
    }

    public ngOnInit(): void {
        this.page.totalElements === 0 && this.setGameModesWithApi(this.pageable);

        this.changesOnService.getChangesOn()
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (changesOn: boolean) => {
                    if (changesOn) {
                        this.setGameModesWithApi(this.pageable);

                        const gameModeIdInPreview: number | undefined = this.gameModeService.gameModeIdInPreview;
                        gameModeIdInPreview ? this.selectGameMode(gameModeIdInPreview) : this.handleBackAction();
                    }
                },
                error: (err) => {
                    console.log(err);
                }
            });
    }

    private setGameModesWithApi(pageable: Pageable): void {
        this.pageable = pageable;

        this.$loading.next(true);

        setTimeout(() => {
            this.gameModeService.findAll(pageable)
                .pipe(takeUntil(this.$destroy))
                .subscribe(
                    {
                        next: (gameModesPage: Page<GameModeMinDTO>) => {
                            this.page.content = gameModesPage.content;
                            this.page.pageNumber = gameModesPage.pageable.pageNumber;
                            this.page.pageSize = gameModesPage.pageable.pageSize;
                            this.page.totalElements = gameModesPage.totalElements;

                            this.$loading.next(false);
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

                            this.$loading.next(false);
                        }
                    }
                );
        }, 500);
    }

    public handleChangePageAction($event: ChangePageAction) {
        if ($event && $event.keyword !== undefined) {
            this.setGameModesWithApi(new Pageable(
                $event.keyword,
                $event.pageNumber,
                $event.pageSize,
            ));
        }
    }

    public handleViewFullDataGameModeAction($event: ViewAction): void {
        this.selectGameMode($event.id);
    }

    private selectGameMode(id: number) {
        id && this.gameModeService.findById(id)
            .pipe(takeUntil(this.$destroy))
            .subscribe(
                {
                    next: (gameMode) => {
                        this.gameMode = gameMode;
                        this.gameModeService.changedGameModeId = id;
                        this.gameModeService.gameModeIdInPreview = id;

                        this.gameModeService.$gameModeView.next(true);
                    },
                    error: (err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Unable to access the game mode!',
                            life: this.messageLife
                        });

                        console.log(err);
                    }
                }
            );
    }

    public handleBackAction() {
        // Disable the selection of a game mode set in getChangesOn when the back button is pressed
        this.gameModeService.gameModeIdInPreview = undefined;

        // Do not change the order of actions
        this.gameModeService.$gameModeView.next(false);
        this.changeDetectorRef.detectChanges();
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

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }
}
