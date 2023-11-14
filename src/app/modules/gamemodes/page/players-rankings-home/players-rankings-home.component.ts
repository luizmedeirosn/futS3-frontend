import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GameModeFullDTO } from 'src/app/models/interfaces/gamemode/response/GameModeFullDTO';
import { GameModeMinDTO } from 'src/app/models/interfaces/gamemode/response/GameModeMinDTO';
import { GameModeService } from 'src/app/services/gamemode/gamemode.service';

@Component({
  selector: 'app-players-rankings-home',
  templateUrl: './players-rankings-home.component.html',
  styleUrls: []
})
export class PlayersRankingsHomeComponent implements OnInit, OnDestroy {

    private destroy$: Subject<void> = new Subject();
    private readonly messageLife: number = 2500;

    public positionsDropdownDisabled!: boolean;
    public gameModes!: GameModeMinDTO[];
    public selectedGameModeFull!: GameModeFullDTO;

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
                                life: this.messageLife
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
                            life: this.messageLife
                        }
                    );
                    console.log(err);
                }
            }
        );

    }

    public handleFindGameModePositionsAction( $event: { id: number; } ) : void {
        this.gameModeService.findFullById ($event.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe (
            {
                next: (gameMode) => {
                    if (gameMode.fields.length > 0) {
                        this.selectedGameModeFull = gameMode;
                        this.positionsDropdownDisabled = false;
                    } else {
                        this.positionsDropdownDisabled = true;
                        this.messageService.add (
                            {
                                severity: 'info',
                                summary: 'Info',
                                detail: 'No positions registered for this game mode!',
                                life: 8000,
                            }
                        );
                    }

                },
                error: (err) => {
                    console.log(err);
                }
            }
        );
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }


}
