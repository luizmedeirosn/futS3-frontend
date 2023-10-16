import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FindAllPlayers } from 'src/app/models/interfaces/player/response/FindAllPlayers';
import { PlayerService } from 'src/app/services/player/player.service';

@Component({
  selector: 'app-players-home',
  templateUrl: './players-home.component.html',
  styleUrls: []
})
export class PlayersHomeComponent implements OnInit, OnDestroy {

    private readonly destroy$: Subject<void> = new Subject();

    public players: Array<FindAllPlayers> = [];

    constructor (
        private playerService: PlayerService
    ) {
    }

    public ngOnInit(): void {
        this.setPlayers();
    }

    private setPlayers(): void {
        this.playerService.findAllPlayers()
        .pipe(takeUntil(this.destroy$))
        .subscribe (
            {
                next: (players: FindAllPlayers[]) => {
                    if (players.length > 0) {
                        console.log(players);
                        this.players = players.slice().reverse();
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
