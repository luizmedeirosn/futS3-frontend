import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { GameModeMinDTO } from 'src/app/models/dto/gamemode/response/GameModeMinDTO';
import { GameModeService } from 'src/app/services/gamemode/gamemode.service';
import { ChangesOnService } from 'src/app/shared/services/changes-on/changes-on.service';
import Page from "../../../../../models/dto/generics/response/Page";

@Component({
    selector: 'app-delete-gamemode-form',
    templateUrl: './delete-gamemode-form.component.html',
    styleUrls: ['./delete-gamemode-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DeleteGamemodeFormComponent implements OnInit, OnDestroy {

    private readonly $destroy: Subject<void> = new Subject();
    private readonly toastLife: number = 2000;

    public $loadingDeletion: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public gameModes!: GameModeMinDTO[];

    public constructor(
        private gameModeService: GameModeService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private changesOnService: ChangesOnService,
    ) { }

    public ngOnInit(): void {
        this.setGameModesWithApi();
    }

    private setGameModesWithApi(): void {
        this.gameModeService.findAll()
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (gameModesPage: Page<GameModeMinDTO>) => {
                    this.gameModes = gameModesPage.content;
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

    public handleDeleteGameModeEvent($event: GameModeMinDTO): void {
        if ($event) {
            this.confirmationService.confirm({
                message: `Confirm the deletion of game mode: ${$event?.formationName}?`,
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Yes',
                rejectLabel: 'No',
                acceptButtonStyleClass: 'p-button-danger',
                rejectButtonStyleClass: 'p-button-text',
                acceptIcon: "none",
                rejectIcon: "none",
                accept: () => this.handleDeleteGameModeAction($event?.id)
            });
        }
    }

    public handleDeleteGameModeAction($event: number): void {
        if ($event) {
            this.$loadingDeletion.next(true);
            this.messageService.clear();

            this.gameModeService.deleteById($event)
                .pipe(takeUntil(this.$destroy))
                .subscribe({
                    next: () => {
                        setTimeout(() => {
                            this.$loadingDeletion.next(false);
                            this.setGameModesWithApi();

                            this.messageService.clear();
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Game mode deleted successfully!',
                                life: this.toastLife
                            });

                            this.gameModeService.gameModeIdInPreview = undefined;
                            this.changesOnService.setChangesOn(true);
                        }, 1000);
                    },
                    error: (err) => {
                        console.log(err);
                        this.messageService.clear();
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Unable to delete the game mode!',
                            life: 6000
                        });
                        this.changesOnService.setChangesOn(false);
                    }
                });
        }

    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

}
