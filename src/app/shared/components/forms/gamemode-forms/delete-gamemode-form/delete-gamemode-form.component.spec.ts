import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteGamemodeFormComponent } from './delete-gamemode-form.component';

describe('DeleteGamemodeFormComponent', () => {
  let component: DeleteGamemodeFormComponent;
  let fixture: ComponentFixture<DeleteGamemodeFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteGamemodeFormComponent],
    });
    fixture = TestBed.createComponent(DeleteGamemodeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
