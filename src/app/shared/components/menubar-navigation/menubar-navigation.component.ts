import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { EnumGameModeEventsCrud } from 'src/app/models/enums/EnumGameModeEventsCrud';
import { EnumParameterEventsCrud } from 'src/app/models/enums/EnumParameterEventsCrud';
import { EnumPlayerEventsCrud } from 'src/app/models/enums/EnumPlayerEventsCrud';
import { EnumPositionEventsCrud } from 'src/app/models/enums/EnumPositionEventsCrud';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GameModeService } from 'src/app/services/gamemode/gamemode.service';
import { PlayerService } from 'src/app/services/player/player.service';
import { PositionService } from 'src/app/services/position/position.service';
import { CustomDialogService } from '../../services/custom-dialog/custom-dialog.service';
import { DeleteGamemodeFormComponent } from '../forms/gamemode-forms/delete-gamemode-form/delete-gamemode-form.component';
import { EditGamemodeFormComponent } from '../forms/gamemode-forms/edit-gamemode-form/edit-gamemode-form.component';
import { SaveGamemodeFormComponent } from '../forms/gamemode-forms/save-gamemode-form/save-gamemode-form.component';
import { DeleteParameterFormComponent } from '../forms/parameter-forms/delete-parameter-form/delete-parameter-form.component';
import { EditParameterFormComponent } from '../forms/parameter-forms/edit-parameter-form/edit-parameter-form.component';
import { SaveParameterFormComponent } from '../forms/parameter-forms/save-parameter-form/save-parameter-form.component';
import { DeletePlayerFormComponent } from '../forms/player-forms/delete-players-form/delete-player-form.component';
import { EditPlayerFormComponent } from '../forms/player-forms/edit-player-form/edit-player-form.component';
import { SavePlayerFormComponent } from '../forms/player-forms/save-player-form/save-player-form.component';
import { DeletePositionFormComponent } from '../forms/position-forms/delete-position-form/delete-position-form.component';
import { EditPositionFormComponent } from '../forms/position-forms/edit-position-form/edit-position-form.component';
import { SavePositionFormComponent } from '../forms/position-forms/save-position-form/save-position-form.component';

@Component({
    selector: 'app-menubar-navigation',
    templateUrl: './menubar-navigation.component.html',
    styleUrls: ['./menubar-navigation.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MenubarNavigationComponent implements OnInit, OnDestroy {

    private readonly $destroy: Subject<void> = new Subject();
    private dynamicDialogRef!: DynamicDialogRef;

    public items: MenuItem[] | undefined;

    constructor(
        private playerService: PlayerService,
        private positionService: PositionService,
        private gameModeService: GameModeService,
        private customDialogService: CustomDialogService,
        private authService: AuthService,
    ) {
    }

    public ngOnInit(): void {
        this.items = [
            {
                label: 'Statistics',
                icon: 'pi pi-chart-line',
                routerLink: ['/gamemodes/statistics'],
            },
            {
                label: 'Game Modes',
                icon: 'pi pi-tablet',
                items: [
                    {
                        label: 'Find All',
                        icon: 'pi pi-search',
                        command: () => this.gameModeService.$gameModeView.next(false),
                        routerLink: ['/gamemodes'],
                    },
                    {
                        label: 'Add',
                        icon: 'pi pi-fw pi-plus',
                        command: () => {
                            this.dynamicDialogRef = this.customDialogService.open(
                                SaveGamemodeFormComponent,
                                {
                                    position: 'top',
                                    header: EnumGameModeEventsCrud.ADD.valueOf(),
                                    contentStyle: { overflow: 'auto' },
                                    baseZIndex: 10000,
                                });
                        },
                    },
                    {
                        label: 'Edit',
                        icon: 'pi pi-fw pi-pencil',
                        command: () => {
                            // Prevent invalid use of changesOn in EditGameModeFormComponent
                            this.gameModeService.changedGameModeId = undefined;

                            this.dynamicDialogRef = this.customDialogService.open(
                                EditGamemodeFormComponent,
                                {
                                    position: 'top',
                                    header: EnumGameModeEventsCrud.EDIT.valueOf(),
                                    contentStyle: { overflow: 'auto' },
                                    baseZIndex: 10000,
                                });
                        },
                    },
                    {
                        label: 'Delete',
                        icon: 'pi pi-fw pi-trash',
                        command: () => {
                            this.dynamicDialogRef = this.customDialogService.open(
                                DeleteGamemodeFormComponent,
                                {
                                    position: 'top',
                                    header: EnumGameModeEventsCrud.DELETE.valueOf(),
                                    contentStyle: { overflow: 'auto' },
                                    baseZIndex: 10000,
                                });
                        },
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
                        command: () => this.positionService.$positionView.next(false),
                        routerLink: ['/positions'],
                    },
                    {
                        label: 'Add',
                        icon: 'pi pi-fw pi-plus',
                        command: () => {
                            this.dynamicDialogRef = this.customDialogService.open(
                                SavePositionFormComponent,
                                {
                                    position: 'top',
                                    header: EnumPositionEventsCrud.ADD.valueOf(),
                                    contentStyle: { overflow: 'auto' },
                                    baseZIndex: 10000,
                                });
                        },
                    },
                    {
                        label: 'Edit',
                        icon: 'pi pi-fw pi-pencil',
                        command: () => {
                            this.dynamicDialogRef = this.customDialogService.open(
                                EditPositionFormComponent,
                                {
                                    position: 'top',
                                    header: EnumPositionEventsCrud.EDIT.valueOf(),
                                    contentStyle: { overflow: 'auto' },
                                    baseZIndex: 10000,
                                });
                        },
                    },
                    {
                        label: 'Delete',
                        icon: 'pi pi-fw pi-trash',
                        command: () => {
                            this.dynamicDialogRef = this.customDialogService.open(
                                DeletePositionFormComponent,
                                {
                                    position: 'top',
                                    header: EnumPositionEventsCrud.DELETE.valueOf(),
                                    contentStyle: { overflow: 'auto' },
                                    baseZIndex: 10000,
                                });
                        },
                    }
                ]
            },
            {
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
                        command: () => {
                            this.dynamicDialogRef = this.customDialogService.open(
                                SaveParameterFormComponent,
                                {
                                    position: 'top',
                                    header: EnumParameterEventsCrud.ADD.valueOf(),
                                    contentStyle: { overflow: 'auto' },
                                    baseZIndex: 10000,
                                });
                        },
                    },
                    {
                        label: 'Edit',
                        icon: 'pi pi-fw pi-pencil',
                        command: () => {
                            this.dynamicDialogRef = this.customDialogService.open(
                                EditParameterFormComponent,
                                {
                                    position: 'top',
                                    header: EnumParameterEventsCrud.EDIT.valueOf(),
                                    contentStyle: { overflow: 'auto' },
                                    baseZIndex: 10000,
                                });
                        },
                    },
                    {
                        label: 'Delete',
                        icon: 'pi pi-fw pi-trash',
                        command: () => {
                            this.dynamicDialogRef = this.customDialogService.open(
                                DeleteParameterFormComponent,
                                {
                                    position: 'top',
                                    header: EnumParameterEventsCrud.DELETE.valueOf(),
                                    contentStyle: { overflow: 'auto' },
                                    baseZIndex: 10000,
                                });
                        }
                    }
                ]
            },
            {
                label: 'Players',
                icon: 'pi pi-users',
                items: [
                    {
                        label: 'Find All',
                        icon: 'pi pi-search',
                        command: () => this.playerService.$playerView.next(false),
                        routerLink: ['/players'],
                    },
                    {
                        label: 'Add',
                        icon: 'pi pi-fw pi-plus',
                        command: () => {
                            this.dynamicDialogRef = this.customDialogService.open(
                                SavePlayerFormComponent,
                                {
                                    position: 'top',
                                    header: EnumPlayerEventsCrud.ADD.valueOf(),
                                    contentStyle: { overflow: 'auto' },
                                    baseZIndex: 10000,
                                });
                        }
                    },
                    {
                        label: 'Edit',
                        icon: 'pi pi-fw pi-pencil',
                        command: () => {
                            this.dynamicDialogRef = this.customDialogService.open(
                                EditPlayerFormComponent,
                                {
                                    position: 'top',
                                    header: EnumPlayerEventsCrud.EDIT.valueOf(),
                                    contentStyle: { overflow: 'auto' },
                                    baseZIndex: 10000,
                                });
                        }
                    },
                    {
                        label: 'Delete',
                        icon: 'pi pi-fw pi-trash',
                        command: () => {
                            this.dynamicDialogRef = this.customDialogService.open(
                                DeletePlayerFormComponent,
                                {
                                    position: 'top',
                                    header: EnumPlayerEventsCrud.DELETE.valueOf(),
                                    contentStyle: { overflow: 'auto' },
                                    baseZIndex: 10000,
                                });
                        }
                    }
                ]
            },
            {
                label: 'Sign out',
                icon: 'pi pi-sign-out',
                command: () => this.authService.logout()
            }
        ];
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

}
