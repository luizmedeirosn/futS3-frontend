import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { GameModeFullDTO } from 'src/app/models/interfaces/gamemode/response/GameModeFullDTO';
import { GameModeMinDTO } from 'src/app/models/interfaces/gamemode/response/GameModeMinDTO';
import { PlayerFullScoreDTO } from 'src/app/models/interfaces/gamemode/response/PlayerFullScoreDTO';

@Component({
  selector: 'app-players-rankings-view',
  templateUrl: './players-rankings-view.component.html',
  styleUrls: ['./players-rankings-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlayersRankingsViewComponent implements OnInit {

    @Input() public gameModes!: GameModeMinDTO[];
    @Input() public selectedGameModeFull!: GameModeFullDTO;
    @Input() public getPlayersRankingForm: any;
    @Input() public playersRanking!: PlayerFullScoreDTO[];

    @Output() public findGameModePositionsEvent: EventEmitter<{ id: number }> = new EventEmitter();
    @Output() public getPlayerRankingEvent: EventEmitter<{ gameModeId: number, positionId:number }> = new EventEmitter();

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

    public handleGetPlayersRankingEvent(): void {
        if (this.getPlayersRankingForm.value.gameModeId && this.getPlayersRankingForm.value.positionId) {
            this.getPlayerRankingEvent.emit (
                {
                    gameModeId: this.getPlayersRankingForm.value.gameModeId as number,
                    positionId: this.getPlayersRankingForm.value.positionId as number,
                }
            );
        }
    }

}
