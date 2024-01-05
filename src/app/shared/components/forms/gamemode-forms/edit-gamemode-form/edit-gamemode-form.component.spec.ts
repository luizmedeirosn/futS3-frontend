import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGamemodeFormComponent } from './edit-gamemode-form.component';

describe('EditGamemodeFormComponent', () => {
    let component: EditGamemodeFormComponent;
    let fixture: ComponentFixture<EditGamemodeFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EditGamemodeFormComponent]
        });
        fixture = TestBed.createComponent(EditGamemodeFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
