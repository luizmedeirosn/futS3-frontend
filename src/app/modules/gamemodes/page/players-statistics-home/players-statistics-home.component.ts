import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {BehaviorSubject, Subject, takeUntil} from 'rxjs';
import {GameModeMinDTO} from 'src/app/models/dto/gamemode/response/GameModeMinDTO';
import {GameModePositionDTO} from 'src/app/models/dto/gamemode/response/GameModePositonDTO';
import {PlayerFullDataDTO} from 'src/app/models/dto/gamemode/response/PlayerFullDataDTO';
import {GameModeService} from 'src/app/services/gamemode/gamemode.service';
import {
    PlayersStatisticsViewComponent
} from '../../components/players-statistics-view/players-statistics-view.component';
import Page from "../../../../models/dto/generics/response/Page";
import Pageable from "../../../../models/dto/generics/request/Pageable";

@Component({
    selector: 'app-players-statistics-home',
    templateUrl: './players-statistics-home.component.html',
    styleUrls: []
})
export class PlayersStatisticsHomeComponent implements OnInit, OnDestroy {

    private destroy$: Subject<void> = new Subject();
    private readonly messageLife: number = 3000;

    @ViewChild('playersStatisticsViewRef') playerStatisticsViewComponentRef!: PlayersStatisticsViewComponent;

    public gameModes!: GameModeMinDTO[];
    public selectedGameModePositions!: GameModePositionDTO[];
    public getPlayersRankingForm: any = this.formBuilder.group(
        {
            gameMode: new FormControl('', Validators.required),
            position: new FormControl({value: '', disabled: true}, Validators.required),
        }
    );

    public viewActivate$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public playersRankingLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public playersRanking!: PlayerFullDataDTO[] | undefined;
    public playersRankingPage!: PlayerFullDataDTO[];

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
        this.gameModeService.findAllWithTotalRecords()
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                {
                    next: (gameModesPage: Page<GameModeMinDTO>) => {
                        this.gameModes = gameModesPage.content;
                        this.messageService.add(
                            {
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Data loaded successfully!',
                                life: this.messageLife
                            }
                        );
                    },
                    error: (err) => {
                        this.messageService.add(
                            {
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Unexpected error!',
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
            this.gameModeService.findById($event.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe(
                    {
                        next: (gameMode) => {
                            this.selectedGameModePositions = gameMode.positions.map<GameModePositionDTO>(p => new GameModePositionDTO(p.id, p.name));

                            if (gameMode.positions.length > 0) {
                                this.getPlayersRankingForm.get('position').enable(true);

                            } else {
                                this.getPlayersRankingForm.get('position').disable(true);
                                this.messageService.clear();
                                this.messageService.add(
                                    {
                                        key: 'info-statistics-section',
                                        severity: 'info',
                                        summary: 'Info',
                                        detail: 'No positions registered for this game mode!',
                                        life: 10000,
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
                                    detail: 'Unexpected error!',
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
            this.gameModeService.getPlayersRanking($event.gameModeId, $event.positionId)
                .pipe(takeUntil(this.destroy$))
                .subscribe(
                    {
                        next: (playersRankingPage: Page<PlayerFullDataDTO>) => {
                            console.log(playersRankingPage)
                            if (playersRankingPage.content.length > 0) {
                                this.playersRanking = playersRankingPage.content;
                                this.playersRanking && (
                                    this.playersRankingPage =
                                        this.playersRanking.filter((element, index) => index >= 0 && index < 6)
                                );

                                this.playerStatisticsViewComponentRef.setChartBarData(0, 6, playersRankingPage.content);
                                this.playerStatisticsViewComponentRef.setCharRadarData(0, 3, playersRankingPage.content);

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
                                    this.messageService.clear();
                                    this.messageService.add(
                                        {
                                            key: 'warn-statistics-section',
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
