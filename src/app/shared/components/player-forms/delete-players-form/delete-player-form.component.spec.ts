import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePlayerFormComponent } from './delete-player-form.component';

describe('DeletePlayerFormComponent', () => {
    let component: DeletePlayerFormComponent;
    let fixture: ComponentFixture<DeletePlayerFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DeletePlayerFormComponent]
        });
        fixture = TestBed.createComponent(DeletePlayerFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
