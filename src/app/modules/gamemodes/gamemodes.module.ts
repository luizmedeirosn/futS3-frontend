import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GAME_MODES_ROUTES } from './gamemodes.routing';
import { GameModesHomeComponent } from './page/gamemodes-home/gamemodes-home.component';
import { GameModesTableComponent } from './components/gamemodes-table/gamemodes-table.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { GamemodeViewComponent } from './components/gamemode-view/gamemode-view.component';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { FieldsetModule } from 'primeng/fieldset';



@NgModule({
  declarations: [
    GameModesHomeComponent,
    GameModesTableComponent,
    GamemodeViewComponent,
],
  imports: [
    CommonModule,
    RouterModule.forChild(GAME_MODES_ROUTES),

    SharedModule,

    CardModule,
    TableModule,
    ToastModule,
    ButtonModule,
    TooltipModule,
    FieldsetModule,
  ]
})
export class GamemodesModule { }
