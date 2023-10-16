import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { SharedModule } from '../../shared/shared.module';
import { PlayersTableComponent } from './components/players-table/players-table.component';
import { PlayersHomeComponent } from './page/players-home/players-home.component';
import { PLAYERS_ROUTES } from './players.routing';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PlayersHomeComponent,
    PlayersTableComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(PLAYERS_ROUTES),
    FormsModule,

    CardModule,
    TableModule,

    SharedModule
  ]
})
export class PlayersHomeModule { }
