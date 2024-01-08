import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'src/app/shared/shared.module';
import { GamemodeViewComponent } from './components/gamemode-view/gamemode-view.component';
import { GameModesTableComponent } from './components/gamemodes-table/gamemodes-table.component';
import { PlayersStatisticsViewComponent } from './components/players-statistics-view/players-statistics-view.component';
import { GAME_MODES_ROUTES } from './gamemodes.routing';
import { GameModesHomeComponent } from './page/gamemodes-home/gamemodes-home.component';
import { PlayersStatisticsHomeComponent } from './page/players-statistics-home/players-statistics-home.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';

import { SelectButtonModule } from 'primeng/selectbutton';
import { ChartModule } from 'primeng/chart';
import { PaginatorModule } from 'primeng/paginator';



@NgModule({
    declarations: [
        GameModesHomeComponent,
        GameModesTableComponent,
        GamemodeViewComponent,
        PlayersStatisticsHomeComponent,
        PlayersStatisticsViewComponent,
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
        ScrollPanelModule,
        DropdownModule,
        AccordionModule,
        SkeletonModule,
        FontAwesomeModule,
        SelectButtonModule,
        ChartModule,
        PaginatorModule,

    ]
})
export class GamemodesModule { }
