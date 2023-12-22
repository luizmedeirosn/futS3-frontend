import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ParameterDTO } from 'src/app/models/interfaces/parameter/response/ParameterDTO';
import { PostPlayerDTO } from 'src/app/models/interfaces/player/request/PostPlayerDTO';
import { PlayerParameterScoreDTO } from 'src/app/models/interfaces/player/response/PlayerParameterScoreDTO';
import { PositionDTO } from 'src/app/models/interfaces/position/response/PositionDTO';
import { ParameterService } from 'src/app/services/parameter/parameter.service';
import { PlayerService } from 'src/app/services/player/player.service';
import { PositionService } from 'src/app/services/position/position.service';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog.service';

@Component({
    selector: 'app-players-form',
    templateUrl: './save-player-form.component.html',
    styleUrls: []
})
export class SavePlayerFormComponent implements OnInit, OnDestroy {

    private readonly $destroy: Subject<void> = new Subject();
    private readonly toastLife: number = 2000;

    public $viewSelectedPicture: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public positions!: PositionDTO[];
    public parameters!: ParameterDTO[];
    private parametersOff: ParameterDTO[] = [];
    public playerParametersScore: PlayerParameterScoreDTO[] = [];

    public playerForm = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
        team: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
        age: [null, [Validators.min(1), Validators.max(150)]],
        height: [null, [Validators.min(65), Validators.max(250)]],
        position: ['', Validators.required],
    });
    public playerPicture!: File;

    public playerParameterForm = this.formBuilder.group({
        parameter: ['', Validators.required],
        score: ['', [Validators.required, Validators.pattern(/^-?\d*\.?\d*$/), Validators.min(1), Validators.max(100)]],
    });

    public constructor(
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private positionService: PositionService,
        private parameterService: ParameterService,
        private playerService: PlayerService,
        private customDialogService: CustomDialogService
    ) { }

    public ngOnInit(): void {
        this.positionService.findAll()
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (positions) => {
                    this.positions = positions;
                },
                error: (err) => {
                    console.log(err);
                }
            });

        this.parameterService.findAll()
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (parameters) => {
                    this.parameters = parameters;
                },
                error: (err) => {
                    console.log(err);
                }
            });

    }

    public handleUploadPicture($event: any): void {
        if ($event) {
            this.playerPicture = $event.target.files[0];
            this.$viewSelectedPicture.next(true);
        }
    }

    public handleAddNewParameter(): void {
        const parameter = this.playerParameterForm.value?.parameter as ParameterDTO | undefined;
        const score = this.playerParameterForm.value?.score as number | undefined;

        if (parameter && score) {
            const parameterName: string = this.parameters.filter((p) => p.name === parameter.name)[0].name;

            this.parametersOff.push(parameter);
            this.parameters = this.parameters.filter(p => p.name !== parameterName);

            let playerParameterScore: PlayerParameterScoreDTO = {
                id: parameter.id,
                name: parameterName,
                playerScore: Number(this.playerParameterForm.value.score),
            };

            this.playerParametersScore.push(playerParameterScore);
        }
        this.playerParameterForm.reset();
    }

    private compareParameters = (p1: any, p2: any) => {
        if (p1.name < p2.name) {
            return -1;
        } else if (p1.name > p2.name) {
            return 1;
        }
        return 0;
    };

    public handleDeletePlayerParameter($event: string): void {
        this.playerParametersScore = this.playerParametersScore.filter(p => p.name !== $event);
        this.parameters.push(this.parametersOff.filter((p) => p.name === $event)[0]);
        this.parameters.sort(this.compareParameters);
    }

    public handleSubmitSavePlayerForm(): void {
        if (this.playerForm.valid && this.playerForm.value) {
            const position = this.playerForm.value.position as PositionDTO | undefined;
            if (position) {
                const playerRequest: PostPlayerDTO = {
                    name: this.playerForm.value.name as string,
                    team: this.playerForm.value.team as string,
                    age: this.playerForm.value.age as string | undefined,
                    height: this.playerForm.value.height as string | undefined,
                    positionId: String(position.id),
                    playerPicture: this.playerPicture,
                    parameters: this.playerParametersScore
                };

                this.playerForm.reset();
                this.$viewSelectedPicture.next(false);
                this.playerService.save(playerRequest)
                    .pipe(takeUntil(this.$destroy))
                    .subscribe({
                        next: () => {
                            this.customDialogService.setChangesOn(true);
                            this.messageService.clear();
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Player successfully registered!',
                                life: this.toastLife
                            });
                        },
                        error: (err) => {
                            this.customDialogService.setChangesOn(false);
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
            this.playerForm.reset();
            this.playerParameterForm.reset();
            this.parametersOff.forEach(e => this.parameters.push(e));
            this.parameters.sort(this.compareParameters);
            this.parametersOff = new Array();
            this.playerParametersScore = [];
        }
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

}
