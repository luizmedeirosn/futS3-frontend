import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { BehaviorSubject } from 'rxjs';
import { GameModeMinDTO } from 'src/app/models/interfaces/gamemode/response/GameModeMinDTO';
import { GameModePositionDTO } from 'src/app/models/interfaces/gamemode/response/GameModePositonDTO';
import { PlayerFullScoreDTO } from 'src/app/models/interfaces/gamemode/response/PlayerFullScoreDTO';

@Component({
  selector: 'app-players-rankings-view',
  templateUrl: './players-rankings-view.component.html',
  styleUrls: ['./players-rankings-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlayersRankingsViewComponent {

    @Input() public gameModes!: GameModeMinDTO[];
    @Input() public selectedGameModePositions!: GameModePositionDTO[];
    @Input() public getPlayersRankingForm: any;
    @Input() public playersRankingLoading$!: BehaviorSubject<boolean>;
    @Input() public playersRanking!: PlayerFullScoreDTO[];

    @Output() public findGameModePositionsEvent: EventEmitter<{ id: number }> = new EventEmitter();
    @Output() public getPlayerRankingEvent: EventEmitter<{ gameModeId: number, positionId: number }> = new EventEmitter();

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
            this.getPlayerRankingEvent.emit({ gameModeId, positionId });
        }
    }

}
