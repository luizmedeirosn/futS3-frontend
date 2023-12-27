import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePositionFormComponent } from './delete-position-form.component';

describe('DeletePositionFormComponent', () => {
  let component: DeletePositionFormComponent;
  let fixture: ComponentFixture<DeletePositionFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeletePositionFormComponent]
    });
    fixture = TestBed.createComponent(DeletePositionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
