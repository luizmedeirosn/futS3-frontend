import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Observable, Subject, takeUntil, zip } from 'rxjs';
import { ParameterDTO } from 'src/app/models/dto/parameter/response/ParameterDTO';
import { PlayerParameterIdScoreDTO } from 'src/app/models/dto/player/request/PlayerParameterIdScoreDTO';
import { PostPlayerDTO } from 'src/app/models/dto/player/request/PostPlayerDTO';
import PlayerParameterDataDTO from 'src/app/models/dto/player/aux/PlayerParameterDataDTO';
import PositionMinDTO from 'src/app/models/dto/position/response/PositionMinDTO';
import { ParameterService } from 'src/app/services/parameter/parameter.service';
import { PlayerService } from 'src/app/services/player/player.service';
import { PositionService } from 'src/app/services/position/position.service';
import { ChangesOnService } from 'src/app/shared/services/changes-on/changes-on.service';
import Page from '../../../../../models/dto/generics/response/Page';

@Component({
  selector: 'app-players-form',
  templateUrl: './save-player-form.component.html',
  styleUrls: [],
})
export class SavePlayerFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  private readonly toastLife: number = 2000;

  public viewSelectedPicture$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public totalPositions!: PositionMinDTO[];
  public totalParameters!: ParameterDTO[];
  public playerParameters!: PlayerParameterDataDTO[];

  public newPlayerForm = this.formBuilder.group({
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
  ) {
    this.playerParameters = [];
  }

  public ngOnInit(): void {
    this.setTotalPositionsAndParametersWithApi();
  }

  private setTotalParametersWithApi(): void {
    this.parameterService
      .findAllWithTotalRecords()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (parametersPage: Page<ParameterDTO>) => {
          this.totalParameters = parametersPage.content;

          // playerParametersScore cannot be undefined since it already starts with an empty array
          this.deleteIncludedParameters();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  private deleteIncludedParameters(): void {
    const playerParametersIds: number[] = this.playerParameters.map((p) => p.id);
    this.totalParameters = this.totalParameters.filter((p) => !playerParametersIds.includes(p.id));
  }

  private setTotalPositionsAndParametersWithApi() {
    const totalPositions$: Observable<Page<PositionMinDTO>> = this.positionService.findAllWithTotalRecords();
    const totalParameters$: Observable<Page<ParameterDTO>> = this.parameterService.findAllWithTotalRecords();

    const combined$: Observable<[Page<PositionMinDTO>, Page<ParameterDTO>]> = zip(totalPositions$, totalParameters$);

    combined$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (response: [Page<PositionMinDTO>, Page<ParameterDTO>]) => {
        let positionsPage: Page<PositionMinDTO>;
        let parametersPage: Page<ParameterDTO>;
        [positionsPage, parametersPage] = response;

        this.totalPositions = positionsPage.content;
        this.totalParameters = parametersPage.content;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  public handleUploadPicture($event: any): void {
    if ($event) {
      this.playerPicture = $event.target.files[0];
      this.viewSelectedPicture$.next(true);
    }
  }

  public handleAddNewPlayerParameter(): void {
    const parameter: ParameterDTO | undefined = this.playerParameterForm.value?.parameter as ParameterDTO | undefined;
    const score = this.playerParameterForm.value?.score as number | undefined;

    if (parameter && score) {
      this.totalParameters = this.totalParameters.filter((p) => p.id !== parameter.id);

      this.playerParameters.push(new PlayerParameterDataDTO(parameter.id, parameter.name, score));
      this.sortParametersByName(this.playerParameters);
    }

    this.playerParameterForm.reset();
  }

  public handleDeletePlayerParameter(id: number): void {
    if (id) {
      const playerParameterDataDTO: PlayerParameterDataDTO | undefined = this.playerParameters.find((p) => p.id === id);
      if (playerParameterDataDTO) {
        const parameter: ParameterDTO = new ParameterDTO(playerParameterDataDTO.id, playerParameterDataDTO.name);

        this.playerParameters = this.playerParameters.filter((p) => p.id !== parameter.id);

        this.totalParameters.push(parameter);
        this.sortParametersByName(this.totalParameters);
      }
    }
  }

  private sortParametersByName(parameters: ParameterDTO[] | PlayerParameterDataDTO[]): void {
    parameters.sort((p1, p2) => p1.name.toUpperCase().localeCompare(p2.name.toUpperCase()));
  }

  public handleSubmitSavePlayerForm(): void {
    if (this.newPlayerForm.valid && this.newPlayerForm.value) {
      const position = this.newPlayerForm.value.position as PositionMinDTO | undefined;
      if (position) {
        const parameters: PlayerParameterIdScoreDTO[] = this.playerParameters.map((p) => ({
          id: p.id,
          score: p.score,
        }));

        const playerRequest: PostPlayerDTO = {
          name: this.newPlayerForm.value.name as string,
          team: this.newPlayerForm.value.team as string,
          age: this.newPlayerForm.value.age as string | undefined,
          height: this.newPlayerForm.value.height as string | undefined,
          positionId: String(position.id),
          playerPicture: this.playerPicture,
          parameters,
        };

        this.playerService
          .save(playerRequest)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.newPlayerForm.reset();
              this.viewSelectedPicture$.next(false);
              this.playerParameterForm.reset();

              // Reset totalParameters and positionParameters
              this.playerParameters = [];
              this.setTotalParametersWithApi();

              this.changesOnService.setChangesOn(true);

              this.messageService.clear();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Player registered successfully!',
                life: this.toastLife,
              });
            },
            error: (err) => {
              this.messageService.clear();
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Invalid registration!',
                life: this.toastLife,
              });

              console.log(err);

              this.changesOnService.setChangesOn(false);
            },
          });
      }
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
