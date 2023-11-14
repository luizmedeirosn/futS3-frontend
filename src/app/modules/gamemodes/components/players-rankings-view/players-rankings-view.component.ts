import { GameModeFullDTO } from 'src/app/models/interfaces/gamemode/response/GameModeFullDTO';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { GameModeMinDTO } from 'src/app/models/interfaces/gamemode/response/GameModeMinDTO';

@Component({
  selector: 'app-players-rankings-view',
  templateUrl: './players-rankings-view.component.html',
  styleUrls: ['./players-rankings-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlayersRankingsViewComponent implements OnInit {

    @Input()
    public gameModes!: GameModeMinDTO[];
    @Input()
    public positionsDropdownDisabled!: boolean;
    @Output()
    public findGameModePositionsEvent: EventEmitter<{id: number}> = new EventEmitter();
    @Input()
    public selectedGameModeFull!: GameModeFullDTO;

    public selectedGameMode!: GameModeMinDTO;
    public playersRankingForm: any = this.formBuilder.group (
        {
            gameModeId: ['', Validators.required],
            positionid: ['', Validators.required],
        }
    );

    public constructor (
        private formBuilder: FormBuilder,
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
        if ($event && this.playersRankingForm.value.gameModeId) {
            this.findGameModePositionsEvent.emit (
                {
                    id: this.gameModes.at( ($event.value as number) -1 )?.id as number,
                }
            );
        } else {
            this.positionsDropdownDisabled = true;
        }

    }

}
