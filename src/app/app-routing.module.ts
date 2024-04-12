import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './guards/auth/auth-guard.service';
import { LoggedInGuardService } from './guards/logged-in/logged-in-guard.service';

const routes: Routes = [
    {
        path: 'home',
        canActivate: [LoggedInGuardService],
        loadChildren: () => import('./modules/home/home.module').then((module) => module.HomeModule)
    },
    {
        path: 'gamemodes',
        canActivate: [AuthGuardService],
        loadChildren: () => import('./modules/gamemodes/gamemodes.module').then((module) => module.GamemodesModule),
    },
    {
        path: 'positions',
        canActivate: [AuthGuardService],
        loadChildren: () => import('./modules/positions/positions.module').then((module) => module.PositionsModule)
    },
    {
        path: 'parameters',
        canActivate: [AuthGuardService],
        loadChildren: () => import('./modules/parameters/parameters.module').then((module) => module.ParametersModule)
    },
    {
        path: 'players',
        canActivate: [AuthGuardService],
        loadChildren: () => import('./modules/players/players.module').then((module) => module.PlayersHomeModule)
    },
    {
        path: '**',
        redirectTo: 'home',
        pathMatch: 'full'
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
