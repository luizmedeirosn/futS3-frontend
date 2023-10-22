import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { SharedModule } from '../../shared/shared.module';
import { PlayersTableComponent } from './components/players-table/players-table.component';
import { PlayersHomeComponent } from './page/players-home/players-home.component';
import { PLAYERS_ROUTES } from './players.routing';

import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { PlayerViewComponent } from './components/player-view/player-view.component';


@NgModule({
    declarations: [
        PlayersHomeComponent,
        PlayersTableComponent,
        PlayerViewComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(PLAYERS_ROUTES),

        SharedModule,

        CardModule,
        TableModule,
        ToastModule,
    ],
})
export class PlayersHomeModule { }
