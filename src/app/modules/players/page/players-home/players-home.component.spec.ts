import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersHomeComponent } from './players-home.component';

describe('PlayersHomeComponent', () => {
  let component: PlayersHomeComponent;
  let fixture: ComponentFixture<PlayersHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayersHomeComponent]
    });
    fixture = TestBed.createComponent(PlayersHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
