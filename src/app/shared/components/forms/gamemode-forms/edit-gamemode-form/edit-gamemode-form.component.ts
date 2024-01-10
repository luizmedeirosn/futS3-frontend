import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { GameModeRequestDTO } from 'src/app/models/dto/gamemode/request/GameModeRequestDTO';
import { PositionMinDTO } from 'src/app/models/dto/position/response/PositionMinDTO';
import { EnumPositionEventsCrud } from 'src/app/models/enums/EnumPositionEventsCrud';
import { GameModeService } from 'src/app/services/gamemode/gamemode.service';
import { PositionService } from 'src/app/services/position/position.service';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog.service';
import { SavePositionFormComponent } from '../../position-forms/save-position-form/save-position-form.component';
import { GameModeMinDTO } from 'src/app/models/dto/gamemode/response/GameModeMinDTO';
import { Table } from 'primeng/table';
import { GameModeFullDTO } from 'src/app/models/dto/gamemode/response/GameModeFullDTO';
import { EditPositionFormComponent } from '../../position-forms/edit-position-form/edit-position-form.component';
import { EnumGameModeEventsCrud } from 'src/app/models/enums/EnumGameModeEventsCrud';

@Component({
    selector: 'app-edit-gamemode-form',
    templateUrl: './edit-gamemode-form.component.html',
    styleUrls: ['./edit-gamemode-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditGamemodeFormComponent implements OnInit, OnDestroy {

    private readonly $destroy: Subject<void> = new Subject();
    private readonly toastLife: number = 2000;

    @ViewChild('gameModesTable') public gameModesTable!: Table;
    private gameModesTablePages: Array<Array<GameModeMinDTO>> = new Array();

    public $viewTable: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public closeableDialog: boolean = false;

    public gameModes!: Array<GameModeMinDTO>;
    public selectedGameMode!: GameModeMinDTO | undefined;
    public positions!: Array<PositionMinDTO>;
    public positionsOff: Array<PositionMinDTO> = new Array();

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
        private positionService: PositionService,
        private gameModeService: GameModeService,
        private customDialogService: CustomDialogService,
        private dynamicDialogConfig: DynamicDialogConfig,
    ) { }

    public ngOnInit(): void {
        this.setGameModesWithApi();
        this.setPositionsWithApi();

        const action = this.dynamicDialogConfig.data;
        if (action && action.$event === EnumGameModeEventsCrud.EDIT) {
            this.handleSelectGameMode(action.selectedGameModeId);
            this.closeableDialog = true;
        }
    }

    public setGameModesWithApi(): void {
        this.gameModeService.findAll()
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (gameModes: Array<GameModeMinDTO>) => {
                    this.gameModes = gameModes;

                    let increment: number = 0;
                    let page: Array<GameModeMinDTO> = new Array();

                    gameModes.forEach((gameMode, index, array) => {
                        page.push(gameMode);
                        increment += 1;
                        if (increment === 5 || index === array.length - 1) {
                            this.gameModesTablePages.push(page);
                            page = new Array();
                            increment = 0;
                        }
                    });
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
    }

    private setPositionsWithApi(): void {
        this.positionService.findAll()
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (positions: Array<PositionMinDTO>) => {
                    this.positions = positions.filter(p => !this.positionsOff.some(off => off.id === p.id));
                },
                error: (err) => {
                    console.log(err);
                }
            });
    }

    public handleSelectGameMode($event: number): void {
        if ($event) {
            this.setPositionsWithApi();
            this.gameModeService.findFullById($event)
                .pipe(takeUntil(this.$destroy))
                .subscribe({
                    next: (gameMode: GameModeFullDTO) => {
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

                            gameMode.fields.forEach(e => {
                                const position: PositionMinDTO = {
                                    id: e.positionId,
                                    name: e.positionName,
                                    description: ''
                                }

                                this.positionsOff.find(p => p.id === position.id) === undefined && (this.positionsOff.push(position));
                            });

                            this.$viewTable.next(false);
                        }
                    },
                    error: (err) => {
                        console.log(err);
                    }
                });
        }
    }

    public handleBackAction(): void {
        this.closeableDialog && this.customDialogService.close(false);

        this.$viewTable.next(true); // Activate the view child before referencing the table
        setTimeout(() => {
            if (this.selectedGameMode?.id !== undefined) {
                const selectedGameMode: GameModeMinDTO | undefined =
                    this.gameModes.find(gameMode => gameMode.id === this.selectedGameMode?.id);

                if (selectedGameMode) {
                    const index = this.gameModes.indexOf(selectedGameMode);
                    const numPage: number = Math.floor(index / 5);
                    const page = this.gameModesTablePages.at(numPage);
                    const firstGameModePage: GameModeMinDTO | undefined = page?.at(0);

                    this.gameModesTable &&
                        (this.gameModesTable.first =
                            firstGameModePage && this.gameModes.indexOf(firstGameModePage));
                }
            }
            this.selectedGameMode = undefined;
            this.positionsOff = new Array();
        }, 10);
    }

    public handleCreatePositionEvent(): void {
        this.dynamicDialogRef = this.customDialogService.open(
            SavePositionFormComponent,
            {
                position: 'top',
                header: EnumPositionEventsCrud.ADD.valueOf(),
                contentStyle: { overflow: 'auto' },
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
                contentStyle: { overflow: 'auto' },
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
            const positionId: number = this.positions.filter((p) => p.id === position.id)[0].id;

            this.positionsOff.push(position);
            this.positions = this.positions.filter(p => p.id !== positionId);
        }
        this.addPositionForm.reset();
    }

    private comparePositions = (p1: any, p2: any) => {
        if (p1.name < p2.name) {
            return -1;
        } else if (p1.name > p2.name) {
            return 1;
        }
        return 0;
    }

    public handleDeletePosition($event: number): void {
        const position: PositionMinDTO | undefined = this.positionsOff.find((p) => p.id === $event);
        position && this.positions.push(position);
        this.positionsOff = position && this.positionsOff.filter(p => p.id !== position.id) || new Array();
        this.positions.sort(this.comparePositions);
    }

    public handleSubmitEditGameModeForm(): void {
        if (this.editGameModeForm.valid && this.editGameModeForm.value) {
            const gameModeRequest: GameModeRequestDTO = {
                formationName: this.editGameModeForm.value.formationName as string,
                description: this.editGameModeForm.value.description as string,
                positions: this.positionsOff.map(p => p.id)
            }

            this.selectedGameMode && this.gameModeService.updateById(this.selectedGameMode.id, gameModeRequest)
                .pipe(takeUntil(this.$destroy))
                .subscribe({
                    next: (gameMode) => {
                        const gameModeUpdated = this.gameModes.find(p => p.id === this.selectedGameMode?.id);
                        gameModeUpdated && (gameModeUpdated.formationName = gameMode.formationName);

                        this.gameModeService.setChangesOn(true, this.selectedGameMode?.id);
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
                        this.gameModeService.setChangesOn(false);
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
        this.positions.sort(this.comparePositions);
        this.positionsOff = new Array();
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

}
