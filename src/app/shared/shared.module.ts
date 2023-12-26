import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { FormControlAlertComponent } from './components/form-control-alert/form-control-alert.component';
import { MenubarNavigationComponent } from './components/menubar-navigation/menubar-navigation.component';
import { DeletePlayerFormComponent } from './components/player-forms/delete-players-form/delete-player-form.component';
import { EditPlayerFormComponent } from './components/player-forms/edit-player-form/edit-player-form.component';
import { SavePlayerFormComponent } from './components/player-forms/save-player-form/save-player-form.component';
import { ShortenPipe } from './pipes/shorten.pipe';
import { ProgressBarModule } from 'primeng/progressbar';
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { SaveParameterFormComponent } from './components/parameter-forms/save-parameter-form/save-parameter-form.component';
import { EditParameterFormComponent } from './components/parameter-forms/edit-parameter-form/edit-parameter-form.component';
import { DeleteParameterFormComponent } from './components/parameter-forms/delete-parameter-form/delete-parameter-form.component';


@NgModule({
    declarations: [
        MenubarNavigationComponent,
        ShortenPipe,
        FormControlAlertComponent,
        SavePlayerFormComponent,
        EditPlayerFormComponent,
        DeletePlayerFormComponent,
        SaveParameterFormComponent,
        EditParameterFormComponent,
        DeleteParameterFormComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        MenubarModule,
        ButtonModule,
        DynamicDialogModule,
        InputTextModule,
        InputNumberModule,
        DropdownModule,
        TableModule,
        TooltipModule,
        CardModule,
        ProgressBarModule,
        ConfirmDialogModule,
    ],
    exports: [MenubarNavigationComponent, ShortenPipe, FormControlAlertComponent],
})
export class SharedModule { }
