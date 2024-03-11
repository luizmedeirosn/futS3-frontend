import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ParameterDTO } from 'src/app/models/dto/parameter/response/ParameterDTO';
import { UpdatePlayerDTO } from 'src/app/models/dto/player/request/UpdatePlayerDTO';
import { PlayerFullDTO } from 'src/app/models/dto/player/response/PlayerFullDTO';
import { PlayerMinDTO } from 'src/app/models/dto/player/response/PlayerMinDTO';
import { PlayerParameterScoreDTO } from 'src/app/models/dto/player/response/PlayerParameterScoreDTO';
import { PositionMinDTO } from 'src/app/models/dto/position/response/PositionMinDTO';
import { EnumPlayerEventsCrud } from 'src/app/models/enums/EnumPlayerEventsCrud';
import { ParameterService } from 'src/app/services/parameter/parameter.service';
import { PlayerService } from 'src/app/services/player/player.service';
import { PositionService } from 'src/app/services/position/position.service';
import { ChangesOnService } from 'src/app/shared/services/changes-on/changes-on.service';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog/custom-dialog.service';

@Component({
    selector: 'app-edit-player-form',
    templateUrl: './edit-player-form.component.html',
    styleUrls: ['./edit-player-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditPlayerFormComponent implements OnInit, OnDestroy {

    private readonly $destroy: Subject<void> = new Subject();
    private readonly toastLife: number = 2000;

    @ViewChild('playersTable') public playersTable!: Table;
    private playersTablePages: PlayerMinDTO[][] = [];

    public $viewTable: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public closeableDialog: boolean = false;

    public players!: PlayerMinDTO[];
    public selectedPlayer!: PlayerFullDTO | undefined;

    public $viewSelectedPicture: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public positions!: PositionMinDTO[];
    public parameters!: ParameterDTO[];
    private parametersOff: ParameterDTO[] = [];
    public playerParametersScore: PlayerParameterScoreDTO[] = [];

    public playerForm = this.formBuilder.group({
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
        private playerService: PlayerService,
        private positionService: PositionService,
        private parameterService: ParameterService,
        private customDialogService: CustomDialogService,
        private dynamicDialogConfig: DynamicDialogConfig,
        private changesOnService: ChangesOnService,
    ) { }

    public ngOnInit(): void {
        this.setPlayersWithApi();
        this.setPositionWithApi();

        const action = this.dynamicDialogConfig.data;
        if (action && action.$event === EnumPlayerEventsCrud.EDIT) {
            this.handleSelectPlayer(action.selectedPlayerId);
            this.closeableDialog = true;
        }
    }

    private setPlayersWithApi(): void {
        this.playerService.findAll()
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (players) => {
                    this.players = players;

                    let increment: number = 0;
                    let page: Array<PlayerMinDTO> = new Array();

                    players.forEach((player, index, array) => {
                        page.push(player);
                        increment += 1;
                        if (increment === 5 || index === array.length - 1) {
                            this.playersTablePages.push(page);
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

    private setPositionWithApi(): void {
        this.positionService.findAll()
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (positions) => {
                    this.positions = positions;
                },
                error: (err) => {
                    console.log(err);
                }
            });
    }

    private setParametersWithApi(): void {
        this.parameterService.findAll()
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (parameters) => {
                    this.parameters = parameters;
                },
                error: (err) => {
                    console.log(err);
                }
            });
    }

    private deleteIncludedPlayerParameters(): void {
        if (this.parameters) {
            const parametersNames = this.playerParametersScore.map(p => p.name);
            this.parameters.forEach(parameter => {
                if (parametersNames.includes(parameter.name)) {
                    this.parametersOff.push(parameter);
                    this.parameters = this.parameters.filter(p => p.name != parameter.name);
                }
            });
        }
    }

    public handleSelectPlayer($event: number): void {
        if ($event) {
            this.setParametersWithApi();
            this.playerService.findFullById($event)
                .pipe(takeUntil(this.$destroy))
                .subscribe({
                    next: (player) => {
                        if (player) {
                            this.selectedPlayer = player;
                            this.playerForm.setValue({
                                name: player?.name,
                                team: player?.team,
                                age: player?.age,
                                height: player?.height,
                                position: player?.position,
                            });
                            this.playerParametersScore = player?.parameters;

                            this.$viewTable.next(false);
                            this.$viewSelectedPicture.next(true);

                            this.deleteIncludedPlayerParameters();
                        }
                    },
                    error: (err) => {
                        console.log(err);
                    }
                });
        }
    }

    public handleBackAction(): void {
        this.closeableDialog && this.customDialogService.closeEndDialog();

        // Activate the view child before referencing the table
        this.$viewTable.next(true);

        // Delay until activating the viewChild
        setTimeout(() => {
            if (this.selectedPlayer?.id !== undefined) {
                const selectedPlayer: PlayerMinDTO | undefined =
                    this.players.find(player => player.id === this.selectedPlayer?.id);

                if (selectedPlayer) {
                    const index = this.players.indexOf(selectedPlayer);
                    const numPage: number = Math.floor(index / 5);
                    const page = this.playersTablePages.at(numPage);
                    const firstPlayerPage: PlayerMinDTO | undefined = page?.at(0);

                    this.playersTable &&
                        (this.playersTable.first =
                            firstPlayerPage && this.players.indexOf(firstPlayerPage));
                }
            }
            this.selectedPlayer = undefined;
            this.playerPicture = undefined;
        }, 10);
    }

    public handleUploadPicture($event: any): void {
        if ($event) {
            this.playerPicture = $event.target.files[0];
            this.$viewSelectedPicture.next(true);
        }
    }

    public handleAddNewParameter(): void {
        const parameter = this.playerParameterForm.value?.parameter as ParameterDTO | undefined;
        const score = this.playerParameterForm.value?.score as number | undefined;

        if (parameter && score) {
            const parameterName: string = this.parameters.filter((p) => p.name === parameter.name)[0].name;

            this.parametersOff.push(parameter);
            this.parameters = this.parameters.filter(p => p.name !== parameterName);

            const playerParameterScore: PlayerParameterScoreDTO = {
                id: parameter.id,
                name: parameterName,
                score: Number(this.playerParameterForm.value.score),
            };

            this.playerParametersScore.push(playerParameterScore);
            this.playerParametersScore.sort((p1, p2) => p1.name.toUpperCase().localeCompare(p2.name.toUpperCase()));

        }

        this.playerParameterForm.reset();
    }

    public handleDeletePlayerParameter(name: string): void {
        if (name) {
            this.playerParametersScore = this.playerParametersScore.filter(p => p.name !== name);

            const parameter: ParameterDTO | undefined = this.parametersOff.find((p) => p.name === name);
            parameter && this.parameters.push(parameter);
            this.parameters.sort((p1, p2) => p1.name.toUpperCase().localeCompare(p2.name.toUpperCase()));
        }
    }

    public handleSubmitEditPlayerForm(): void {
        if (this.playerForm.valid && this.playerForm.value && this.playerForm.value && this.selectedPlayer?.id) {
            const position = this.playerForm.value.position as UpdatePlayerDTO | undefined;
            if (position) {
                const playerRequest: UpdatePlayerDTO = {
                    id: String(this.selectedPlayer.id),
                    name: this.playerForm.value.name as string,
                    team: this.playerForm.value.team as string,
                    age: this.playerForm.value.age as string | undefined,
                    height: this.playerForm.value.height as string | undefined,
                    positionId: String(position.id),
                    playerPicture: this.playerPicture ?? undefined,
                    parameters: this.playerParametersScore
                };
                this.playerPicture && (this.playerService.changedPlayerPicture = true);

                this.playerService.update(playerRequest)
                    .pipe(takeUntil(this.$destroy))
                    .subscribe({
                        next: (playerResponse: PlayerFullDTO) => {
                            const updatedPlayer = this.players.find(p => p.id === this.selectedPlayer?.id);
                            updatedPlayer && (updatedPlayer.name = playerResponse.name);

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

                            this.handleBackAction();
                        }
                    });
            }

            this.playerForm.reset();
            this.playerParameterForm.reset();

            this.parametersOff.forEach(e => this.parameters.push(e));
            this.parameters.sort((p1, p2) => p1.name.toUpperCase().localeCompare(p2.name.toUpperCase()));
            this.parametersOff = new Array();
            this.playerParametersScore = [];
        }
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

}
