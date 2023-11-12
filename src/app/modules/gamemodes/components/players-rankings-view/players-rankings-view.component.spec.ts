import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersRankingsViewComponent } from './players-rankings-view.component';

describe('PlayersRankingsViewComponent', () => {
  let component: PlayersRankingsViewComponent;
  let fixture: ComponentFixture<PlayersRankingsViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayersRankingsViewComponent]
    });
    fixture = TestBed.createComponent(PlayersRankingsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
