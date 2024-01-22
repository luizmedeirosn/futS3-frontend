import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { HOME_ROUTES } from './home.routing';
import { SigninComponent } from './login/signin/signin.component';
import { HomeComponent } from './page/home.component';


@NgModule({
    declarations: [
        HomeComponent,
        SigninComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(HOME_ROUTES),
        FormsModule,
        ReactiveFormsModule,

        CardModule,
        InputTextModule,
        ButtonModule,
    ]
})
export class HomeModule { }
