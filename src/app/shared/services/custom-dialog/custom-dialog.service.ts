import {Injectable, OnDestroy} from '@angular/core';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {Subject, takeUntil} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CustomDialogService implements OnDestroy {

    private readonly $destroy: Subject<void> = new Subject();
    private dynamicDialogRefs: Array<DynamicDialogRef> = [];

    public constructor(
        private dialogService: DialogService,
    ) { }

    public open(component: any, styles: any): DynamicDialogRef {
        const ref: DynamicDialogRef = this.dialogService.open(component, styles);

        ref.onClose
            .pipe(takeUntil(this.$destroy))
            .subscribe(
                () => this.dynamicDialogRefs.includes(ref) && this.dynamicDialogRefs.pop());

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

    public ngOnDestroy() {
        this.$destroy.next();
        this.$destroy.complete();
    }
}
