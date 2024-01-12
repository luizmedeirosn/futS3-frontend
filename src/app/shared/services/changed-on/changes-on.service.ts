import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { ChangesOn } from 'src/app/models/events/ChangesOn';

@Injectable({
    providedIn: 'root'
})
export class ChangesOnService implements OnDestroy {

    private readonly $destroy: Subject<void> = new Subject();
    private readonly $changesOn: Subject<ChangesOn> = new Subject();

    public setChangesOn(status: boolean, changedPositionId?: number): void {
        if (status !== null && status !== undefined) {
            this.$changesOn.next({
                status,
                entityId: changedPositionId
            });
        } else {
            console.error("Status is null or undefined");
        }
    }

    public getChangesOn(): Subject<ChangesOn> {
        return this.$changesOn;
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

}
