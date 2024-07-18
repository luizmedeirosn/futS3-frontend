import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { GameModeMinDTO } from 'src/app/models/dto/gamemode/response/GameModeMinDTO';
import { GameModePositionDTO } from 'src/app/models/dto/gamemode/response/GameModePositonDTO';
import { PlayerFullDataDTO } from 'src/app/models/dto/gamemode/response/PlayerFullDataDTO';
import { GameModeService } from 'src/app/services/gamemode/gamemode.service';
import { PlayersStatisticsViewComponent } from '../../components/players-statistics-view/players-statistics-view.component';
import Page from '../../../../models/dto/generics/response/Page';
import GetPlayersRankingAction from '../../../../models/events/GetPlayersRankingAction';
import Pageable from '../../../../models/dto/generics/request/Pageable';
import PageMin from '../../../../models/dto/generics/response/PageMin';
import { ViewAction } from '../../../../models/events/ViewAction';
import ChangePageAction from '../../../../models/events/ChangePageAction';

@Component({
  selector: 'app-players-statistics-home',
  templateUrl: './players-statistics-home.component.html',
  styleUrls: [],
})
export class PlayersStatisticsHomeComponent implements OnInit, OnDestroy {
  private $destroy: Subject<void> = new Subject();
  private readonly messageLife: number = 3000;

  private $currentGetPlayersRankingEvent!: GetPlayersRankingAction;

  @ViewChild('playersStatisticsViewRef')
  playerStatisticsViewComponentRef!: PlayersStatisticsViewComponent;

  public gameModes!: GameModeMinDTO[];
  public selectedGameModePositions!: GameModePositionDTO[];

  public getPlayersRankingForm: any = this.formBuilder.group({
    gameMode: new FormControl('', Validators.required),
    position: new FormControl({ value: '', disabled: true }, Validators.required),
  });
  public $viewActivate: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public playersRankingPageable!: Pageable;
  public chartBarPageable!: Pageable;
  public chartRadarPageable!: Pageable;

  public $playersRankingLoading!: BehaviorSubject<boolean>;
  public $chartBarLoading!: BehaviorSubject<boolean>;
  public $chartRadarLoading!: BehaviorSubject<boolean>;

  public playersRankingPage!: PageMin<PlayerFullDataDTO>;
  public chartBarPage!: PageMin<PlayerFullDataDTO>;
  public chartRadarPage!: PageMin<PlayerFullDataDTO>;

  public constructor(
    private gameModeService: GameModeService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
  ) {
    this.playersRankingPageable = new Pageable('', 0, 5);
    this.$playersRankingLoading = new BehaviorSubject(false);
    this.playersRankingPage = {
      content: [],
      pageNumber: 0,
      pageSize: 5,
      totalElements: 0,
    };

    this.chartBarPageable = new Pageable('', 0, 5);
    this.$chartBarLoading = new BehaviorSubject(false);
    this.chartBarPage = {
      content: [],
      pageNumber: 0,
      pageSize: 5,
      totalElements: 0,
    };

    this.chartRadarPageable = new Pageable('', 0, 3);
    this.$chartRadarLoading = new BehaviorSubject(false);
    this.chartRadarPage = {
      content: [],
      pageNumber: 0,
      pageSize: 3,
      totalElements: 0,
    };
  }

  public ngOnInit(): void {
    this.setGameModes();
  }

  private setGameModes(): void {
    this.messageService.clear();
    this.gameModeService
      .findAllWithTotalRecords()
      .pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (gameModesPage: Page<GameModeMinDTO>) => {
          this.gameModes = gameModesPage.content;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Data loaded successfully!',
            life: this.messageLife,
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Unexpected error!',
            life: this.messageLife,
          });
          console.log(err);
        },
      });
  }

  public handleFindGameModePositionsAction($event: ViewAction): void {
    if ($event) {
      this.messageService.clear();
      this.gameModeService
        .findById($event.id)
        .pipe(takeUntil(this.$destroy))
        .subscribe({
          next: (gameMode) => {
            this.selectedGameModePositions = gameMode.positions.map<GameModePositionDTO>(
              (p) => new GameModePositionDTO(p.id, p.name),
            );

            if (gameMode.positions.length > 0) {
              this.getPlayersRankingForm.get('position').enable(true);
            } else {
              this.getPlayersRankingForm.get('position').disable(true);
              this.messageService.clear();
              this.messageService.add({
                key: 'info-statistics-section',
                severity: 'info',
                summary: 'Info',
                detail: 'No positions registered for this game mode!',
                life: 10000,
              });
            }
          },
          error: (err) => {
            this.messageService.clear();
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Unexpected error!',
              life: this.messageLife,
            });

            console.log(err);

            this.getPlayersRankingForm.get('positiod').disable(true);
          },
        });
    }
  }

  public handleGetPlayersRankingAction($event: GetPlayersRankingAction): void {
    if ($event) {
      this.$currentGetPlayersRankingEvent = $event;

      this.$viewActivate.next(true);

      setTimeout(() => {
        this.messageService.clear();

        const pageable: Pageable = new Pageable('', 0, 5);
        this.gameModeService
          .getPlayersRanking($event.gameModeId, $event.positionId, pageable)
          .pipe(takeUntil(this.$destroy))
          .subscribe({
            next: (playersRankingPage: Page<PlayerFullDataDTO>) => {
              if (playersRankingPage.content.length > 0) {
                const content: PlayerFullDataDTO[] = playersRankingPage.content;
                const pageNumber: number = playersRankingPage.pageable.pageNumber;
                const pageSize: number = playersRankingPage.pageable.pageSize;
                const totalElements: number = playersRankingPage.totalElements;

                this.playersRankingPage.content = content;
                this.playersRankingPage.pageNumber = pageNumber;
                this.playersRankingPage.pageSize = pageSize;
                this.playersRankingPage.totalElements = totalElements;

                this.chartBarPage.content = content;
                this.chartBarPage.pageNumber = pageNumber;
                this.chartBarPage.pageSize = pageSize;
                this.chartBarPage.totalElements = totalElements;

                // the initial number of radar elements is 3
                this.chartRadarPage.content = content.slice(0, 3);
                this.chartRadarPage.pageNumber = pageNumber / 2;
                this.chartRadarPage.pageSize = pageSize / 2;
                this.chartRadarPage.totalElements = totalElements;

                this.playerStatisticsViewComponentRef.reloadChartBarData();
                this.playerStatisticsViewComponentRef.reloadChartRadarData();

                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Ranking obtained successfully!',
                  life: this.messageLife,
                });
              } else {
                this.messageService.add({
                  key: 'warn-statistics-section',
                  severity: 'warn',
                  summary: 'Warn',
                  detail: 'Unable to list a ranking. Please update this position or register and edit players!',
                  life: 10000,
                });

                this.$viewActivate.next(false);
              }

              this.$playersRankingLoading.next(false);
              this.$chartBarLoading.next(false);
              this.$chartRadarLoading.next(false);
            },
            error: (err) => {
              this.messageService.clear();
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: '"Error retrieving the ranking!',
                life: this.messageLife,
              });

              console.log(err);

              this.$playersRankingLoading.next(false);
              this.$chartBarLoading.next(false);
              this.$chartRadarLoading.next(false);
            },
          });
      }, 500);

      this.getPlayersRankingForm.get('position').reset();
    }
  }

  public handleChangePagePlayersRankingAction($event: ChangePageAction) {
    if ($event && this.$currentGetPlayersRankingEvent) {
      const gameModeId: number = this.$currentGetPlayersRankingEvent.gameModeId;
      const positionId: number = this.$currentGetPlayersRankingEvent.positionId;

      const pageable: Pageable = new Pageable('', $event.pageNumber, $event.pageSize);
      this.playersRankingPageable = pageable;

      this.$playersRankingLoading.next(true);

      setTimeout(() => {
        this.gameModeService
          .getPlayersRanking(gameModeId, positionId, pageable)
          .pipe(takeUntil(this.$destroy))
          .subscribe({
            next: (playersPage: Page<PlayerFullDataDTO>) => {
              this.playersRankingPage.content = playersPage.content;
              this.playersRankingPage.pageNumber = playersPage.pageable.pageNumber;
              this.playersRankingPage.pageSize = playersPage.pageable.pageSize;
              this.playersRankingPage.totalElements = playersPage.totalElements;

              this.$playersRankingLoading.next(false);
            },
            error: (err) => {
              this.messageService.clear();
              err.status != 403 &&
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Unexpected error!',
                  life: this.messageLife,
                });

              console.log(err);

              this.$playersRankingLoading.next(false);
            },
          });
      }, 500);
    }
  }

  public handleChangePageChartBarAction($event: ChangePageAction) {
    if ($event && this.$currentGetPlayersRankingEvent) {
      const gameModeId: number = this.$currentGetPlayersRankingEvent.gameModeId;
      const positionId: number = this.$currentGetPlayersRankingEvent.positionId;

      const pageable: Pageable = new Pageable('', $event.pageNumber, $event.pageSize);
      this.chartBarPageable = pageable;

      this.$chartBarLoading.next(true);

      setTimeout(() => {
        this.gameModeService
          .getPlayersRanking(gameModeId, positionId, pageable)
          .pipe(takeUntil(this.$destroy))
          .subscribe({
            next: (playersPage: Page<PlayerFullDataDTO>) => {
              this.chartBarPage.content = playersPage.content;
              this.chartBarPage.pageNumber = playersPage.pageable.pageNumber;
              this.chartBarPage.pageSize = playersPage.pageable.pageSize;
              this.chartBarPage.totalElements = playersPage.totalElements;

              this.playerStatisticsViewComponentRef.reloadChartBarData();

              this.$chartBarLoading.next(false);
            },
            error: (err) => {
              this.messageService.clear();
              err.status != 403 &&
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Unexpected error!',
                  life: this.messageLife,
                });

              console.log(err);

              this.$chartBarLoading.next(false);
            },
          });
      }, 500);
    }
  }

  public handleChangePageChartRadarAction($event: ChangePageAction) {
    if ($event && this.$currentGetPlayersRankingEvent) {
      const gameModeId: number = this.$currentGetPlayersRankingEvent.gameModeId;
      const positionId: number = this.$currentGetPlayersRankingEvent.positionId;

      const pageable: Pageable = new Pageable('', $event.pageNumber, $event.pageSize);
      this.chartRadarPageable = pageable;

      this.$chartRadarLoading.next(true);

      setTimeout(() => {
        this.gameModeService
          .getPlayersRanking(gameModeId, positionId, pageable)
          .pipe(takeUntil(this.$destroy))
          .subscribe({
            next: (playersPage: Page<PlayerFullDataDTO>) => {
              this.chartRadarPage.content = playersPage.content;
              this.chartRadarPage.pageNumber = playersPage.pageable.pageNumber;
              this.chartRadarPage.pageSize = playersPage.pageable.pageSize;
              this.chartRadarPage.totalElements = playersPage.totalElements;

              this.playerStatisticsViewComponentRef.reloadChartRadarData();

              this.$chartRadarLoading.next(false);
            },
            error: (err) => {
              this.messageService.clear();
              err.status != 403 &&
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Unexpected error!',
                  life: this.messageLife,
                });

              console.log(err);

              this.$chartRadarLoading.next(false);
            },
          });
      }, 500);
    }
  }

  public ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
