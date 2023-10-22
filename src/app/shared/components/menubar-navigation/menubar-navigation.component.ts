import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PlayersHomeComponent } from 'src/app/modules/players/page/players-home/players-home.component';

@Component({
  selector: 'app-menubar-navigation',
  templateUrl: './menubar-navigation.component.html',
  styleUrls: ['./menubar-navigation.component.scss']
})
export class MenubarNavigationComponent implements OnInit {

    public items: MenuItem[] | undefined;

    constructor (
        private playersHomeComponent: PlayersHomeComponent,
    ){
    }

    public ngOnInit(): void {
        this.items = [
            {
                label: 'Ranking',
                icon: 'pi pi-chart-line',
            },
            {
                label: 'Game Modes',
                icon: 'pi pi-tablet',
                items: [
                    {
                        label: 'Find All',
                        icon: 'pi pi-search',
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
                        command: () => { this.playersHomeComponent.playerView = false },
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
