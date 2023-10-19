import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionsTableComponent } from './positions-table.component';

describe('PositionsTableComponent', () => {
  let component: PositionsTableComponent;
  let fixture: ComponentFixture<PositionsTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PositionsTableComponent]
    });
    fixture = TestBed.createComponent(PositionsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
