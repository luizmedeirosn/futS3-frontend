import { Component, EventEmitter, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { GameModeMinDTO } from 'src/app/models/interfaces/gamemode/response/GameModeMinDTO';

@Component({
  selector: 'app-players-rankings-view',
  templateUrl: './players-rankings-view.component.html',
  styleUrls: ['./players-rankings-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlayersRankingsViewComponent {

    @Input()
    public gameModes!: GameModeMinDTO[];

    @Input()
    public positionsDropdownDisabled!: boolean;

    public selectedGameMode!: GameModeMinDTO;
    public findGameModePositionsEvent: EventEmitter<{id: number}> = new EventEmitter();
    public playersRankingForm: any = this.formBuilder.group (
        {
            gameModeId: ['', Validators.required],
            positionid: ['', Validators.required],
        }
    );

    public constructor (
        private formBuilder: FormBuilder,
        private messageService: MessageService,
    ) {
    }

    public handleFindGameModePositionsEvent(event$: DropdownChangeEvent): void {
        this.playersRankingForm.value.gameModeId.valid &&
        this.findGameModePositionsEvent.emit (
            {
                id: this.playersRankingForm.value.id as number,
            }
        );
    }

}
