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
    public getPlayersRankingForm: any = this.formBuilder.group(
        {
            gameMode: new FormControl('', Validators.required),
            position: new FormControl({ value: '', disabled: true }, Validators.required),
        }
    );

    public viewActivate$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public playersRankingLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public playersRanking!: PlayerFullScoreDTO[] | undefined;
    public playersRankingPage!: PlayerFullScoreDTO[];

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
            .subscribe(
                {
                    next: (gameModes) => {
                        if (gameModes.length > 0) {
                            this.gameModes = gameModes;
                            this.messageService.add(
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
                        this.messageService.add(
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

    public handleFindGameModePositionsAction($event: { id: number; }): void {
        this.messageService.clear();
        if ($event) {
            this.gameModeService.findGameModePositions($event.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe(
                    {
                        next: (gameModePositions) => {
                            this.selectedGameModePositions = gameModePositions;
                            if (gameModePositions.length > 0) {
                                this.getPlayersRankingForm.get('position').enable(true);
                            } else {
                                this.getPlayersRankingForm.get('position').disable(true);
                                this.messageService.add(
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
                            this.getPlayersRankingForm.get('positiod').disable(true);
                            this.messageService.add(
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

    public handleGetPlayersRankingAction($event: { gameModeId: number, positionId: number }): void {
        this.messageService.clear();
        this.viewActivate$.next(true);
        if ($event) {
            setTimeout(() => this.playersRankingLoading$.next(false), 1000);
            this.gameModeService.getRanking($event.gameModeId, $event.positionId)
                .pipe(takeUntil(this.destroy$))
                .subscribe(
                    {
                        next: (playersRanking) => {
                            this.playersRanking = playersRanking;
                            this.playersRanking && (
                                this.playersRankingPage =
                                this.playersRanking.filter((element, index) => index >= 0 && index < 6)
                            );
                            if (playersRanking.length > 0) {
                                this.messageService.add(
                                    {
                                        severity: 'success',
                                        summary: 'Success',
                                        detail: 'Ranking obtained successfully!',
                                        life: this.messageLife
                                    }
                                );
                            } else {
                                setTimeout(() => {
                                    this.viewActivate$.next(false);
                                    this.playersRanking = undefined;
                                    this.messageService.add(
                                        {
                                            key: 'without-ranking-warn',
                                            severity: 'warn',
                                            summary: 'Warn',
                                            detail: 'Unable to list a ranking. Please update this position or register and edit players!',
                                            life: 10000,
                                        }
                                    );
                                }, 1000);
                            }
                        },
                        error: (err) => {
                            this.messageService.add(
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
            this.getPlayersRankingForm.get('position').reset();
        }
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
