import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameModesTableComponent } from './gamemodes-table.component';

describe('GameModesTableComponent', () => {
    let component: GameModesTableComponent;
    let fixture: ComponentFixture<GameModesTableComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [GameModesTableComponent]
        });
        fixture = TestBed.createComponent(GameModesTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
