import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ViewFullDataGameModeEvent } from 'src/app/models/interfaces/gamemode/event/ViewFullDataGameModeEvent';
import { GameModeFullDTO } from 'src/app/models/interfaces/gamemode/response/GameModeFullDTO';
import { GameModeMinDTO } from 'src/app/models/interfaces/gamemode/response/GameModeMinDTO';
import { GameModeService } from 'src/app/services/gamemode/gamemode.service';

@Component({
  selector: 'app-gamemodes-home',
  templateUrl: './gamemodes-home.component.html',
  styleUrls: []
})
export class GameModesHomeComponent implements OnInit, OnDestroy {

    private readonly destroy$: Subject<void> = new Subject();
    private readonly messageLife: number = 2500;

    public gameModes!: GameModeMinDTO[];

    public gameModeView!: boolean;
    public gameMode!: GameModeFullDTO;

    public constructor (
        private gameModeService: GameModeService,

        private messageService: MessageService
    ) {
    }

    public ngOnInit(): void {
        this.setGameModes();
        this.gameModeService.gameModeView$
        .pipe(takeUntil(this.destroy$))
        .subscribe (
            {
                next: (gameModeView) => {
                    this.gameModeView = gameModeView;
                },
                error: (err) => {
                    console.log(err);
                }
            }
        );
    }

    private setGameModes(): void {
        this.messageService.clear();
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
                                detail: 'Successful search completed!',
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

    public handleViewFullDataGameModeAction($event: ViewFullDataGameModeEvent): void {
        this.messageService.clear();
        if ($event) {
            this.gameModeService.findFullById($event.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe (
                {
                    next: (gameMode) => {
                        if (gameMode) {
                            this.gameMode = gameMode;
                            this.gameModeService.gameModeView$.next(true);
                            this.messageService.add (
                                {
                                    severity: 'success',
                                    summary: 'Success',
                                    detail: 'Access granted successfully!',
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
                                detail: 'Unable to access the game mode!',
                                life: this.messageLife
                            }
                        );
                        console.log(err);
                    }
                }
            );
        }
    }

    public handleBackAction() {
        this.gameModeService.gameModeView$.next(false);
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
