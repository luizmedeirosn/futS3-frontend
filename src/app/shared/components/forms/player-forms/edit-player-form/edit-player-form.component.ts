import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ParameterDTO } from 'src/app/models/dto/parameter/response/ParameterDTO';
import { UpdatePlayerDTO } from 'src/app/models/dto/player/request/UpdatePlayerDTO';
import { PlayerFullDTO } from 'src/app/models/dto/player/response/PlayerFullDTO';
import { PlayerMinDTO } from 'src/app/models/dto/player/response/PlayerMinDTO';
import { PlayerParameterScoreDTO } from 'src/app/models/dto/player/response/PlayerParameterScoreDTO';
import { PositionMinDTO } from 'src/app/models/dto/position/response/PositionMinDTO';
import { ParameterService } from 'src/app/services/parameter/parameter.service';
import { PlayerService } from 'src/app/services/player/player.service';
import { PositionService } from 'src/app/services/position/position.service';

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
    public playerPicture!: File;

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
    ) { }

    public ngOnInit(): void {
        this.setPlayersWithApi();
        this.setPositionWithApi();
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
        const parametersNames = this.playerParametersScore.map(p => p.name);
        this.parameters.forEach(parameter => {
            if (parametersNames.includes(parameter.name)) {
                this.parametersOff.push(parameter);
                this.parameters = this.parameters.filter(p => p.name != parameter.name);
            }
        });
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
                            this.$viewTable.next(false);
                            this.playerForm.setValue({
                                name: player?.name,
                                team: player?.team,
                                age: player?.age,
                                height: player?.height,
                                position: player?.position,
                            });
                            this.playerParametersScore = player?.parameters;
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
        this.$viewTable.next(true); // Activate the view child before referencing the table
        setTimeout(() => {
            if (this.selectedPlayer?.id !== undefined) {
                const selectedPlayer: PlayerMinDTO | undefined =
                    this.players.find(player => player.id === this.selectedPlayer?.id);

                if (selectedPlayer) {
                    const index = this.players.indexOf(selectedPlayer);
                    const numPage: number = Math.floor(index / 5);
                    const page = this.playersTablePages.at(numPage);
                    const firstPlayerPage: PlayerMinDTO | undefined = page?.at(0);

                    this.playersTable.first =
                        firstPlayerPage && this.players.indexOf(firstPlayerPage);
                }
            }
            this.selectedPlayer = undefined;
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

            let playerParameterScore: PlayerParameterScoreDTO = {
                id: parameter.id,
                name: parameterName,
                playerScore: Number(this.playerParameterForm.value.score),
            };

            this.playerParametersScore.push(playerParameterScore);
        }
        this.playerParameterForm.reset();
    }

    private compareParameters = (p1: any, p2: any) => {
        if (p1.name < p2.name) {
            return -1;
        } else if (p1.name > p2.name) {
            return 1;
        }
        return 0;
    };

    public handleDeletePlayerParameter($event: string): void {
        this.playerParametersScore = this.playerParametersScore.filter(p => p.name !== $event);
        this.parameters.push(this.parametersOff.filter((p) => p.name === $event)[0]);
        this.parameters.sort(this.compareParameters);
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
                    playerPicture: this.playerPicture || undefined,
                    parameters: this.playerParametersScore
                };

                this.playerService.update(playerRequest)
                    .pipe(takeUntil(this.$destroy))
                    .subscribe({
                        next: (playerResponse: PlayerFullDTO) => {
                            const updatedPlayer = this.players.find(p => p.id === this.selectedPlayer?.id);
                            updatedPlayer && (updatedPlayer.name = playerResponse.name);

                            this.playerService.setChangesOn(true);
                            this.messageService.clear();
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Data edited successfully!',
                                life: this.toastLife
                            });
                        },
                        error: (err) => {
                            this.playerService.setChangesOn(false);
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
            this.playerForm.reset();
            this.playerParameterForm.reset();

            this.parametersOff.forEach(e => this.parameters.push(e));
            this.parameters.sort(this.compareParameters);
            this.parametersOff = new Array();
            this.playerParametersScore = [];

            this.handleBackAction();
        }
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

}
