import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'src/app/shared/shared.module';
import { ParametersTableComponent } from './components/parameters-table/parameters-table.component';
import { ParametersHomeComponent } from './page/parameters-home/parameters-home.component';
import { PARAMETERS_ROUTES } from './parameters.routing';

import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [ParametersHomeComponent, ParametersTableComponent],
  imports: [CommonModule, RouterModule.forChild(PARAMETERS_ROUTES), SharedModule, CardModule, TableModule, ToastModule],
})
export class ParametersModule {}
