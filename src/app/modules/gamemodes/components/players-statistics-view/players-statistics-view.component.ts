import { Component, EventEmitter, Input, OnDestroy, Output, ViewEncapsulation } from '@angular/core';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { PaginatorState } from 'primeng/paginator';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { GameModeMinDTO } from 'src/app/models/dto/gamemode/response/GameModeMinDTO';
import { GameModePositionDTO } from 'src/app/models/dto/gamemode/response/GameModePositonDTO';
import { PlayerFullDataDTO } from 'src/app/models/dto/gamemode/response/PlayerFullDataDTO';
import { ParameterWeightDTO } from 'src/app/models/dto/position/aux/ParameterWeightDTO';
import { PositionDTO } from 'src/app/models/dto/position/response/PositionDTO';
import { PositionService } from 'src/app/services/position/position.service';
import { ViewAction } from '../../../../models/events/ViewAction';
import GetPlayersRankingAction from '../../../../models/events/GetPlayersRankingAction';
import Pageable from '../../../../models/dto/generics/request/Pageable';
import PageMin from '../../../../models/dto/generics/response/PageMin';
import ChangePageAction from '../../../../models/events/ChangePageAction';

@Component({
  selector: 'app-players-statistics-view',
  templateUrl: './players-statistics-view.component.html',
  styleUrls: ['./players-statistics-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PlayersStatisticsViewComponent implements OnDestroy {
  private readonly $destroy: Subject<void> = new Subject();

  @Input() public gameModes!: GameModeMinDTO[];
  @Input() public selectedGameModePositions!: GameModePositionDTO[];

  @Input() public getPlayersRankingForm: any;
  @Input() public $viewActivate!: BehaviorSubject<boolean>;

  // Save page data as the index of the first element of the page
  @Input() public playersRankingPageable!: Pageable;
  @Input() public chartBarPageable!: Pageable;
  @Input() public chartRadarPageable!: Pageable;

  @Input() public $playersRankingLoading!: BehaviorSubject<boolean>;
  @Input() public $chartBarLoading!: BehaviorSubject<boolean>;
  @Input() public $chartRadarLoading!: BehaviorSubject<boolean>;

  @Input() public playersRankingPage!: PageMin<PlayerFullDataDTO>;
  @Input() public chartBarPage!: PageMin<PlayerFullDataDTO>;
  @Input() public chartRadarPage!: PageMin<PlayerFullDataDTO>;

  @Output() public findGameModePositionsEvent: EventEmitter<ViewAction> = new EventEmitter<ViewAction>();
  @Output()
  public getPlayersRankingEvent: EventEmitter<GetPlayersRankingAction> = new EventEmitter();

  @Output()
  public changePagePlayersRankingEvent: EventEmitter<ChangePageAction> = new EventEmitter();
  @Output() public changePageChartBarEvent: EventEmitter<ChangePageAction> = new EventEmitter();
  @Output() public changePageChartRadarEvent: EventEmitter<ChangePageAction> = new EventEmitter();

  public $playersRankingViewEnable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private positionParameters!: ParameterWeightDTO[];

  private readonly documentStyle = getComputedStyle(document.documentElement);
  private readonly textColor = this.documentStyle.getPropertyValue('--black-1');
  private readonly textColorSecondary = this.documentStyle.getPropertyValue('--black-1');
  private readonly surfaceBorder = this.documentStyle.getPropertyValue('--surface-border');

  public chartBarData: any;
  public chartBarOptions: any;

  public chartRadarData: any;
  public chartRadarOptions: any;
  private readonly colors: Array<string> = ['--blue-600', '--green-600', '--red-600'];

  public constructor(private positionService: PositionService) {}

  public handleFindGameModePositionsEvent($event: DropdownChangeEvent): void {
    if ($event && this.getPlayersRankingForm.value?.gameMode && this.gameModes.includes($event.value)) {
      this.findGameModePositionsEvent.emit({
        id: Number($event.value.id),
      });
    } else {
      this.getPlayersRankingForm.get('position').disable(true);
    }
  }

  public handleGetPlayersRankingEvent(): void {
    const gameModeIdInput = this.getPlayersRankingForm.value?.gameMode.id;
    const positionIdInput = this.getPlayersRankingForm.value?.position.positionId;
    if (gameModeIdInput && positionIdInput) {
      const gameModeId = Number(gameModeIdInput);
      const positionId = Number(positionIdInput);

      this.setPositionParameters(positionId);

      this.$playersRankingLoading.next(true);
      this.$chartBarLoading.next(true);
      this.$chartRadarLoading.next(true);

      this.getPlayersRankingEvent.emit({
        gameModeId,
        positionId,
      });
    }
  }

  private setPositionParameters(positionId: number): void {
    this.positionService
      .findById(positionId)
      .pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (position: PositionDTO) => {
          this.positionParameters = position.parameters;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  public activeViewPlayersRanking() {
    this.$playersRankingViewEnable.next(true);
  }

  public desactiveViewPlayersRanking() {
    this.reloadChartBarData();
    this.reloadChartRadarData();

    this.$playersRankingViewEnable.next(false);
  }

  public handleChangePlayersRankingPage($event: PaginatorState) {
    if ($event && $event.first !== undefined && $event.rows !== undefined) {
      const pageNumber: number = Math.ceil($event.first / $event.rows);
      const pageSize: number = $event.rows !== 0 ? $event.rows : 5;

      this.changePagePlayersRankingEvent.emit({
        keyword: '',
        pageNumber,
        pageSize,
      });
    }
  }

  public handleChangePageChartBar($event: PaginatorState): void {
    if ($event.first !== undefined && $event.rows !== undefined) {
      const pageNumber: number = Math.ceil($event.first / $event.rows);
      const pageSize: number = $event.rows !== 0 ? $event.rows : 5;

      this.changePageChartBarEvent.emit({
        keyword: '',
        pageNumber,
        pageSize,
      });
    }
  }

  public handleChangePageChartRadar($event: PaginatorState): void {
    if ($event.first !== undefined && $event.rows !== undefined) {
      const pageNumber: number = Math.ceil($event.first / $event.rows);
      const pageSize: number = $event.rows !== 0 ? $event.rows : 3;

      this.changePageChartRadarEvent.emit({
        keyword: '',
        pageNumber,
        pageSize,
      });
    }
  }

  public reloadChartBarData(): void {
    const players: PlayerFullDataDTO[] = this.chartBarPage.content;
    const playersNames: string[] = players.map((p) => p.name);
    const playersTotalScores: number[] = players.map((p) => p.totalScore);

    this.chartBarData = {
      labels: playersNames,
      datasets: [
        {
          label: 'Total Score',
          backgroundColor: this.documentStyle.getPropertyValue('--green-600'),
          borderColor: this.documentStyle.getPropertyValue('--green-600'),
          data: playersTotalScores,
        },
      ],
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
              size: 15,
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: this.textColorSecondary,
            font: {
              weight: '500',
              size: 15,
            },
          },
          grid: {
            color: this.surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: this.textColorSecondary,
            font: {
              weight: '500',
              size: 15,
            },
          },
          grid: {
            color: this.surfaceBorder,
          },
        },
      },
    };
  }

  public reloadChartRadarData(): void {
    const players: PlayerFullDataDTO[] = this.chartRadarPage.content;

    const datasets: any[] = [];
    let colorIndex = 0;
    for (let i = players.length - 1; i >= 0; i--, colorIndex++) {
      const player: PlayerFullDataDTO | undefined = players.at(i);
      if (player) {
        datasets.push({
          label: player.name,
          borderColor: this.documentStyle.getPropertyValue(String(this.colors.at(colorIndex))),
          pointBackgroundColor: this.documentStyle.getPropertyValue(String(this.colors.at(colorIndex))),
          pointBorderColor: this.documentStyle.getPropertyValue(String(this.colors.at(colorIndex))),
          pointHoverBackgroundColor: this.textColor,
          pointHoverBorderColor: this.documentStyle.getPropertyValue(String(this.colors.at(colorIndex))),
          pointBorderWidth: 3,
          data: player.parameters.map((element) => element.score),
        });
      }
    }

    datasets.reverse();
    this.chartRadarData = {
      labels: this.positionParameters.map((element) => element.name),
      datasets,
    };

    this.chartRadarOptions = {
      plugins: {
        legend: {
          labels: {
            color: this.textColor,
            font: {
              weight: '500',
              size: 17,
            },
          },
        },
      },
      scales: {
        r: {
          grid: {
            color: this.documentStyle.getPropertyValue('--gray-500'),
          },
          pointLabels: {
            color: this.textColorSecondary,
            font: {
              size: 17,
            },
          },
          ticks: {
            color: this.textColorSecondary,
            font: {
              size: 17,
            },
          },
        },
      },
      backgroundColor: '#d0d0d001',
    };
  }

  public ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
