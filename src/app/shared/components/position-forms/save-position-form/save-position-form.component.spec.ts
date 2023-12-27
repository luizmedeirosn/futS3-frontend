import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavePositionFormComponent } from './save-position-form.component';

describe('SavePositionFormComponent', () => {
  let component: SavePositionFormComponent;
  let fixture: ComponentFixture<SavePositionFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SavePositionFormComponent]
    });
    fixture = TestBed.createComponent(SavePositionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
