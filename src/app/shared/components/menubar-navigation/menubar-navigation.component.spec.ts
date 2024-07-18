import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenubarNavigationComponent } from './menubar-navigation.component';

describe('MenubarNavigationComponent', () => {
  let component: MenubarNavigationComponent;
  let fixture: ComponentFixture<MenubarNavigationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenubarNavigationComponent],
    });
    fixture = TestBed.createComponent(MenubarNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
