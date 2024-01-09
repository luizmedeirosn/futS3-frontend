import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { FullDataPosition } from 'src/app/models/dto/position/data/FullDataPosition';
import { ViewPositionAction } from 'src/app/models/dto/position/events/ViewPositionAction';
import { PositionMinDTO } from 'src/app/models/dto/position/response/PositionMinDTO';
import { EnumPositionEventsCrud } from 'src/app/models/enums/EnumPositionEventsCrud';
import { PositionService } from 'src/app/services/position/position.service';
import { DeletePositionFormComponent } from 'src/app/shared/components/forms/position-forms/delete-position-form/delete-position-form.component';
import { EditPositionFormComponent } from 'src/app/shared/components/forms/position-forms/edit-position-form/edit-position-form.component';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog.service';

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
        private customDialogService: CustomDialogService
    ) {
    }

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

        this.positionService.getChangesOn()
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (changesOn: boolean) => {
                    if (changesOn) {
                        this.setPositionsWithApi();

                        const changedPositionId: number = this.positionService.changedPositionId;
                        changedPositionId && this.handleSelectPositionAction(changedPositionId);
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
                        this.messageService.clear();
                        this.messageService.add(
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

    private handleSelectPositionAction(id: number) {
        this.positionService.findByIdWithParameters(id)
            .pipe(takeUntil(this.$destroy))
            .subscribe(
                {
                    next: (position) => {
                        this.position = position;
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

    public handleViewFullDataPositionAction($event: ViewPositionAction): void {
        if ($event) {
            this.handleSelectPositionAction($event.id);
            this.positionService.$positionView.next(true);
        }
    }

    public handleBackAction(): void {
        this.positionService.$positionView.next(false);
    }

    public handleEditPositionEvent($event: { id: number }): void {
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
            .subscribe(() => this.handleSelectPositionAction($event.id));
    }

    public handleDeletePositionEvent($event: { id: number }): void {
        this.dynamicDialogRef = this.customDialogService.open(
            DeletePositionFormComponent,
            {
                position: 'top',
                header: EnumPositionEventsCrud.DELETE.valueOf(),
                contentStyle: { overflow: 'auto' },
                baseZIndex: 10000,
                data: {
                    $event: EnumPositionEventsCrud.DELETE,
                    selectedPositionId: $event.id
                }
            });
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

}
