import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import {TableLazyLoadEvent} from 'primeng/table';
import {BehaviorSubject, Observable, Subject, takeUntil, zip} from 'rxjs';
import {ParameterDTO} from 'src/app/models/dto/parameter/response/ParameterDTO';
import {UpdatePlayerDTO} from 'src/app/models/dto/player/request/UpdatePlayerDTO';
import PlayerDTO from 'src/app/models/dto/player/response/PlayerDTO';
import PlayerMinDTO from 'src/app/models/dto/player/response/PlayerMinDTO';
import PlayerParameterDataDTO from 'src/app/models/dto/player/aux/PlayerParameterDataDTO';
import PositionMinDTO from 'src/app/models/dto/position/response/PositionMinDTO';
import {EnumPlayerEventsCrud} from 'src/app/models/enums/EnumPlayerEventsCrud';
import {ParameterService} from 'src/app/services/parameter/parameter.service';
import {PlayerService} from 'src/app/services/player/player.service';
import {PositionService} from 'src/app/services/position/position.service';
import {ChangesOnService} from 'src/app/shared/services/changes-on/changes-on.service';
import {CustomDialogService} from 'src/app/shared/services/custom-dialog/custom-dialog.service';
import Page from "../../../../../models/dto/generics/response/Page";
import PageMin from "../../../../../models/dto/generics/response/PageMin";
import Pageable from "../../../../../models/dto/generics/request/Pageable";

@Component({
    selector: 'app-edit-player-form',
    templateUrl: './edit-player-form.component.html',
    styleUrls: ['./edit-player-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditPlayerFormComponent implements OnInit, OnDestroy {

    private readonly destroy$: Subject<void> = new Subject();
    private readonly toastLife: number = 2000;

    public pageable!: Pageable;
    private previousKeyword!: string;
    public loading$!: BehaviorSubject<boolean>;
    public page!: PageMin<PlayerMinDTO>;

    public viewTable$: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public closeableDialog: boolean = false;

    public selectedPlayer!: PlayerDTO | undefined;

    public viewSelectedPicture$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public totalPositions!: PositionMinDTO[];
    public totalParameters!: ParameterDTO[];
    public playerParameters!: PlayerParameterDataDTO[]

    public editPlayerForm = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
        team: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
        age: [this.selectedPlayer?.age, [Validators.min(1), Validators.max(150)]],
        height: [this.selectedPlayer?.height, [Validators.min(65), Validators.max(250)]],
        position: [this.selectedPlayer?.position, Validators.required],
    });
    public playerPicture!: File | undefined;

    public playerParameterForm = this.formBuilder.group({
        parameter: ['', Validators.required],
        score: ['', [Validators.required, Validators.pattern(/^-?\d*\.?\d*$/), Validators.min(1), Validators.max(100)]],
    });

    public constructor(
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private changeDetectorRef: ChangeDetectorRef,
        private dynamicDialogConfig: DynamicDialogConfig,

        private playerService: PlayerService,
        private positionService: PositionService,
        private parameterService: ParameterService,
        private customDialogService: CustomDialogService,
        private changesOnService: ChangesOnService,
    ) {
        this.pageable = new Pageable('', 0, 5, "name", 1);
        this.loading$ = new BehaviorSubject(false);
        this.page = {
            content: [],
            pageNumber: 0,
            pageSize: 5,
            totalElements: 0
        };

        this.playerParameters = [];
    }

    public ngOnInit(): void {
        this.page.totalElements === 0 && this.setPlayersWithApi(this.pageable);
        this.setTotalPositionsWithApi();

        const action = this.dynamicDialogConfig.data;
        if (action && action.$event === EnumPlayerEventsCrud.EDIT) {
            this.handleSelectPlayer(action.selectedPlayerId);
            this.closeableDialog = true;
        }
    }

    private setPlayersWithApi(pageable: Pageable): void {
        pageable.keyword = pageable.keyword.trim();
        this.previousKeyword = pageable.keyword;
        this.pageable = pageable;

        this.loading$.next(true);

        setTimeout(() => {
            this.playerService.findAll(pageable)
                .pipe(takeUntil(this.destroy$))
                .subscribe(
                    {
                        next: (playersPage: Page<PlayerMinDTO>) => {
                            this.page.content = playersPage.content;
                            this.page.pageNumber = playersPage.pageable.pageNumber;
                            this.page.pageSize = playersPage.pageable.pageSize;
                            this.page.totalElements = playersPage.totalElements;

                            this.loading$.next(false);
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

                            this.loading$.next(false);
                        }
                    }
                );
        }, 500);
    }

    private setTotalPositionsWithApi(): void {
        this.positionService.findAllWithTotalRecords()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (positionsPage: Page<PositionMinDTO>) => {
                    this.totalPositions = positionsPage.content;
                },
                error: (err) => {
                    console.log(err);
                }
            });
    }

    public handleChangePageAction($event: TableLazyLoadEvent): void {
        if ($event && $event.first !== undefined && $event.rows) {
            const pageNumber = Math.ceil($event.first / $event.rows);
            const pageSize = $event.rows !== 0 ? $event.rows : 5;

            const fields = $event.sortField ?? "name";
            const sortField = Array.isArray(fields) ? fields[0] : fields;

            const sortDirection = $event.sortOrder ?? 1;

            const pageable = new Pageable(this.pageable.keyword, pageNumber, pageSize, sortField, sortDirection);
            this.setPlayersWithApi(pageable);
        }
    }

    public handleFindByKeywordAction(): void {
        if (this.pageable.keywordIsValid() && this.previousKeyword !== this.pageable.keyword.trim()) {
            this.setPlayersWithApi(this.pageable);
        }
    }

    public handleSelectPlayer(id: number): void {
        if (id) {
            // Reset available parameters whenever a new player is chosen due to the strategy of deleting parameters that already belong to the selected player
            const totalParameters$: Observable<Page<ParameterDTO>> =
                this.parameterService.findAllWithTotalRecords();

            const selectedPlayer: Observable<PlayerDTO> =
                this.playerService.findById(id);
            const combined$: Observable<[Page<ParameterDTO>, PlayerDTO]> =
                zip(totalParameters$, selectedPlayer);

            // It's necessary to synchronize the requests to avoid issues with undefined in 'this.totalParameters' in the 'deleteIncludedPlayerParameters' method
            combined$
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (response: [Page<ParameterDTO>, PlayerDTO]) => {
                        let parametersPage: Page<ParameterDTO>;
                        let player: PlayerDTO;
                        [parametersPage, player] = response;

                        this.totalParameters = parametersPage.content;

                        this.selectedPlayer = player;
                        this.editPlayerForm.setValue({
                            name: player.name,
                            team: player.team,
                            age: player.age,
                            height: player.height,
                            position: player.position,
                        });
                        this.playerParameters = player.parameters;
                        this.deleteIncludedPlayerParameters();

                        this.viewSelectedPicture$.next(true);
                        this.viewTable$.next(false);
                    },
                    error: (err) => {
                        console.log(err);
                    }
                });
        }
    }

    private deleteIncludedPlayerParameters(): void {
        const playerParametersIds: number[] = this.playerParameters.map(p => p.id);
        this.totalParameters = this.totalParameters.filter(p => !playerParametersIds.includes(p.id));
    }

    public handleBackAction(): void {
        this.closeableDialog ?
            this.customDialogService.closeEndDialog() : this.viewTable$.next(true);

        this.selectedPlayer = undefined;
        this.playerPicture = undefined;

        // Update the table and detect the changes that occurred during editing
        this.changeDetectorRef.detectChanges();
    }

    public handleUploadPicture($event: any): void {
        if ($event) {
            this.playerPicture = $event.target.files[0];
            this.viewSelectedPicture$.next(true);
        }
    }

    public handleAddNewPlayerParameter(): void {
        const parameter: ParameterDTO | undefined = this.playerParameterForm.value?.parameter as ParameterDTO | undefined;
        const score = this.playerParameterForm.value?.score as number | undefined;

        if (parameter && score) {
            this.totalParameters = this.totalParameters.filter(p => p.id !== parameter.id);

            this.playerParameters.push(new PlayerParameterDataDTO(parameter.id, parameter.name, score));
            this.sortParametersByName(this.playerParameters);
        }

        this.playerParameterForm.reset();
    }

    public handleDeletePlayerParameter(id: number): void {
        if (id) {
            const playerParameterDataDTO: PlayerParameterDataDTO | undefined = this.playerParameters.find((p) => p.id === id);
            if (playerParameterDataDTO) {
                const parameter: ParameterDTO = new ParameterDTO(playerParameterDataDTO.id, playerParameterDataDTO.name);

                this.playerParameters = this.playerParameters.filter(p => p.id !== parameter.id);

                this.totalParameters.push(parameter);
                this.sortParametersByName(this.totalParameters);
            }
        }
    }

    private sortParametersByName(parameters: ParameterDTO[] | PlayerParameterDataDTO[]): void {
        parameters.sort((p1, p2) => p1.name.toUpperCase().localeCompare(p2.name.toUpperCase()));
    }

    public handleSubmitEditPlayerForm(): void {
        if (this.editPlayerForm.valid && this.editPlayerForm.value && this.editPlayerForm.value && this.selectedPlayer?.id) {
            const position = this.editPlayerForm.value.position as UpdatePlayerDTO | undefined;
            if (position) {
                const playerRequest: UpdatePlayerDTO = {
                    id: String(this.selectedPlayer.id),
                    name: this.editPlayerForm.value.name as string,
                    team: this.editPlayerForm.value.team as string,
                    age: this.editPlayerForm.value.age as string | undefined,
                    height: this.editPlayerForm.value.height as string | undefined,
                    positionId: String(position.id),
                    playerPicture: this.playerPicture ?? undefined,
                    parameters: this.playerParameters
                };

                this.playerPicture && (this.playerService.changedPlayerPicture = true);

                this.playerService.update(playerRequest)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: () => {
                            this.editPlayerForm.reset();
                            this.playerParameterForm.reset();

                            this.changesOnService.setChangesOn(true);

                            this.messageService.clear();
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Player datas edited successfully!',
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
        }
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
