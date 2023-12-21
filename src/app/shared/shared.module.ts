import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';

import { MenubarNavigationComponent } from './components/menubar-navigation/menubar-navigation.component';
import { ShortenPipe } from './pipes/shorten.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControlAlertComponent } from './components/form-control-alert/form-control-alert.component';
import { SavePlayerFormComponent } from './components/players-forms/save-player-form/save-player-form.component';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { EditPlayerFormComponent } from './components/players-forms/edit-player-form/edit-player-form.component';
import { CardModule } from 'primeng/card';


@NgModule({
    declarations: [
        MenubarNavigationComponent,
        ShortenPipe,
        FormControlAlertComponent,
        SavePlayerFormComponent,
        EditPlayerFormComponent
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

    ],
    exports: [MenubarNavigationComponent, ShortenPipe, FormControlAlertComponent],
})
export class SharedModule { }
