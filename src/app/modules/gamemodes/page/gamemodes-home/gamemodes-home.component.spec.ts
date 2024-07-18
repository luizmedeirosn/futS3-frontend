import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameModesHomeComponent } from './gamemodes-home.component';

describe('GameModesHomeComponent', () => {
  let component: GameModesHomeComponent;
  let fixture: ComponentFixture<GameModesHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameModesHomeComponent],
    });
    fixture = TestBed.createComponent(GameModesHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
