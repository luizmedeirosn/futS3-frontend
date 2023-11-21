import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersStatisticsHomeComponent } from './players-statistics-home.component';

describe('PlayersStatisticsHomeComponent', () => {
  let component: PlayersStatisticsHomeComponent;
  let fixture: ComponentFixture<PlayersStatisticsHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayersStatisticsHomeComponent]
    });
    fixture = TestBed.createComponent(PlayersStatisticsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
