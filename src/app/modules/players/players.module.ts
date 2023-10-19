import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { SharedModule } from '../../shared/shared.module';
import { PlayersTableComponent } from './components/players-table/players-table.component';
import { PlayersHomeComponent } from './page/players-home/players-home.component';
import { PLAYERS_ROUTES } from './players.routing';

import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';


@NgModule({
  declarations: [
    PlayersHomeComponent,
    PlayersTableComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(PLAYERS_ROUTES),

    SharedModule,

    CardModule,
    TableModule,
  ]
})
export class PlayersHomeModule { }
