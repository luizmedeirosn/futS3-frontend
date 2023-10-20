import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GameModeDTO } from 'src/app/models/interfaces/gamemode/response/GameModeDTO';
import { GameModeService } from 'src/app/services/gamemode/gamemode.service';

@Component({
  selector: 'app-gamemodes-home',
  templateUrl: './gamemodes-home.component.html',
  styleUrls: []
})
export class GameModesHomeComponent implements OnInit, OnDestroy {

    private readonly destroy$: Subject<void> = new Subject();

    public gameModes: GameModeDTO[] = [];

    public constructor (
        private gameModeService: GameModeService,

        private messageService: MessageService
    ) {
    }

    public ngOnInit(): void {
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
                                detail: 'Successful search completed!',
                                life: 3000
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
                            life: 3000
                        }
                    );
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
