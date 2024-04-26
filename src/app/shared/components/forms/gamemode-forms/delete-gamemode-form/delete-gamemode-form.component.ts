import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {BehaviorSubject, Subject, takeUntil} from 'rxjs';
import {GameModeMinDTO} from 'src/app/models/dto/gamemode/response/GameModeMinDTO';
import {GameModeService} from 'src/app/services/gamemode/gamemode.service';
import {ChangesOnService} from 'src/app/shared/services/changes-on/changes-on.service';
import Page from "../../../../../models/dto/generics/response/Page";
import Pageable from "../../../../../models/dto/generics/request/Pageable";
import PageMin from "../../../../../models/dto/generics/response/PageMin";
import {TableLazyLoadEvent} from "primeng/table";

@Component({
    selector: 'app-delete-gamemode-form',
    templateUrl: './delete-gamemode-form.component.html',
    styleUrls: ['./delete-gamemode-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DeleteGamemodeFormComponent implements OnInit, OnDestroy {

    private readonly $destroy: Subject<void> = new Subject();
    private readonly toastLife: number = 2000;

    public pageable!: Pageable;
    public $loading!: BehaviorSubject<boolean>;
    public page!: PageMin<GameModeMinDTO>;

    public constructor(
        private gameModeService: GameModeService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private changesOnService: ChangesOnService,
    ) {
        this.pageable = new Pageable('', 0, 10, "name", 1);
        this.$loading = new BehaviorSubject(false);
        this.page = {
            content: [],
            pageNumber: 0,
            pageSize: 10,
            totalElements: 0
        };
    }

    public ngOnInit(): void {
        this.page.totalElements === 0 && this.setGameModesWithApi(this.pageable);
    }

    private setGameModesWithApi(pageable: Pageable): void {
        this.pageable = pageable;

        this.$loading.next(true);

        setTimeout(() => {
            this.gameModeService.findAll(pageable)
                .pipe(takeUntil(this.$destroy))
                .subscribe({
                    next: (gameModesPage: Page<GameModeMinDTO>) => {
                        this.page.content = gameModesPage.content;
                        this.page.pageNumber = gameModesPage.pageable.pageNumber;
                        this.page.pageSize = gameModesPage.pageable.pageSize;
                        this.page.totalElements = gameModesPage.totalElements;

                        this.$loading.next(true);
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

                        this.$loading.next(true);
                    }
                });
            }, 500);
    }

    public handleChangePageAction($event: TableLazyLoadEvent) {
        if ($event && $event.first !== undefined && $event.rows) {
            const pageNumber = Math.ceil($event.first / $event.rows);
            const pageSize = $event.rows !== 0 ? $event.rows : 10;

            this.setGameModesWithApi(new Pageable(this.pageable.keyword, pageNumber, pageSize));
        }
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
            this.messageService.clear();

            this.$loading.next(true);

            setTimeout(() => {
                this.gameModeService.deleteById($event)
                    .pipe(takeUntil(this.$destroy))
                    .subscribe({
                        next: () => {
                            this.setGameModesWithApi(this.pageable);

                            this.messageService.clear();
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Game mode deleted successfully!',
                                life: this.toastLife
                            });

                            this.gameModeService.gameModeIdInPreview = undefined;
                            this.changesOnService.setChangesOn(true);

                            this.$loading.next(true);
                        },
                        error: (err) => {
                            this.messageService.clear();
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Unable to delete the game mode!',
                                life: this.toastLife
                            });

                            console.log(err);

                            this.changesOnService.setChangesOn(false);

                            this.$loading.next(true);
                        }
                    });
            }, 500);
        }

    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }
}
