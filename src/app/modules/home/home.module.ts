import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HOME_ROUTES } from './home.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { SigninComponent } from './login/signin/signin.component';
import { HomeComponent } from './page/home.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';


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

        AnimateOnScrollModule,
        CardModule,
        InputTextModule,
        ButtonModule,
    ]
})
export class HomeModule { }
