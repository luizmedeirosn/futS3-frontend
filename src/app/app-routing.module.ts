import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'gamemodes',
        loadChildren: () => import('./modules/gamemodes/gamemodes.module').then((module) => module.GamemodesModule)
    },
    {
        path: 'positions',
        loadChildren: () => import('./modules/positions/positions.module').then((module) => module.PositionsModule)
    },
    {
        path: 'parameters',
        loadChildren: () => import('./modules/parameters/parameters.module').then((module) => module.ParametersModule)
    },
    {
        path: 'players',
        loadChildren: () => import('./modules/players/players.module').then((module) => module.PlayersHomeModule)
    },
    {
        path: '**',
        redirectTo: 'gamemodes',
        pathMatch: 'full'
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
