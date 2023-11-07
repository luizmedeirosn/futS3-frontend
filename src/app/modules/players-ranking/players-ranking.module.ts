import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayersRankingHomeComponent } from './page/players-ranking-home/players-ranking-home.component';
import { RouterModule } from '@angular/router';
import { PLAYERS_RANKING_ROUTES } from './players-ranking.routing';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    PlayersRankingHomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(PLAYERS_RANKING_ROUTES),

    SharedModule,
  ]
})
export class PlayersRankingModule { }
