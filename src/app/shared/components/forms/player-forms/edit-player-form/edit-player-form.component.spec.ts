import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPlayerFormComponent } from './edit-player-form.component';

describe('EditPlayerFormComponent', () => {
    let component: EditPlayerFormComponent;
    let fixture: ComponentFixture<EditPlayerFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EditPlayerFormComponent]
        });
        fixture = TestBed.createComponent(EditPlayerFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
