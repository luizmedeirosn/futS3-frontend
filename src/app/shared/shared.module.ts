import { EditParameterFormComponent } from './components/parameter-forms/edit-parameter-form/edit-parameter-form.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { FormControlAlertComponent } from './components/form-control-alert/form-control-alert.component';
import { MenubarNavigationComponent } from './components/menubar-navigation/menubar-navigation.component';
import { DeleteParameterFormComponent } from './components/parameter-forms/delete-parameter-form/delete-parameter-form.component';
import { SaveParameterFormComponent } from './components/parameter-forms/save-parameter-form/save-parameter-form.component';
import { DeletePlayerFormComponent } from './components/player-forms/delete-players-form/delete-player-form.component';
import { EditPlayerFormComponent } from './components/player-forms/edit-player-form/edit-player-form.component';
import { SavePlayerFormComponent } from './components/player-forms/save-player-form/save-player-form.component';
import { ShortenPipe } from './pipes/shorten.pipe';
import { SavePositionFormComponent } from './components/position-forms/save-position-form/save-position-form.component';
import { EditPositionFormComponent } from './components/position-forms/edit-position-form/edit-position-form.component';
import { DeletePositionFormComponent } from './components/position-forms/delete-position-form/delete-position-form.component';


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
        DeleteParameterFormComponent,
        SavePositionFormComponent,
        EditPositionFormComponent,
        DeletePositionFormComponent
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
        InputTextareaModule,
    ],
    exports: [MenubarNavigationComponent, ShortenPipe, FormControlAlertComponent],
})
export class SharedModule { }
