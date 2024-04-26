import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {BehaviorSubject, Subject, takeUntil} from 'rxjs';
import {GameModeRequestDTO} from 'src/app/models/dto/gamemode/request/GameModeRequestDTO';
import {GameModeDTO} from 'src/app/models/dto/gamemode/response/GameModeDTO';
import {GameModeMinDTO} from 'src/app/models/dto/gamemode/response/GameModeMinDTO';
import PositionMinDTO from 'src/app/models/dto/position/response/PositionMinDTO';
import {EnumGameModeEventsCrud} from 'src/app/models/enums/EnumGameModeEventsCrud';
import {EnumPositionEventsCrud} from 'src/app/models/enums/EnumPositionEventsCrud';
import {GameModeService} from 'src/app/services/gamemode/gamemode.service';
import {PositionService} from 'src/app/services/position/position.service';
import {ChangesOnService} from 'src/app/shared/services/changes-on/changes-on.service';
import {CustomDialogService} from 'src/app/shared/services/custom-dialog/custom-dialog.service';
import {EditPositionFormComponent} from '../../position-forms/edit-position-form/edit-position-form.component';
import {SavePositionFormComponent} from '../../position-forms/save-position-form/save-position-form.component';
import Page from "../../../../../models/dto/generics/response/Page";
import Pageable from "../../../../../models/dto/generics/request/Pageable";
import PageMin from "../../../../../models/dto/generics/response/PageMin";
import {TableLazyLoadEvent} from "primeng/table";
import _default from "chart.js/dist/plugins/plugin.tooltip";
import reset = _default.reset;

@Component({
    selector: 'app-edit-gamemode-form',
    templateUrl: './edit-gamemode-form.component.html',
    styleUrls: ['./edit-gamemode-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditGamemodeFormComponent implements OnInit, OnDestroy {

    private readonly $destroy: Subject<void> = new Subject();
    private readonly toastLife: number = 2000;

    // Prevent resetting of positions when the modal to trigger positions is opened during editing of a game mode in GameModeHomeComponent
    private resetGameModePositions!: boolean;

    public pageable!: Pageable;
    public $loading!: BehaviorSubject<boolean>;
    public page!: PageMin<GameModeMinDTO>;

    public $viewTable: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public closeableDialog: boolean = false;

    public selectedGameMode!: GameModeDTO | undefined;
    public totalPositions!: PositionMinDTO[];
    public gameModePositions!: PositionMinDTO[];

    public editGameModeForm: any = this.formBuilder.group({
        formationName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        description: ['', [Validators.maxLength(2000)]],
    });

    public addPositionForm = this.formBuilder.group({
        position: ['', Validators.required],
    });

    public dynamicDialogRef!: DynamicDialogRef;

    public constructor(
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private changeDetectorRef: ChangeDetectorRef,
        private dynamicDialogConfig: DynamicDialogConfig,
        private gameModeService: GameModeService,
        private positionService: PositionService,
        private customDialogService: CustomDialogService,
        private changesOnService: ChangesOnService,
    ) {
        this.pageable = new Pageable('', 0, 10);
        this.$loading = new BehaviorSubject(false);
        this.page = {
            content: [],
            pageNumber: 0,
            pageSize: 10,
            totalElements: 0
        };

        this.resetGameModePositions = true;
    }

    public ngOnInit(): void {
        this.page.totalElements === 0 && this.setGameModesWithApi(this.pageable);
        this.setPositionsWithApi();

        const action = this.dynamicDialogConfig.data;
        if (action && action.$event === EnumGameModeEventsCrud.EDIT) {
            this.handleSelectGameMode(action.selectedGameModeId);
            this.closeableDialog = true;
        }

        this.changesOnService.getChangesOn()
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (changesOn: boolean) => {
                    if (changesOn) {
                        const changedGameModeId: number | undefined = this.gameModeService.changedGameModeId;
                        (changedGameModeId && this.closeableDialog && changedGameModeId === this.gameModeService.gameModeIdInPreview) && this.handleSelectGameMode(changedGameModeId);
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
                .subscribe({
                    next: (gameModesPage: Page<GameModeMinDTO>) => {
                        this.page.content = gameModesPage.content;
                        this.page.pageNumber = gameModesPage.pageable.pageNumber;
                        this.page.pageSize = gameModesPage.pageable.pageSize;
                        this.page.totalElements = gameModesPage.totalElements;

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

    private setPositionsWithApi(): void {
        this.positionService.findAll()
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (positionsPage: Page<PositionMinDTO>) => {
                    this.totalPositions = positionsPage.content;
                    !this.resetGameModePositions && this.deleteIncludedPositions();
                },
                error: (err) => {
                    console.log(err);
                }
            });
    }

    public handleChangePageAction($event: TableLazyLoadEvent): void {
        if ($event && $event.first !== undefined && $event.rows) {
            const pageNumber = Math.ceil($event.first / $event.rows);
            const pageSize = $event.rows !== 0 ? $event.rows : 10;

            const pageable = new Pageable(this.pageable.keyword, pageNumber, pageSize);
            this.setGameModesWithApi(pageable);
        }
    }

    public handleSelectGameMode($event: number): void {
        if ($event) {
            // Reset available positions whenever a new game mode is chosen due to the strategy of deleting positions that already belong to the selected game mode
            this.setPositionsWithApi();

            this.gameModeService.findById($event)
                .pipe(takeUntil(this.$destroy))
                .subscribe({
                    next: (gameMode: GameModeDTO) => {
                        this.selectedGameMode = gameMode;

                        this.editGameModeForm.setValue({
                            formationName: gameMode?.formationName,
                            description: gameMode?.description,
                        });

                        if (this.resetGameModePositions) {
                            this.gameModePositions = gameMode.positions.map(p => new PositionMinDTO(p.id, p.name, p.description));
                        }

                        this.deleteIncludedPositions();

                        this.$viewTable.next(false);
                    },
                    error: (err) => {
                        console.log(err);
                    }
                });
        }
    }

    private deleteIncludedPositions(): void {
        const gameModePositionsIds: number[] = this.gameModePositions.map(p => p.id);
        this.totalPositions = this.totalPositions.filter(p => !gameModePositionsIds.includes(p.id));
    }

    public handleBackAction(): void {
        this.closeableDialog ?
            this.customDialogService.closeEndDialog() : this.$viewTable.next(true);

        this.selectedGameMode = undefined;
        this.resetGameModePositions = true;
        this.changeDetectorRef.detectChanges();
    }

    public handleCreatePositionEvent(): void {
        this.resetGameModePositions = false;

        this.dynamicDialogRef = this.customDialogService.open(
            SavePositionFormComponent,
            {
                position: 'top',
                header: EnumPositionEventsCrud.ADD.valueOf(),
                contentStyle: {overflow: 'auto'},
                baseZIndex: 10000,
            });

        this.dynamicDialogRef.onClose
            .pipe(takeUntil(this.$destroy))
            .subscribe(() => this.setPositionsWithApi());
    }

    public handleEditPositionEvent(id: number) {
        this.resetGameModePositions = false;

        this.dynamicDialogRef = this.customDialogService.open(
            EditPositionFormComponent,
            {
                position: 'top',
                header: EnumPositionEventsCrud.EDIT.valueOf(),
                contentStyle: {overflow: 'auto'},
                baseZIndex: 10000,
                data: {
                    $event: EnumPositionEventsCrud.EDIT,
                    selectedPositionId: id
                }
            });

        this.dynamicDialogRef.onClose
            .pipe(takeUntil(this.$destroy))
            .subscribe(() => this.setPositionsWithApi());
    }

    public handleAddPosition(): void {
        const position = this.addPositionForm.value?.position as PositionMinDTO | undefined;
        if (position) {
            this.totalPositions = this.totalPositions.filter(p => p.id !== position.id);
            this.gameModePositions.push(position);
            this.gameModePositions.sort((p1, p2) =>
                p1.name.toUpperCase().localeCompare(p2.name.toUpperCase())
            );
        }

        this.addPositionForm.reset();
    }

    public handleDeletePosition($event: number): void {
        if ($event) {
            const position: PositionMinDTO | undefined = this.gameModePositions.find((p) => p.id === $event);
            if (position) {
                this.gameModePositions = this.gameModePositions.filter(p => p.id !== position.id);
                this.totalPositions.push(position);
                this.totalPositions.sort((p1, p2) =>
                    p1.name.toUpperCase().localeCompare(p2.name.toUpperCase())
                );
            }
        }
    }

    public handleSubmitEditGameModeForm(): void {
        if (this.editGameModeForm.valid && this.editGameModeForm.value) {

            this.gameModeService.changedGameModeId = this.selectedGameMode?.id;

            const gameModeRequest: GameModeRequestDTO = {
                formationName: this.editGameModeForm.value.formationName as string,
                description: this.editGameModeForm.value.description as string,
                positions: this.gameModePositions.map(p => p.id)
            }

            this.selectedGameMode && this.gameModeService.updateById(this.selectedGameMode.id, gameModeRequest)
                .pipe(takeUntil(this.$destroy))
                .subscribe({
                    next: (gameMode) => {
                        const gameModeUpdated =
                            this.page.content.find(p => p.id === this.selectedGameMode?.id);
                        gameModeUpdated && (gameModeUpdated.formationName = gameMode.formationName);

                        this.changesOnService.setChangesOn(true);

                        this.messageService.clear();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Game mode registered successfully!',
                            life: this.toastLife
                        });

                        this.handleBackAction();
                    },
                    error: (err) => {
                        this.changesOnService.setChangesOn(false);

                        this.messageService.clear();
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Invalid registration!',
                            life: this.toastLife
                        });
                        console.log(err);
                    }
                });
        }

        this.editGameModeForm.reset();
        this.addPositionForm.reset();
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }
}
