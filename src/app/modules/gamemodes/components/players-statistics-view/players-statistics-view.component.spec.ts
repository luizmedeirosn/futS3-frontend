import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersStatisticsViewComponent } from './players-statistics-view.component';

describe('PlayersStatisticsViewComponent', () => {
  let component: PlayersStatisticsViewComponent;
  let fixture: ComponentFixture<PlayersStatisticsViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayersStatisticsViewComponent]
    });
    fixture = TestBed.createComponent(PlayersStatisticsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
