import { Injectable } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Injectable({
    providedIn: 'root'
})
export class CustomDialogService {

    private dynamicDialogRef!: DynamicDialogRef;
    private changesOn: boolean = false;

    public constructor(
        private dialogService: DialogService,
    ) {
    }

    public open(component: any, styles: any): DynamicDialogRef {
        this.dynamicDialogRef?.destroy();
        this.dynamicDialogRef = this.dialogService.open(component, styles);
        return this.dynamicDialogRef;
    }

    public close(): void {
        this.dynamicDialogRef?.close();
        this.changesOn && window.location.reload();
    }

    public setChangesOn(status: boolean) {
        this.changesOn = status ?? console.error("Status is null or undefined");
    }

    public getChangesOn(): boolean {
        return this.changesOn;
    }

}
