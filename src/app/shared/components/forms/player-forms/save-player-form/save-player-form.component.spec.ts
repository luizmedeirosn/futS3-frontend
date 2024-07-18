import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavePlayerFormComponent } from './save-player-form.component';

describe('SavePlayerFormComponent', () => {
  let component: SavePlayerFormComponent;
  let fixture: ComponentFixture<SavePlayerFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SavePlayerFormComponent],
    });
    fixture = TestBed.createComponent(SavePlayerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
