import { Routes } from '@angular/router';
import { GameModesHomeComponent } from './page/gamemodes-home/gamemodes-home.component';

export const GAME_MODES_ROUTES: Routes = [
    {
        path: '',
        component: GameModesHomeComponent
    }
];
