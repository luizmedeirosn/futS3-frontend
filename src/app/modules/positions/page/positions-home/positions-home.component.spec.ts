import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionsHomeComponent } from './positions-home.component';

describe('PositionsHomeComponent', () => {
  let component: PositionsHomeComponent;
  let fixture: ComponentFixture<PositionsHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PositionsHomeComponent]
    });
    fixture = TestBed.createComponent(PositionsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
