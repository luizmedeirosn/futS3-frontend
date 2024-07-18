import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { PlayerViewComponent } from './components/player-view/player-view.component';
import { PlayersTableComponent } from './components/players-table/players-table.component';
import { PlayersHomeComponent } from './page/players-home/players-home.component';
import { PLAYERS_ROUTES } from './players.routing';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
  declarations: [PlayersHomeComponent, PlayersTableComponent, PlayerViewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(PLAYERS_ROUTES),

    SharedModule,

    CardModule,
    TableModule,
    ToastModule,
    ButtonModule,
    PanelModule,
    TooltipModule,
    RippleModule,
    InputTextModule,
    PaginatorModule,
  ],
})
export class PlayersHomeModule {}
