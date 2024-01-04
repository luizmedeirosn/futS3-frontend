import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditParameterFormComponent } from './edit-parameter-form.component';

describe('EditParameterFormComponent', () => {
    let component: EditParameterFormComponent;
    let fixture: ComponentFixture<EditParameterFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EditParameterFormComponent]
        });
        fixture = TestBed.createComponent(EditParameterFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
