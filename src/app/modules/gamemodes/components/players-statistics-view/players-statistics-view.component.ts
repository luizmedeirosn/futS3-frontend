import { Component, EventEmitter, Input, OnDestroy, Output, ViewEncapsulation } from '@angular/core';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { GameModeMinDTO } from 'src/app/models/interfaces/gamemode/response/GameModeMinDTO';
import { GameModePositionDTO } from 'src/app/models/interfaces/gamemode/response/GameModePositonDTO';
import { PlayerFullScoreDTO } from 'src/app/models/interfaces/gamemode/response/PlayerFullScoreDTO';
import { PositionParametersDTO } from '../../../../models/interfaces/position/response/PositionParametersDTO';

import { IconDefinition, faMagnifyingGlassChart, faRankingStar } from '@fortawesome/free-solid-svg-icons';
import { PaginatorState } from 'primeng/paginator';
import { PositionService } from 'src/app/services/position/position.service';

@Component({
  selector: 'app-players-statistics-view',
  templateUrl: './players-statistics-view.component.html',
  styleUrls: ['./players-statistics-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlayersStatisticsViewComponent implements OnDestroy {

    private readonly destroy$: Subject<void> = new Subject();

    @Input() public gameModes!: GameModeMinDTO[];
    @Input() public selectedGameModePositions!: GameModePositionDTO[];
    @Input() public getPlayersRankingForm: any;
    @Input() public playersRanking!: PlayerFullScoreDTO[];
    @Input() public playersRankingLoading$!: BehaviorSubject<boolean>;

    @Output() public findGameModePositionsEvent: EventEmitter<{ id: number }> = new EventEmitter();
    @Output() public getPlayerRankingEvent: EventEmitter<{ gameModeId: number, positionId: number }> = new EventEmitter();

    public playersRankingViewEnable$: BehaviorSubject<boolean> = new BehaviorSubject(true);
    private positionParameters!: PositionParametersDTO[];

    public readonly faRankingStar: IconDefinition = faRankingStar;
    public readonly faMagnifyingGlassChart: IconDefinition = faMagnifyingGlassChart;
    public readonly faIconsStyles: any = {
        'color' : '#fff;',
        'align-content' : 'end;'
    }

    private readonly documentStyle = getComputedStyle(document.documentElement);
    private readonly textColor = this.documentStyle.getPropertyValue('--black-1');
    private readonly textColorSecondary = this.documentStyle.getPropertyValue('--black-1');
    private readonly surfaceBorder = this.documentStyle.getPropertyValue('--surface-border');

    public chartBarData: any;
    public chartBarOptions: any;

    public chartRadarData: any;
    public chartRadarOptions: any;
    private readonly colors: Array<string>
        = new Array( '--green-500', '--blue-600', '--red-600'  );


    constructor (
        private positionService: PositionService
    ) {
    }

    public handleFindGameModePositionsEvent($event: DropdownChangeEvent): void {
        if ($event && this.getPlayersRankingForm.value?.gameModeId) {
            this.findGameModePositionsEvent.emit (
                {
                    id: this.gameModes.at( ($event.value as number) -1 )?.id as number,
                }
            );
        } else {
            this.getPlayersRankingForm.get('positionId').disable(true);
        }
    }

    public handleGetPlayersRankingEvent(): void {
        const gameModeId = this.getPlayersRankingForm.value?.gameModeId as number | undefined;
        const positionId = this.getPlayersRankingForm.value?.positionId as number | undefined;
        if (gameModeId && positionId) {
            this.setPositionParameters(positionId);
            this.playersRanking = new Array();
            this.playersRankingLoading$.next(true);
            this.getPlayerRankingEvent.emit({ gameModeId, positionId });
        }
    }

    private setPositionParameters(positionId: number): void {
        this.positionService.findPositionParametersById(positionId)
        .pipe(takeUntil(this.destroy$))
        .subscribe (
            {
                next: (positionParameters) => {
                    this.positionParameters = positionParameters;
                },
                error: (err) => {
                    console.log(err);
                }
            }
        );
    }

    public activeViewPlayersRanking() {
        this.playersRankingViewEnable$.next(true);
    }

    public desactiveViewPlayersRanking() {
        this.playersRankingViewEnable$.next(false);
        this.setChartBarData(0 , 5);
        this.setCharRadarData(0, 3);
    }

    public onPageChangeChartBar(event$: PaginatorState): void {
        if (event$.first !== undefined && event$.rows !== undefined) {
            this.setChartBarData(event$.first, event$.rows);
        }
    }

    public onPageChangeChartRadar(event$: PaginatorState): void {
        if (event$.first !== undefined && event$.rows !== undefined) {
            this.setCharRadarData(event$.first, event$.rows);
        }
    }

    private setChartBarData(first: number, rows: number): void {
        const playersNames =
            this.playersRanking.filter( (element, index) => index >= first && index < first+rows )
            .map( (value) => value.name );
        const playersTotalScores =
            this.playersRanking.filter( (element, index) => index >= first && index < first+rows )
            .map( (value) => value.totalScore );

        this.chartBarData = {
            labels: playersNames,
            datasets: [
                {
                    label: 'Total Score',
                    backgroundColor: this.documentStyle.getPropertyValue('--blue-700'),
                    borderColor: this.documentStyle.getPropertyValue('--blue-700'),
                    data: playersTotalScores
                },
            ]
        };

        this.chartBarOptions = {
            indexAxis: 'y',
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
              legend: {
                labels: {
                  color: this.textColor,
                  font: {
                    weight: '500',
                    size: 15
                  }
                }
              }
            },
            scales: {
              x: {
                ticks: {
                  color: this.textColorSecondary,
                  font: {
                    weight: '500',
                    size: 15
                  }
                },
                grid: {
                  color: this.surfaceBorder
                }
              },
              y: {
                ticks: {
                  color: this.textColorSecondary,
                  font: {
                    weight: '500',
                    size: 15
                  }
                },
                grid: {
                  color: this.surfaceBorder
                }
              }
            }
          }
    }

    private setCharRadarData(first: number, rows: number) {
        let datasets: any[] = [];
        let colorIndex = 0;
        for (let i = first + rows - 1; i >= first; i--, colorIndex++) {
            const player = this.playersRanking.at(i);
            if (player) {
                datasets.push({
                    label: player.name,
                    borderColor: this.documentStyle.getPropertyValue(String(this.colors.at(colorIndex))),
                    pointBackgroundColor: this.documentStyle.getPropertyValue(String(this.colors.at(colorIndex))),
                    pointBorderColor: this.documentStyle.getPropertyValue(String(this.colors.at(colorIndex))),
                    pointHoverBackgroundColor: this.textColor,
                    pointHoverBorderColor: this.documentStyle.getPropertyValue(String(this.colors.at(colorIndex))),
                    data: player.parameters.map((element) => element.playerScore),
                });
            }
        }
        datasets.reverse();
        this.chartRadarData = {
            labels: this.positionParameters.map( (element) => element.parameterName ),
            datasets
        };

        this.chartRadarOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: this.textColor,
                        font: {
                            weight: '500',
                            size: 16
                        }
                    }
                }
            },
            scales: {
                r: {
                    grid: {
                        color: this.documentStyle.getPropertyValue('--gray-500'),
                    },
                    pointLabels: {
                        color: this.textColorSecondary,
                        font: {
                            size: 15
                        }
                    },
                    ticks: {
                        color: this.textColorSecondary,
                        font: {
                            size: 16
                        }
                    }
                },
            },
            backgroundColor: '#dfdfdf10',
        };
    }

    public ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
