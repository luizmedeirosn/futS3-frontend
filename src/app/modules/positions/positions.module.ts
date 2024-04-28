import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'src/app/shared/shared.module';
import { PositionsHomeComponent } from './page/positions-home/positions-home.component';
import { POSITIONS_ROUTES } from './positions.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TableModule } from 'primeng/table';
import { PositionViewComponent } from './components/position-view/position-view.component';
import { PositionsTableComponent } from './components/positions-table/positions-table.component';
import {RippleModule} from "primeng/ripple";
import {TooltipModule} from "primeng/tooltip";

@NgModule({
    declarations: [
        PositionsHomeComponent,
        PositionsTableComponent,
        PositionViewComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(POSITIONS_ROUTES),
        FormsModule,
        ReactiveFormsModule,

        SharedModule,

        CardModule,
        TableModule,
        PanelModule,
        ScrollPanelModule,
        ButtonModule,
        RippleModule,
        TooltipModule,
    ],
})
export class PositionsModule { }
