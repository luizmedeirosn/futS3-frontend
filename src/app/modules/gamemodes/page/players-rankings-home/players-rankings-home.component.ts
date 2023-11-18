import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GameModeMinDTO } from 'src/app/models/interfaces/gamemode/response/GameModeMinDTO';
import { GameModePositionDTO } from 'src/app/models/interfaces/gamemode/response/GameModePositonDTO';
import { PlayerFullScoreDTO } from 'src/app/models/interfaces/gamemode/response/PlayerFullScoreDTO';
import { GameModeService } from 'src/app/services/gamemode/gamemode.service';

@Component({
  selector: 'app-players-rankings-home',
  templateUrl: './players-rankings-home.component.html',
  styleUrls: []
})
export class PlayersRankingsHomeComponent implements OnInit, OnDestroy {

    private destroy$: Subject<void> = new Subject();
    private readonly messageLife: number = 2500;

    public gameModes!: GameModeMinDTO[];
    public selectedGameModePositions!: GameModePositionDTO[];
    public getPlayersRankingForm: any = this.formBuilder.group (
        {
            gameModeId: new FormControl('', Validators.required),
            positionId: new FormControl({value: '', disabled: true}, Validators.required),
        }
    );
    public playersRanking!: PlayerFullScoreDTO[];

    public constructor(
        private gameModeService: GameModeService,
        private messageService: MessageService,
        private formBuilder: FormBuilder,
    ) {
    }

    public ngOnInit(): void {
        this.setGameModes();
    }

    private setGameModes(): void {
        this.gameModeService.findAll()
        .pipe(takeUntil(this.destroy$))
        .subscribe (
            {
                next: (gameModes) => {
                    if (gameModes.length > 0) {
                        this.gameModes = gameModes;
                        this.messageService.add (
                            {
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Data loaded successfully!',
                                life: this.messageLife
                            }
                        );
                    }
                },
                error: (err) => {
                    this.messageService.add (
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

    public handleFindGameModePositionsAction( $event: { id: number; } ) : void {
        if ($event) {
            this.gameModeService.findGameModePositions($event.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe (
                {
                    next: (gameModePositions) => {
                        this.selectedGameModePositions = gameModePositions;
                        if (gameModePositions.length > 0) {
                            this.getPlayersRankingForm.get('positionId').enable(true);
                            this.messageService.clear();
                        } else {
                            this.getPlayersRankingForm.get('positionId').disable(true);
                            this.messageService.clear();
                            this.messageService.add (
                                {
                                    severity: 'info',
                                    summary: 'Info',
                                    detail: 'No positions registered for this game mode!',
                                    life: 5000,
                                }
                            );
                        }
                    },
                    error: (err) => {
                        console.log(err);
                    }
                }
            );
        }
    }

    public handleGetPlayersRankingAction( $event: {gameModeId: number, positionId: number} ): void {
        if ($event) {
            this.gameModeService.getRanking( $event.gameModeId, $event.positionId)
            .pipe(takeUntil(this.destroy$))
            .subscribe (
                {
                    next: (playersRanking) => {
                        this.playersRanking = playersRanking;
                        if (playersRanking.length > 0) {
                            this.messageService.clear();
                            this.messageService.add (
                                {
                                    severity: 'success',
                                    summary: 'Success',
                                    detail: 'Ranking obtained successfully!',
                                    life: this.messageLife
                                }
                            );
                        } else {
                            this.messageService.add (
                                {
                                    key: 'without-ranking-warn',
                                    severity: 'warn',
                                    summary: 'Warn',
                                    detail: 'Unable to list a ranking. Please update this position or register and edit players!',
                                    life: 10000,
                                }
                            );
                        }
                    },
                    error: (err) => {
                        this.messageService.add (
                            {
                                severity: 'error',
                                summary: 'Error',
                                detail: '"Error retrieving the ranking!',
                                life: this.messageLife
                            }
                        );
                        console.log(err);
                    }
                }
            );
            this.getPlayersRankingForm.get('positionId').reset();
        }
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
