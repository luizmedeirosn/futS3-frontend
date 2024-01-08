import { Injectable } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Injectable({
    providedIn: 'root'
})
export class CustomDialogService {

    private dynamicDialogRef!: DynamicDialogRef;

    public constructor(
        private dialogService: DialogService,
    ) {
    }

    public open(component: any, styles: any): DynamicDialogRef {
        this.dynamicDialogRef = this.dialogService.open(component, styles);
        return this.dynamicDialogRef;
    }

    public close(reload: boolean): void {
        this.dynamicDialogRef?.close();
        reload && window.location.reload();
    }

}
