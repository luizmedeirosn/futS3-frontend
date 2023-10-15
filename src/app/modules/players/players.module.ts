import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayersHomeComponent } from './page/players-home/players-home.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { PLAYERS_ROUTES } from './players.routing';



@NgModule({
  declarations: [
    PlayersHomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(PLAYERS_ROUTES),

    SharedModule
  ]
})
export class PlayersHomeModule { }
