import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {BehaviorSubject, Subject, takeUntil} from 'rxjs';
import {GameModeRequestDTO} from 'src/app/models/dto/gamemode/request/GameModeRequestDTO';
import {GameModeDTO} from 'src/app/models/dto/gamemode/response/GameModeDTO';
import {GameModeMinDTO} from 'src/app/models/dto/gamemode/response/GameModeMinDTO';
import {PositionMinDTO} from 'src/app/models/dto/position/response/PositionMinDTO';
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
import PlayerMinDTO from "../../../../../models/dto/player/response/PlayerMinDTO";
import {TableLazyLoadEvent} from "primeng/table";

@Component({
    selector: 'app-edit-gamemode-form',
    templateUrl: './edit-gamemode-form.component.html',
    styleUrls: ['./edit-gamemode-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditGamemodeFormComponent implements OnInit, OnDestroy {

    private readonly $destroy: Subject<void> = new Subject();
    private readonly toastLife: number = 2000;

    public pageable!: Pageable;
    public $loading!: BehaviorSubject<boolean>;
    public page!: PageMin<GameModeMinDTO>;

    public $viewTable: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public closeableDialog: boolean = false;

    public selectedGameMode!: GameModeMinDTO | undefined;
    public positions!: Array<PositionMinDTO>;
    public positionsOff: Array<PositionMinDTO> = [];
    private reset: boolean = true;

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
            this.gameModeService.findAllWithPageable(pageable)
                .pipe(takeUntil(this.$destroy))
                .subscribe({
                    next: (gameModesPage: Page<GameModeMinDTO>) => {
                        this.page.content = gameModesPage.content;
                        this.page.pageNumber = gameModesPage.pageable.pageNumber;
                        this.page.pageSize = gameModesPage.pageable.pageSize;
                        this.page.totalElements = gameModesPage.totalElements;

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
                });

            this.$loading.next(false);
        }, 500);
    }

    private setPositionsWithApi(): void {
        this.positionService.findAll()
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (positionsPage: Page<PositionMinDTO>) => {
                    this.positions = positionsPage.content.filter(p => !this.positionsOff.some(off => off.id === p.id));
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
            this.setPositionsWithApi();
            this.gameModeService.findById($event)
                .pipe(takeUntil(this.$destroy))
                .subscribe({
                    next: (gameMode: GameModeDTO) => {
                        if (gameMode) {
                            this.selectedGameMode = {
                                id: gameMode.id,
                                formationName: gameMode.formationName,
                                description: gameMode.description
                            };

                            this.editGameModeForm.setValue({
                                formationName: gameMode?.formationName,
                                description: gameMode?.description,
                            });

                            gameMode.positions.forEach(p => {
                                const position: PositionMinDTO = {
                                    id: p.id,
                                    name: p.name,
                                    description: ''
                                }
                                const positionOff = this.positionsOff.find(p => p.id === position.id);
                                positionOff && (positionOff.name = p.name);
                                this.reset && !positionOff && (this.positionsOff.push(position));
                            });

                            this.deleteIncludedPositionParameters();

                            this.reset && (this.reset = false);
                            this.$viewTable.next(false);
                        }
                    },
                    error: (err) => {
                        console.log(err);
                    }
                });
        }
    }

    private deleteIncludedPositionParameters(): void {
        this.positionsOff.forEach(pOff => this.positions = this.positions.filter(p => p.id !== pOff.id));
    }

    public handleBackAction(): void {
        this.closeableDialog ?
            this.customDialogService.closeEndDialog() : this.$viewTable.next(true);

        this.selectedGameMode = undefined;
        this.positionsOff = [];
        this.reset = true;

        this.changeDetectorRef.detectChanges();
    }

    public handleCreatePositionEvent(): void {
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
            this.positionsOff.push(position);
            this.positionsOff.sort((p1, p2) =>
                p1.name.toUpperCase().localeCompare(p2.name.toUpperCase())
            );

            const positionId: number = this.positions.filter((p) => p.id === position.id)[0].id;
            this.positions = this.positions.filter(p => p.id !== positionId);
        }
        this.addPositionForm.reset();
    }

    public handleDeletePosition($event: number): void {
        if ($event) {
            const position: PositionMinDTO | undefined =
                this.positionsOff.find((p) => p.id === $event);
            position && this.positions.push(position);
            this.positionsOff = position && this.positionsOff.filter(p => p.id !== position.id) || [];
            this.positionsOff.sort((p1, p2) =>
                p1.name.toUpperCase().localeCompare(p2.name.toUpperCase())
            );
        }
    }

    public handleSubmitEditGameModeForm(): void {
        if (this.editGameModeForm.valid && this.editGameModeForm.value) {

            this.gameModeService.changedGameModeId = this.selectedGameMode?.id;

            const gameModeRequest: GameModeRequestDTO = {
                formationName: this.editGameModeForm.value.formationName as string,
                description: this.editGameModeForm.value.description as string,
                positions: this.positionsOff.map(p => p.id)
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

                        this.handleBackAction();
                    }
                });
        }

        this.editGameModeForm.reset();
        this.addPositionForm.reset();

        this.positionsOff.forEach(e => this.positions.push(e));
        this.positionsOff.sort((p1, p2) =>
            p1.name.toUpperCase().localeCompare(p2.name.toUpperCase())
        );
        this.positionsOff = [];
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }
}
