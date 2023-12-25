import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Injectable({
    providedIn: 'root'
})
export class CustomDialogService {

    private dynamicDialogRef!: DynamicDialogRef;
    private changesOn: boolean = false;

    public constructor(
        private dialogService: DialogService,
        private confirmationService: ConfirmationService
    ) {
    }

    public open(component: any, styles: any): DynamicDialogRef {
        if (this.dynamicDialogRef) {
            this.dynamicDialogRef.destroy();
        }
        this.dynamicDialogRef = this.dialogService.open(component, styles);
        return this.dynamicDialogRef;
    }

    public close(): void {
        if (this.dynamicDialogRef) {
            this.dynamicDialogRef.close();
        }
        this.changesOn && window.location.reload();
    }

    public setChangesOn(status: boolean) {
        if (status !== null && status !== undefined) {
            this.changesOn = status;
        }
    }

    public getChangesOn(): boolean {
        return this.changesOn;
    }

    public openConfirmationDialog() {
        this.confirmationService.confirm({
            message: `Confirm the deletion of player:`,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes',
            rejectLabel: 'No',
            accept: () => console.log('ok')
        });
    }

}
