import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'src/app/shared/shared.module';
import { GamemodeViewComponent } from './components/gamemode-view/gamemode-view.component';
import { GameModesTableComponent } from './components/gamemodes-table/gamemodes-table.component';
import { PlayersRankingsViewComponent } from './components/players-rankings-view/players-rankings-view.component';
import { GAME_MODES_ROUTES } from './gamemodes.routing';
import { GameModesHomeComponent } from './page/gamemodes-home/gamemodes-home.component';
import { PlayersRankingsHomeComponent } from './page/players-rankings-home/players-rankings-home.component';

import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';


@NgModule({
  declarations: [
    GameModesHomeComponent,
    GameModesTableComponent,
    GamemodeViewComponent,
    PlayersRankingsHomeComponent,
    PlayersRankingsViewComponent,
],
  imports: [
    CommonModule,
    RouterModule.forChild(GAME_MODES_ROUTES),
    FormsModule,
    ReactiveFormsModule,

    SharedModule,

    CardModule,
    TableModule,
    ToastModule,
    ButtonModule,
    TooltipModule,
    FieldsetModule,
    DropdownModule,
    AccordionModule,
    SkeletonModule,
  ],
})
export class GamemodesModule { }
