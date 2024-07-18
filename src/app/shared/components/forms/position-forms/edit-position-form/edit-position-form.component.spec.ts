import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPositionFormComponent } from './edit-position-form.component';

describe('EditPositionFormComponent', () => {
  let component: EditPositionFormComponent;
  let fixture: ComponentFixture<EditPositionFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditPositionFormComponent],
    });
    fixture = TestBed.createComponent(EditPositionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
