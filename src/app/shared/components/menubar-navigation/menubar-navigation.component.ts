import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EnumParameterEventsCrud } from 'src/app/models/enums/EnumParameterEventsCrud';
import { EnumPlayerEventsCrud } from 'src/app/models/enums/EnumPlayerEventsCrud';
import { GameModeService } from 'src/app/services/gamemode/gamemode.service';
import { PlayerService } from 'src/app/services/player/player.service';
import { PositionService } from 'src/app/services/position/position.service';
import { CustomDialogService } from '../../services/custom-dialog.service';
import { DeleteParameterFormComponent } from '../parameter-forms/delete-parameter-form/delete-parameter-form.component';
import { DeletePlayerFormComponent } from '../player-forms/delete-players-form/delete-player-form.component';
import { EditPlayerFormComponent } from '../player-forms/edit-player-form/edit-player-form.component';
import { SavePlayerFormComponent } from '../player-forms/save-player-form/save-player-form.component';
import { EditParameterFormComponent } from '../parameter-forms/edit-parameter-form/edit-parameter-form.component';
import { SaveParameterFormComponent } from '../parameter-forms/save-parameter-form/save-parameter-form.component';

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
                        routerLink: ['/gamemodes'],
                        command: () => this.gameModeService.$gameModeView.next(false),
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
                        routerLink: ['/positions'],
                        command: () => this.positionService.$positionView.next(false),
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
                        routerLink: ['/players'],
                        command: () => this.playerService.$playerView.next(false),
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

                            this.dynamicDialogRef.onClose
                                .pipe(takeUntil(this.$destroy))
                                .subscribe({
                                    next: () => {
                                        this.playerService.getChangesOn()
                                            .pipe(takeUntil(this.$destroy))
                                            .subscribe({
                                                next: (changesOn) => {
                                                    if (changesOn) {
                                                        window.location.reload();
                                                    }
                                                }
                                            });
                                    },
                                    error: (err) => {
                                        console.log(err);
                                    }
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
                icon: 'pi pi-sign-out'
            }
        ]
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

}
