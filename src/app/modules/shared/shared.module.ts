import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';

import { MenubarNavigationComponent } from './components/menubar-navigation/menubar-navigation.component';



@NgModule({
  declarations: [
    MenubarNavigationComponent
  ],
  imports: [
    CommonModule,

    MenubarModule,
    ButtonModule
  ],
  exports: [MenubarNavigationComponent]
})
export class SharedModule { }
