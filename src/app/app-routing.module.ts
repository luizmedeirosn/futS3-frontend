import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'players',
        pathMatch: 'full'
    },
    {
        path: 'players',
        loadChildren: () => import('./modules/players/players.module').then((module) => module.PlayersHomeModule)
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
