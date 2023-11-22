import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ViewFullDataPlayerEvent } from 'src/app/models/interfaces/player/events/ViewFullDataPlayerEvent';
import { PlayerFullDTO } from 'src/app/models/interfaces/player/response/PlayerFullDTO';
import { PlayerMinDTO } from 'src/app/models/interfaces/player/response/PlayerMinDTO';
import { PlayerService } from 'src/app/services/player/player.service';

@Component({
  selector: 'app-players-home',
  templateUrl: './players-home.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})
export class PlayersHomeComponent implements OnInit, OnDestroy {

    private readonly destroy$: Subject<void> = new Subject();
    private readonly messageLife: number = 2500;

    public players!: Array<PlayerMinDTO>;
    public player!: PlayerFullDTO;

    public playerView!: boolean;

    public constructor (
        private playerService: PlayerService,

        private messageService: MessageService,
    ) {
    }

    public ngOnInit(): void {
        this.setPlayers();
        this.playerService.playerView$
        .pipe(takeUntil(this.destroy$))
        .subscribe (
            {
                next: (playerView) => {
                    this.playerView = playerView;
                },
                error: (err) => {
                    console.log(err);
                }
            }
        );
    }

    private setPlayers(): void {
        this.messageService.clear();
        this.playerService.findAll()
        .pipe(takeUntil(this.destroy$))
        .subscribe (
            {
                next: (players: PlayerMinDTO[]) => {
                    if (players.length > 0) {
                        this.players = players.slice().reverse();
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

    public handleViewFullDataPlayerAction($event: ViewFullDataPlayerEvent): void {
        this.messageService.clear();
        if ($event) {
            this.playerService.findFullById($event.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                {
                    next: (player) => {
                        if (player) {
                            this.player = player;
                            this.playerService.playerView$.next(true);
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
                                detail: 'Unable to access the player!',
                                life: this.messageLife
                            }
                        );
                        console.log(err);
                    }
                }
            );
        }
    }

    public handleBackAction(): void {
        this.playerService.playerView$.next(false);
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
