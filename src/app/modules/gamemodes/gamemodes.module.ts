import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GAME_MODES_ROUTES } from './gamemodes.routing';
import { GameModesHomeComponent } from './page/gamemodes-home/gamemodes-home.component';



@NgModule({
  declarations: [
    GameModesHomeComponent,
],
  imports: [
    CommonModule,
    RouterModule.forChild(GAME_MODES_ROUTES)
  ]
})
export class GamemodesModule { }
