import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';

import { MenubarNavigationComponent } from './components/menubar-navigation/menubar-navigation.component';
import { ShortenPipe } from './pipes/shorten.pipe';



@NgModule({
  declarations: [
    MenubarNavigationComponent,
    ShortenPipe
  ],
  imports: [
    CommonModule,

    MenubarModule,
    ButtonModule
  ],
  exports: [MenubarNavigationComponent , ShortenPipe]
})
export class SharedModule { }
