import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveGamemodeFormComponent } from './save-gamemode-form.component';

describe('SaveGamemodeFormComponent', () => {
  let component: SaveGamemodeFormComponent;
  let fixture: ComponentFixture<SaveGamemodeFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaveGamemodeFormComponent],
    });
    fixture = TestBed.createComponent(SaveGamemodeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
