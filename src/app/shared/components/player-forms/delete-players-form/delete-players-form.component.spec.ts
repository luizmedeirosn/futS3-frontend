import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePlayersFormComponent } from './delete-players-form.component';

describe('DeletePlayersFormComponent', () => {
  let component: DeletePlayersFormComponent;
  let fixture: ComponentFixture<DeletePlayersFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeletePlayersFormComponent]
    });
    fixture = TestBed.createComponent(DeletePlayersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
