import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersRankingHomeComponent } from './players-ranking-home.component';

describe('PlayersRankingHomeComponent', () => {
  let component: PlayersRankingHomeComponent;
  let fixture: ComponentFixture<PlayersRankingHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayersRankingHomeComponent]
    });
    fixture = TestBed.createComponent(PlayersRankingHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
