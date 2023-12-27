import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteParameterFormComponent } from './delete-parameter-form.component';

describe('DeleteParameterFormComponent', () => {
  let component: DeleteParameterFormComponent;
  let fixture: ComponentFixture<DeleteParameterFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteParameterFormComponent]
    });
    fixture = TestBed.createComponent(DeleteParameterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
