import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GameModeMinDTO } from 'src/app/models/interfaces/gamemode/response/GameModeMinDTO';
import { GameModeService } from 'src/app/services/gamemode/gamemode.service';

@Component({
  selector: 'app-players-rankings-home',
  templateUrl: './players-rankings-home.component.html',
  styleUrls: []
})
export class PlayersRankingsHomeComponent implements OnInit {

    private destroy$: Subject<void> = new Subject();
    private readonly toastLife: number = 1500;

    public positionsDropdownDisabled!: boolean;
    public gameModes!: GameModeMinDTO[];

    public constructor(
        private gameModeService: GameModeService,
        private messageService: MessageService,
    ) {
    }

    public ngOnInit(): void {
        this.positionsDropdownDisabled = true;
        this.setGameModes();
    }

    private setGameModes(): void {
        this.gameModeService.findAll()
        .pipe(takeUntil(this.destroy$))
        .subscribe (
            {
                next: (gameModes) => {
                    if (gameModes.length > 0) {
                        this.gameModes = gameModes;
                        this.messageService.add (
                            {
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Data loaded successfully!',
                                life: this.toastLife
                            }
                        );
                    }
                },
                error: (err) => {
                    this.messageService.add (
                        {
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Please check your internet connection!',
                            life: this.toastLife
                        }
                    );
                    console.log(err);
                }
            }
        );

    }


}
