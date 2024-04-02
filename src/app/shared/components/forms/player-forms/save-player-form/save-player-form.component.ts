import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ParameterDTO } from 'src/app/models/dto/parameter/response/ParameterDTO';
import { PostPlayerDTO } from 'src/app/models/dto/player/request/PostPlayerDTO';
import { PlayerParameterDataDTO } from 'src/app/models/dto/player/response/PlayerParameterDataDTO';
import { PositionMinDTO } from 'src/app/models/dto/position/response/PositionMinDTO';
import { ParameterService } from 'src/app/services/parameter/parameter.service';
import { PlayerService } from 'src/app/services/player/player.service';
import { PositionService } from 'src/app/services/position/position.service';
import { ChangesOnService } from 'src/app/shared/services/changes-on/changes-on.service';

@Component({
    selector: 'app-players-form',
    templateUrl: './save-player-form.component.html',
    styleUrls: [],
})
export class SavePlayerFormComponent implements OnInit, OnDestroy {

    private readonly $destroy: Subject<void> = new Subject();
    private readonly toastLife: number = 2000;

    public $viewSelectedPicture: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public positions!: PositionMinDTO[];
    public parameters!: ParameterDTO[];
    private parametersOff: ParameterDTO[] = [];
    public playerParametersScore: PlayerParameterDataDTO[] = [];

    public newPlayerForm: any = this.formBuilder.group({
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
        private changesOnService: ChangesOnService,
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

            const playerParameterScore: PlayerParameterDataDTO = {
                id: parameter.id,
                name: parameterName,
                score: Number(this.playerParameterForm.value.score),
            };

            this.playerParametersScore.push(playerParameterScore);
            this.playerParametersScore.sort((p1, p2) => p1.name.toUpperCase().localeCompare(p2.name.toUpperCase()));

        }

        this.playerParameterForm.reset();
    }

    public handleDeletePlayerParameter(name: string): void {
        if (name) {
            this.playerParametersScore = this.playerParametersScore.filter(p => p.name !== name);

            const parameter: ParameterDTO | undefined = this.parametersOff.find((p) => p.name === name);
            parameter && this.parameters.push(parameter);
            this.parameters.sort((p1, p2) => p1.name.toUpperCase().localeCompare(p2.name.toUpperCase()));
        }
    }

    public handleSubmitSavePlayerForm(): void {
        if (this.newPlayerForm.valid && this.newPlayerForm.value) {
            const position = this.newPlayerForm.value.position as PositionMinDTO | undefined;
            if (position) {
                const playerRequest: PostPlayerDTO = {
                    name: this.newPlayerForm.value.name as string,
                    team: this.newPlayerForm.value.team as string,
                    age: this.newPlayerForm.value.age as string | undefined,
                    height: this.newPlayerForm.value.height as string | undefined,
                    positionId: String(position.id),
                    playerPicture: this.playerPicture,
                    parameters: this.playerParametersScore
                };

                this.$viewSelectedPicture.next(false);
                this.playerService.save(playerRequest)
                    .pipe(takeUntil(this.$destroy))
                    .subscribe({
                        next: () => {
                            this.changesOnService.setChangesOn(true);

                            this.messageService.clear();
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Player registered successfully!',
                                life: this.toastLife
                            });
                        },
                        error: (err) => {
                            this.changesOnService.setChangesOn(false);

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
            this.newPlayerForm.reset();
            this.playerParameterForm.reset();

            this.parametersOff.forEach(e => this.parameters.push(e));
            this.parameters.sort((p1, p2) => p1.name.toUpperCase().localeCompare(p2.name.toUpperCase()));
            this.parametersOff = new Array();
            this.playerParametersScore = [];
        }
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

}
