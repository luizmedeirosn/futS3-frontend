import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametersHomeComponent } from './parameters-home.component';

describe('ParametersHomeComponent', () => {
  let component: ParametersHomeComponent;
  let fixture: ComponentFixture<ParametersHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParametersHomeComponent]
    });
    fixture = TestBed.createComponent(ParametersHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
