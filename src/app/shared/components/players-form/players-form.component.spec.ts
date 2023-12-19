import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersFormComponent } from './players-form.component';

describe('PlayersFormComponent', () => {
  let component: PlayersFormComponent;
  let fixture: ComponentFixture<PlayersFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayersFormComponent]
    });
    fixture = TestBed.createComponent(PlayersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
