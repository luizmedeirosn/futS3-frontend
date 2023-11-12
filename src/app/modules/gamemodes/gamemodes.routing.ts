import { Routes } from '@angular/router';
import { GameModesHomeComponent } from './page/gamemodes-home/gamemodes-home.component';
import { PlayersRankingsHomeComponent } from './page/players-rankings-home/players-rankings-home.component';

export const GAME_MODES_ROUTES: Routes = [
    {
        path: '',
        component: GameModesHomeComponent
    },
    {
        path: 'rankings',
        component: PlayersRankingsHomeComponent
    }
];
