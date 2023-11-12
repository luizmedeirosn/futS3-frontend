import { PositionService } from 'src/app/services/position/position.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PlayerService } from 'src/app/services/player/player.service';
import { GameModeService } from 'src/app/services/gamemode/gamemode.service';

@Component({
  selector: 'app-menubar-navigation',
  templateUrl: './menubar-navigation.component.html',
  styleUrls: ['./menubar-navigation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MenubarNavigationComponent implements OnInit {

    public items: MenuItem[] | undefined;

    constructor (
        private playerService: PlayerService,
        private positionService: PositionService,
        private gameModeService: GameModeService,
    ){
    }

    public ngOnInit(): void {
        this.items = [
            {
                label: 'Rankings',
                icon: 'pi pi-chart-line',
                routerLink: ['/gamemodes/rankings'],
            },
            {
                label: 'Game Modes',
                icon: 'pi pi-tablet',
                items: [
                    {
                        label: 'Find All',
                        icon: 'pi pi-search',
                        command: () => this.gameModeService.gameModeView$.next(false),
                        routerLink: ['/gamemodes']
                    },
                    {
                        label: 'Add',
                        icon: 'pi pi-fw pi-plus',
                    },
                    {
                        label: 'Edit',
                        icon: 'pi pi-fw pi-pencil'
                    },
                    {
                        label: 'Delete',
                        icon: 'pi pi-fw pi-trash'
                    }
                ]
            },
            {
                label: 'Positions',
                icon: 'pi pi-th-large',
                items: [
                    {
                        label: 'Find All',
                        icon: 'pi pi-search',
                        command: () => this.positionService.positionView$.next(false),
                        routerLink: ['/positions']
                    },
                    {
                        label: 'Add',
                        icon: 'pi pi-fw pi-plus',
                    },
                    {
                        label: 'Edit',
                        icon: 'pi pi-fw pi-pencil'
                    },
                    {
                        label: 'Delete',
                        icon: 'pi pi-fw pi-trash'
                    }
                ]
            }
            ,{
                label: 'Parameters',
                icon: 'pi pi-tags',
                items: [
                    {
                        label: 'Find All',
                        icon: 'pi pi-search',
                        routerLink: ['/parameters']
                    },
                    {
                        label: 'Add',
                        icon: 'pi pi-fw pi-plus',
                    },
                    {
                        label: 'Edit',
                        icon: 'pi pi-fw pi-pencil'
                    },
                    {
                        label: 'Delete',
                        icon: 'pi pi-fw pi-trash'
                    }
                ]
            }
            ,{
                label: 'Players',
                icon: 'pi pi-users',
                items: [
                    {
                        label: 'Find All',
                        icon: 'pi pi-search',
                        command: () => this.playerService.playerView$.next(false),
                        routerLink: ['/players']
                    },
                    {
                        label: 'Add',
                        icon: 'pi pi-fw pi-plus',
                    },
                    {
                        label: 'Edit',
                        icon: 'pi pi-fw pi-pencil'
                    },
                    {
                        label: 'Delete',
                        icon: 'pi pi-fw pi-trash'
                    }
                ]
            },
            {
                label: 'Sign out',
                icon: 'pi pi-sign-out'
            }
        ]
    }

}
