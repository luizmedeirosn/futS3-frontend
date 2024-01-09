import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamemodeViewComponent } from './gamemode-view.component';

describe('GamemodeViewComponent', () => {
    let component: GamemodeViewComponent;
    let fixture: ComponentFixture<GamemodeViewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [GamemodeViewComponent]
        });
        fixture = TestBed.createComponent(GamemodeViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
