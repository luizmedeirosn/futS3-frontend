import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IconDefinition, faTag } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { GameModeRequestDTO } from 'src/app/models/dto/gamemode/request/GameModeRequestDTO';
import { PositionMinDTO } from 'src/app/models/dto/position/response/PositionMinDTO';
import { EnumPositionEventsCrud } from 'src/app/models/enums/EnumPositionEventsCrud';
import { GameModeService } from 'src/app/services/gamemode/gamemode.service';
import { PositionService } from 'src/app/services/position/position.service';
import { SavePositionFormComponent } from '../../position-forms/save-position-form/save-position-form.component';
import { CustomDialogService } from './../../../../services/custom-dialog.service';

@Component({
    selector: 'app-save-gamemode-form',
    templateUrl: './save-gamemode-form.component.html',
    styleUrls: []
})
export class SaveGamemodeFormComponent implements OnInit, OnDestroy {

    private readonly $destroy: Subject<void> = new Subject();
    private readonly toastLife: number = 2000;
    public readonly faNewPositionIcon: IconDefinition = faTag;

    public positions!: Array<PositionMinDTO>;
    public positionsOff: Array<PositionMinDTO> = new Array();

    public newGameModeForm: any = this.formBuilder.group({
        formationName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        description: ['', [Validators.maxLength(2000)]],
    });

    public addPositionForm = this.formBuilder.group({
        position: ['', Validators.required],
    });

    public dynamicDialogRef!: DynamicDialogRef;

    public constructor(
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private positionService: PositionService,
        private gameModeService: GameModeService,
        private customDialogService: CustomDialogService,
    ) { }

    public ngOnInit(): void {
        this.setPositionsWithApi();
    }

    private setPositionsWithApi(): void {
        this.positionService.findAll()
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (positions: Array<PositionMinDTO>) => {
                    this.positions = positions.filter(p => !this.positionsOff.some(off => off.id === p.id));
                },
                error: (err) => {
                    console.log(err);
                }
            });
    }

    public createPositionEvent(): void {
        this.dynamicDialogRef = this.customDialogService.open(
            SavePositionFormComponent,
            {
                position: 'top',
                header: EnumPositionEventsCrud.ADD.valueOf(),
                contentStyle: { overflow: 'auto' },
                baseZIndex: 10000,
            });

        this.dynamicDialogRef.onClose
            .pipe(takeUntil(this.$destroy))
            .subscribe(() => this.setPositionsWithApi());
    }

    public handleAddPosition(): void {
        const position = this.addPositionForm.value?.position as PositionMinDTO | undefined;

        if (position) {
            const positionId: number = this.positions.filter((p) => p.id === position.id)[0].id;

            this.positionsOff.push(position);
            this.positions = this.positions.filter(p => p.id !== positionId);
        }
        this.addPositionForm.reset();
    }

    private comparePositions = (p1: any, p2: any) => {
        if (p1.name < p2.name) {
            return -1;
        } else if (p1.name > p2.name) {
            return 1;
        }
        return 0;
    };

    public handleDeletePosition($event: number): void {
        const position: PositionMinDTO | undefined = this.positionsOff.find((p) => p.id === $event);
        position && this.positions.push(position);
        this.positionsOff = position && this.positionsOff.filter(p => p.id !== position.id) || new Array();
        this.positions.sort(this.comparePositions);
    }

    public handleSubmitSaveGameModeForm(): void {
        if (this.newGameModeForm.valid && this.newGameModeForm.value) {
            const gameModeRequest: GameModeRequestDTO = {
                formationName: this.newGameModeForm.value.formationName as string,
                description: this.newGameModeForm.value.description as string,
                positions: this.positionsOff.map(p => p.id)
            }
            this.newGameModeForm.reset();

            this.gameModeService.save(gameModeRequest)
                .pipe(takeUntil(this.$destroy))
                .subscribe({
                    next: (gameMode) => {
                        console.log(gameMode);
                        this.gameModeService.setChangesOn(true);
                        this.messageService.clear();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Game Mode successfully registered!',
                            life: this.toastLife
                        });
                    },
                    error: (err) => {
                        this.gameModeService.setChangesOn(false);
                        this.messageService.clear();
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Invalid registration!',
                            life: this.toastLife
                        });
                        console.log(err);
                    }
                });
        }

        this.newGameModeForm.reset();
        this.addPositionForm.reset();

        this.positionsOff.forEach(e => this.positions.push(e));
        this.positions.sort(this.comparePositions);
        this.positionsOff = new Array();
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

}
