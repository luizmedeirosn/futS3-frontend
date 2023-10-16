import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamemodesHomeComponent } from './gamemodes-home.component';

describe('GamemodesHomeComponent', () => {
  let component: GamemodesHomeComponent;
  let fixture: ComponentFixture<GamemodesHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GamemodesHomeComponent]
    });
    fixture = TestBed.createComponent(GamemodesHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
