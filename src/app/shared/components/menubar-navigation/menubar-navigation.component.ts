import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { EnumPlayerEventsCrud } from 'src/app/models/enums/EnumPlayerEventsCrud';
import { GameModeService } from 'src/app/services/gamemode/gamemode.service';
import { PlayerService } from 'src/app/services/player/player.service';
import { PositionService } from 'src/app/services/position/position.service';
import { CustomDialogService } from '../../services/custom-dialog.service';
import { SavePlayerFormComponent } from '../players-forms/save-player-form/save-player-form.component';
import { EditPlayerFormComponent } from '../players-forms/edit-player-form/edit-player-form.component';
import { Subject, takeUntil } from 'rxjs';

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
                        command: () => {
                            this.dynamicDialogRef = this.customDialogService.open(
                                SavePlayerFormComponent,
                                {
                                    position: 'top',
                                    header: EnumPlayerEventsCrud.ADD.valueOf(),
                                    contentStyle: { overflow: 'auto' },
                                    baseZIndex: 10000,
                                });

                            this.dynamicDialogRef.onClose
                                .pipe(takeUntil(this.$destroy))
                                .subscribe({
                                    next: () => {
                                        if (this.customDialogService.getChangesOn()) {
                                            window.location.reload();
                                        }
                                    },
                                    error: (err) => {
                                        console.log(err);
                                    }
                                })
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

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

}
