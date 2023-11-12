import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersRankingsHomeComponent } from './players-rankings-home.component';

describe('PlayersRankingsHomeComponent', () => {
  let component: PlayersRankingsHomeComponent;
  let fixture: ComponentFixture<PlayersRankingsHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayersRankingsHomeComponent]
    });
    fixture = TestBed.createComponent(PlayersRankingsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
