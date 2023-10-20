import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { PlayerMinDTO } from 'src/app/models/interfaces/player/response/PlayerMinDTO';
import { PlayerService } from 'src/app/services/player/player.service';

@Component({
  selector: 'app-players-home',
  templateUrl: './players-home.component.html',
  styleUrls: []
})
export class PlayersHomeComponent implements OnInit, OnDestroy {

    private readonly destroy$: Subject<void> = new Subject();
    private readonly toastLife: number = 2500;

    public players: Array<PlayerMinDTO> = [];

    public constructor (
        private playerService: PlayerService,

        private messageService: MessageService
    ) {
    }

    public ngOnInit(): void {
        this.setPlayers();
    }

    private setPlayers(): void {
        this.playerService.findAll()
        .pipe(takeUntil(this.destroy$))
        .subscribe (
            {
                next: (players: PlayerMinDTO[]) => {
                    if (players.length > 0) {
                        console.log(players);
                        this.players = players.slice().reverse();
                        this.messageService.add (
                            {
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Successful search completed!',
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

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
