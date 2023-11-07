import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'players',
        pathMatch: 'full'
    },
    {
        path: 'ranking',
        loadChildren: () => import('./modules/players-ranking/players-ranking.module').then((module) => module.PlayersRankingModule)
    },
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
