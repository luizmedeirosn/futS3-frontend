import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChangesOnService {
  private readonly $changesOn: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public setChangesOn(status: boolean): void {
    if (status !== null && status !== undefined) {
      this.$changesOn.next(true);
    } else {
      console.error('Status is null or undefined');
    }
  }

  public getChangesOn(): BehaviorSubject<boolean> {
    return this.$changesOn;
  }
}
