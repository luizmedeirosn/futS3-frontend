import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveParameterFormComponent } from './save-parameter-form.component';

describe('SaveParameterFormComponent', () => {
  let component: SaveParameterFormComponent;
  let fixture: ComponentFixture<SaveParameterFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaveParameterFormComponent],
    });
    fixture = TestBed.createComponent(SaveParameterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
