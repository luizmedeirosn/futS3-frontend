import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { Subject, takeUntil } from 'rxjs';
import { GameModeFullDTO } from 'src/app/models/interfaces/gamemode/response/GameModeFullDTO';
import { GameModeMinDTO } from 'src/app/models/interfaces/gamemode/response/GameModeMinDTO';
import { GameModeService } from 'src/app/services/gamemode/gamemode.service';

@Component({
  selector: 'app-players-rankings-view',
  templateUrl: './players-rankings-view.component.html',
  styleUrls: ['./players-rankings-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlayersRankingsViewComponent implements OnInit, OnDestroy {

    private readonly destroy$: Subject<void> = new Subject();

    @Input() public gameModes!: GameModeMinDTO[];
    @Input() public selectedGameModeFull!: GameModeFullDTO;
    @Input() public getPlayersRankingForm: any;

    @Output() public findGameModePositionsEvent: EventEmitter<{id: number}> = new EventEmitter();

    public constructor (
        private gameModeService: GameModeService,
    ) {
    }

    public ngOnInit(): void {
        this.selectedGameModeFull = {
            id: 0,
            formationName: '',
            description: '',
            fields: []
        }
    }

    public handleFindGameModePositionsEvent($event: DropdownChangeEvent): void {
        if ($event && this.getPlayersRankingForm.value.gameModeId) {
            this.findGameModePositionsEvent.emit (
                {
                    id: this.gameModes.at( ($event.value as number) -1 )?.id as number,
                }
            );
        } else {
            this.getPlayersRankingForm.get('positionId').disable(true);
        }
    }

    public handleGetPlayersRanking(): void {
        if (this.getPlayersRankingForm.value.gameModeId && this.getPlayersRankingForm.value.positionId) {
            this.gameModeService.getRanking(this.getPlayersRankingForm.value.gameModeId, this.getPlayersRankingForm.value.positionId)
            .pipe(takeUntil(this.destroy$))
            .subscribe (
                {
                    next: (playersRanking) => {
                        console.log(playersRanking);
                    },
                    error: (err) => {
                        console.log(err);
                    }
                }
            );
        }
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
