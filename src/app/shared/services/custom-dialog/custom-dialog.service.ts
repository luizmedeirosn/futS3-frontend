import { Injectable } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { take } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CustomDialogService {

    private dynamicDialogRefs: Array<DynamicDialogRef> = new Array();

    public constructor(
        private dialogService: DialogService,
    ) {
    }

    public open(component: any, styles: any): DynamicDialogRef {
        const ref: DynamicDialogRef = this.dialogService.open(component, styles);

        this.dynamicDialogRefs.length > 0 && ref.onClose.pipe(take(1)).subscribe(() => this.closeEndDialog(false));

        this.dynamicDialogRefs.push(ref);
        return ref;
    }

    public closeEndDialog(reload: boolean): void {
        const ref: DynamicDialogRef | undefined = this.dynamicDialogRefs.pop();
        ref?.close();
        reload && window.location.reload();
    }

    public closeAll(reload: boolean): void {
        this.dynamicDialogRefs?.forEach(ref => ref.close());
        reload && window.location.reload();
    }

}
