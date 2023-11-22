import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { GameModeMinDTO } from 'src/app/models/interfaces/gamemode/response/GameModeMinDTO';
import { GameModePositionDTO } from 'src/app/models/interfaces/gamemode/response/GameModePositonDTO';
import { PlayerFullScoreDTO } from 'src/app/models/interfaces/gamemode/response/PlayerFullScoreDTO';
import { GameModeService } from 'src/app/services/gamemode/gamemode.service';

@Component({
  selector: 'app-players-statistics-home',
  templateUrl: './players-statistics-home.component.html',
  styleUrls: []
})
export class PlayersStatisticsHomeComponent implements OnInit, OnDestroy {

    private destroy$: Subject<void> = new Subject();
    private readonly messageLife: number = 3000;

    public gameModes!: GameModeMinDTO[];
    public selectedGameModePositions!: GameModePositionDTO[];
    public getPlayersRankingForm: any = this.formBuilder.group (
        {
            gameModeId: new FormControl('', Validators.required),
            positionId: new FormControl({value: '', disabled: true}, Validators.required),
        }
    );

    public playersRankingLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
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
        this.messageService.clear();
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
        this.messageService.clear();
        if ($event) {
            this.gameModeService.findGameModePositions($event.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe (
                {
                    next: (gameModePositions) => {
                        this.selectedGameModePositions = gameModePositions;
                        if (gameModePositions.length > 0) {
                            this.getPlayersRankingForm.get('positionId').enable(true);
                        } else {
                            this.getPlayersRankingForm.get('positionId').disable(true);
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
                        this.getPlayersRankingForm.get('positionId').disable(true);
                        this.messageService.add (
                            {
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Please check your internet connection!',
                                life: this.messageLife,
                            }
                        );
                        console.log(err);
                    }
                }
            );
        }
    }

    public handleGetPlayersRankingAction( $event: {gameModeId: number, positionId: number} ): void {
        this.messageService.clear();
        if ($event) {
            setTimeout( () => this.playersRankingLoading$.next(false), 1000 );
            this.gameModeService.getRanking( $event.gameModeId, $event.positionId)
            .pipe(takeUntil(this.destroy$))
            .subscribe (
                {
                    next: (playersRanking) => {
                        this.playersRanking = playersRanking;
                        setTimeout( () =>  {
                            if (playersRanking.length > 0) {
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
                        }, 1500 );
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
