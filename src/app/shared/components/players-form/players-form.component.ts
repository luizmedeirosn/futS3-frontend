import { PositionService } from 'src/app/services/position/position.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { CustomDialogService } from 'src/app/shared/services/custom-dialog.service';
import { PositionDTO } from 'src/app/models/interfaces/position/response/PositionDTO';
import { PlayerParameterScoreDTO } from 'src/app/models/interfaces/player/response/PlayerParameterScoreDTO';
import { ParameterService } from 'src/app/services/parameter/parameter.service';
import { ParameterDTO } from 'src/app/models/interfaces/parameter/response/ParameterDTO';

@Component({
    selector: 'app-players-form',
    templateUrl: './players-form.component.html',
    styleUrls: []
})
export class PlayersFormComponent implements OnInit, OnDestroy {

    private readonly $destroy: Subject<void> = new Subject();

    public $viewSelectedPicture: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public positions!: PositionDTO[];
    public parameters!: ParameterDTO[];
    private parametersOff: ParameterDTO[] = [];
    public playerParametersScore: PlayerParameterScoreDTO[] = [];

    public playerForm = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
        age: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(3)]],
        height: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(3)]],
        position: ['', Validators.required],
        team: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    });
    public picture!: File;

    public playerParameterForm = this.formBuilder.group({
        parameter: ['', Validators.required],
        score: ['', [Validators.required, Validators.pattern(/^-?\d*\.?\d*$/), Validators.min(1), Validators.max(100)]],
    });

    public constructor(
        private formBuilder: FormBuilder,
        private dynamicDialogConfig: DynamicDialogConfig,
        private customDialogService: CustomDialogService,
        private httpClient: HttpClient,
        private positionService: PositionService,
        private parameterService: ParameterService,
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
            this.picture = $event.target.files[0];
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

    public handleSubmitPlayerForm(): void {
        throw new Error('Method not implemented.');

    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

}
