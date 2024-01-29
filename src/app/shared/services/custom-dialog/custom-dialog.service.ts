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
    ) { }

    public open(component: any, styles: any): DynamicDialogRef {
        const ref: DynamicDialogRef = this.dialogService.open(component, styles);

        ref.onClose.pipe(take(1)).subscribe(() => this.dynamicDialogRefs.includes(ref) && this.dynamicDialogRefs.pop());

        this.dynamicDialogRefs.push(ref);
        return ref;
    }

    public closeEndDialog(): void {
        const ref: DynamicDialogRef | undefined = this.dynamicDialogRefs.pop();
        ref?.close();
    }

    public closeAll(): void {
        this.dynamicDialogRefs?.forEach(ref => ref.close());
    }

}
