import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { FullDataPosition } from 'src/app/models/dto/position/data/FullDataPosition';
import { EditOrDeletePositionAction } from 'src/app/models/events/EditOrDeletePositionAction';
import { PositionMinDTO } from 'src/app/models/dto/position/response/PositionMinDTO';
import { EnumPositionEventsCrud } from 'src/app/models/enums/EnumPositionEventsCrud';
import { PositionService } from 'src/app/services/position/position.service';
import { EditPositionFormComponent } from 'src/app/shared/components/forms/position-forms/edit-position-form/edit-position-form.component';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog/custom-dialog.service';
import { ChangesOnService } from '../../../../shared/services/changes-on/changes-on.service';
import { ViewAction } from 'src/app/models/events/ViewAction';

@Component({
    selector: 'app-positions-home',
    templateUrl: './positions-home.component.html',
    styleUrls: []
})
export class PositionsHomeComponent implements OnInit, OnDestroy {

    private readonly $destroy: Subject<void> = new Subject();
    private readonly messageLife: number = 3000;

    public positions!: PositionMinDTO[];

    public positionView!: boolean;
    public position!: FullDataPosition;

    private dynamicDialogRef!: DynamicDialogRef;

    public constructor(
        private positionService: PositionService,
        private messageService: MessageService,
        private customDialogService: CustomDialogService,
        private confirmationService: ConfirmationService,
        private changesOnService: ChangesOnService,
    ) { }

    public ngOnInit(): void {
        this.setPositionsWithApi();

        this.positionService.$positionView
            .pipe(takeUntil(this.$destroy))
            .subscribe(
                {
                    next: (positionView) => {
                        this.positionView = positionView;
                    },
                    error: (err) => {
                        console.log(err);
                    }
                }
            );

        this.changesOnService.getChangesOn()
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (changesOn: boolean) => {
                    if (changesOn) {
                        this.setPositionsWithApi();

                        const changedPositionId: number | undefined = this.positionService.changedPositionId;
                        changedPositionId ? this.selectPosition(changedPositionId) : this.handleBackAction();
                    }
                },
                error: (err) => {
                    console.log(err);
                }
            });
    }

    private setPositionsWithApi(): void {
        this.positionService.findAll()
            .pipe(takeUntil(this.$destroy))
            .subscribe(
                {
                    next: (positions) => {
                        this.positions = positions;
                    },
                    error: (err) => {
                        err.status != 403 && this.messageService.add(
                            {
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Unexpected error!',
                                life: this.messageLife
                            }
                        );
                        console.log(err);
                    }
                }
            );
    }

    private selectPosition(id: number) {
        id && this.positionService.findByIdWithParameters(id)
            .pipe(takeUntil(this.$destroy))
            .subscribe(
                {
                    next: (position) => {
                        position && (this.position = position);
                        this.positionService.changedPositionId = id;
                    },
                    error: (err) => {
                        this.messageService.clear();
                        this.messageService.add(
                            {
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Unable to access the position!',
                                life: this.messageLife
                            }
                        );
                        console.log(err);
                    }
                }
            );
    }

    public handleViewFullDataPositionAction($event: ViewAction): void {
        if ($event) {
            this.selectPosition($event.id);
            this.positionService.$positionView.next(true);
        }
    }

    public handleBackAction(): void {
        this.positionService.$positionView.next(false);
    }

    private deletePosition(id: number): void {
        id && this.positionService.deleteById(id)
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: () => {
                    this.messageService.clear();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Position deleted successfully!',
                        life: 2000
                    });

                    this.positionService.changedPositionId = undefined;
                    this.changesOnService.setChangesOn(true);

                    this.handleBackAction();
                },
                error: (err) => {
                    console.log(err);
                    this.messageService.clear();
                    this.messageService.add({
                        key: 'deletion-error',
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Is the position part of a game mode or a player!',
                        life: 6000
                    });

                    this.changesOnService.setChangesOn(false);
                }
            });
    }

    private deletePositionConfirmation(): void {
        this.position && this.confirmationService.confirm({
            message: `Confirm the deletion of position: ${this.position.name}?`,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes',
            rejectLabel: 'No',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-text',
            acceptIcon: "none",
            rejectIcon: "none",
            accept: () => this.deletePosition(this.position.id)
        });
    }

    public handleEditOrDeletePositionEvent($event: EditOrDeletePositionAction): void {
        if ($event && $event.action === EnumPositionEventsCrud.EDIT) {
            this.dynamicDialogRef = this.customDialogService.open(
                EditPositionFormComponent,
                {
                    position: 'top',
                    header: EnumPositionEventsCrud.EDIT.valueOf(),
                    contentStyle: { overflow: 'auto' },
                    baseZIndex: 10000,
                    data: {
                        $event: EnumPositionEventsCrud.EDIT,
                        selectedPositionId: $event.id
                    }
                });

            this.dynamicDialogRef.onClose
                .pipe(takeUntil(this.$destroy))
                .subscribe(() => this.selectPosition($event.id));
        }

        $event && $event.action === EnumPositionEventsCrud.DELETE && this.deletePositionConfirmation();
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

}
