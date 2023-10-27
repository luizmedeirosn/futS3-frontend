import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { POSITIONS_ROUTES } from './positions.routing';
import { PositionsHomeComponent } from './page/positions-home/positions-home.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { PositionsTableComponent } from './components/positions-table/positions-table.component';
import { PositionViewComponent } from './components/position-view/position-view.component';



@NgModule({
  declarations: [
    PositionsHomeComponent,
    PositionsTableComponent,
    PositionViewComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(POSITIONS_ROUTES),

    CardModule,
    TableModule,

    SharedModule,
  ]
})
export class PositionsModule { }
