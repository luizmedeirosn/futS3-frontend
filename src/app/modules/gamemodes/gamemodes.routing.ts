import { Routes } from '@angular/router';
import { GameModesHomeComponent } from './page/gamemodes-home/gamemodes-home.component';
import { PlayersStatisticsHomeComponent } from './page/players-statistics-home/players-statistics-home.component';

export const GAME_MODES_ROUTES: Routes = [
  {
    path: '',
    component: GameModesHomeComponent,
  },
  {
    path: 'statistics',
    component: PlayersStatisticsHomeComponent,
  },
];
