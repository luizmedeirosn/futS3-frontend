import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { PlayerFullDTO } from 'src/app/models/dto/player/response/PlayerFullDTO';
import { PlayerMinDTO } from 'src/app/models/dto/player/response/PlayerMinDTO';
import { PlayerService } from 'src/app/services/player/player.service';

@Component({
    selector: 'app-delete-players-form',
    templateUrl: './delete-player-form.component.html',
    styleUrls: ['./delete-player-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DeletePlayerFormComponent implements OnInit, OnDestroy {

    private readonly $destroy: Subject<void> = new Subject();
    private readonly toastLife: number = 2000;

    public $loadingDeletion: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public selectedPlayer!: PlayerFullDTO | undefined;
    public players!: Array<PlayerMinDTO>;

    public constructor(
        private playerService: PlayerService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
    ) { }

    public ngOnInit(): void {
        this.setPlayersWithApi();
    }

    private setPlayersWithApi(): void {
        this.playerService.findAll()
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (players) => {
                    this.players = players;
                },
                error: (err) => {
                    this.messageService.clear();
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to retrieve the data!',
                        life: this.toastLife
                    });
                    console.log(err);
                }
            });
    }

    public handleDeletePlayerEvent(event: PlayerMinDTO): void {
        if (event) {
            this.confirmationService.confirm({
                message: `Confirm the deletion of player: ${event?.name}?`,
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Yes',
                rejectLabel: 'No',
                acceptButtonStyleClass: 'p-button-danger',
                rejectButtonStyleClass: 'p-button-text',
                acceptIcon: "none",
                rejectIcon: "none",
                accept: () => this.handleDeletePlayerAction(event?.id)
            });
        }
    }

    public handleDeletePlayerAction($event: number): void {
        if ($event) {
            this.$loadingDeletion.next(true);
            this.messageService.clear();

            this.playerService.deleteById($event)
                .pipe(takeUntil(this.$destroy))
                .subscribe({
                    next: () => {
                        setTimeout(() => {
                            this.$loadingDeletion.next(false);
                            this.setPlayersWithApi();

                            this.messageService.clear();
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Player deleted successfully!'
                            });
                            this.playerService.setChangesOn(true);
                        }, 1000);
                    },
                    error: (err) => {
                        console.log(err);
                        this.messageService.clear();
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Unable to delete the player!'
                        });
                        this.playerService.setChangesOn(false);
                    }
                });
        }

    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

}
