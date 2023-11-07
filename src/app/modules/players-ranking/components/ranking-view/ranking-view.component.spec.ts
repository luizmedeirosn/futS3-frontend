import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingViewComponent } from './ranking-view.component';

describe('RankingViewComponent', () => {
  let component: RankingViewComponent;
  let fixture: ComponentFixture<RankingViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RankingViewComponent]
    });
    fixture = TestBed.createComponent(RankingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
