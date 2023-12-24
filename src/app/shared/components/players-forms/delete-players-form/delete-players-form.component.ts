import { Component, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { PlayerFullDTO } from 'src/app/models/dto/player/response/PlayerFullDTO';
import { PlayerMinDTO } from 'src/app/models/dto/player/response/PlayerMinDTO';
import { PlayerService } from 'src/app/services/player/player.service';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog.service';

@Component({
    selector: 'app-delete-players-form',
    templateUrl: './delete-players-form.component.html',
    styleUrls: ['./delete-players-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DeletePlayersFormComponent {

    private readonly $destroy: Subject<void> = new Subject();
    private readonly toastLife: number = 2000;

    private playersTablePages: PlayerMinDTO[][] = [];

    public $loadingDeletion: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public selectedPlayer!: PlayerFullDTO | undefined;
    public players!: PlayerMinDTO[];

    public constructor(
        private playerService: PlayerService,
        private messageService: MessageService,
        private customDialogService: CustomDialogService,
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

                    let increment: number = 0;
                    let page: Array<PlayerMinDTO> = new Array();

                    players.forEach((player, index, array) => {
                        page.push(player);
                        increment += 1;
                        if (increment === 5 || index === array.length - 1) {
                            this.playersTablePages.push(page);
                            page = new Array();
                            increment = 0;
                        }
                    });
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

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

    public handleDeletePlayerAction($event: number): void {
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
                    }, 1000);
                    this.customDialogService.setChangesOn(true);
                },
                error: (err) => {
                    console.log(err);
                    this.messageService.clear();
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Unable to delete the player!'
                    });
                    this.customDialogService.setChangesOn(false);
                }
            });
    }

}
