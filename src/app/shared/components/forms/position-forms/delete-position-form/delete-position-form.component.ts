import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { PositionMinDTO } from 'src/app/models/dto/position/response/PositionMinDTO';
import { PositionService } from 'src/app/services/position/position.service';

@Component({
    selector: 'app-delete-position-form',
    templateUrl: './delete-position-form.component.html',
    styleUrls: ['./delete-position-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DeletePositionFormComponent implements OnInit, OnDestroy {

    private readonly $destroy: Subject<void> = new Subject();
    private readonly toastLife: number = 2000;

    public $loadingDeletion: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public positions!: Array<PositionMinDTO>;

    public constructor(
        private positionService: PositionService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
    ) { }

    public ngOnInit(): void {
        this.setPositionsWithApi();
    }

    private setPositionsWithApi(): void {
        this.positionService.findAll()
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (positions) => {
                    this.positions = positions;
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

    public handleDeletePositionEvent($event: PositionMinDTO): void {
        if ($event) {
            this.confirmationService.confirm({
                message: `Confirm the deletion of position: ${$event?.name}?`,
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Yes',
                rejectLabel: 'No',
                acceptButtonStyleClass: 'p-button-danger',
                rejectButtonStyleClass: 'p-button-text',
                acceptIcon: "none",
                rejectIcon: "none",
                accept: () => this.handleDeletePositionAction($event?.id)
            });
        }
    }

    public handleDeletePositionAction($event: number): void {
        if ($event) {
            this.$loadingDeletion.next(true);
            this.messageService.clear();

            this.positionService.deleteById($event)
                .pipe(takeUntil(this.$destroy))
                .subscribe({
                    next: () => {
                        setTimeout(() => {
                            this.$loadingDeletion.next(false);
                            this.setPositionsWithApi();

                            this.messageService.clear();
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Position deleted successfully!',
                                life: this.toastLife
                            });
                            this.positionService.setChangesOn(true);
                        }, 1000);
                    },
                    error: (err) => {
                        setTimeout(() => {
                            console.log(err);
                            this.positionService.setChangesOn(false);
                            this.messageService.clear();
                            this.messageService.add({
                                key: 'deletion-error',
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Is the position part of a game mode or a player!',
                                life: 6000
                            });
                            this.$loadingDeletion.next(false);
                        }, 1000);
                    }
                });
        }
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

}
