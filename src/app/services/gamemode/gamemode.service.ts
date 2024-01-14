import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/app/environments/environment.prod';
import { GameModeRequestDTO } from 'src/app/models/dto/gamemode/request/GameModeRequestDTO';
import { GameModeFullDTO } from 'src/app/models/dto/gamemode/response/GameModeFullDTO';
import { GameModeMinDTO } from 'src/app/models/dto/gamemode/response/GameModeMinDTO';
import { PlayerFullScoreDTO } from 'src/app/models/dto/gamemode/response/PlayerFullScoreDTO';
import { GameModePositionDTO } from '../../models/dto/gamemode/response/GameModePositonDTO';

@Injectable({
    providedIn: 'root'
})
export class GameModeService {

    private readonly API_URL: string = environment.API_URL;

    public $gameModeView: Subject<boolean> = new Subject();

    public changedGameModeId!: number | undefined;
    public gameModeIdInPreview!: number;


    public constructor(
        private httpClient: HttpClient
    ) {
        this.$gameModeView.next(false);
    }

    public findAll(): Observable<GameModeMinDTO[]> {
        return this.httpClient.get<GameModeMinDTO[]>(
            `${this.API_URL}/gamemodes`
        );
    }

    public findFullById(id: number): Observable<GameModeFullDTO> {
        return this.httpClient.get<GameModeFullDTO>(
            `${this.API_URL}/gamemodes/${id}/full`
        );
    }

    public findGameModePositions(id: number): Observable<GameModePositionDTO[]> {
        return this.httpClient.get<GameModePositionDTO[]>(
            `${this.API_URL}/gamemodes/${id}/positions`
        );
    }

    public getRanking(gameModeId: number, positionId: number): Observable<PlayerFullScoreDTO[]> {
        return this.httpClient.get<PlayerFullScoreDTO[]>(
            `${this.API_URL}/gamemodes/ranking?gameModeId=${gameModeId}&positionId=${positionId}`
        );
    }

    public save(gameModeRequest: GameModeRequestDTO): Observable<GameModeFullDTO> {
        return this.httpClient.post<GameModeFullDTO>(
            `${this.API_URL}/gamemodes`,
            gameModeRequest
        );
    }

    public updateById(id: number, gameModeRequest: GameModeRequestDTO): Observable<GameModeFullDTO> {
        return this.httpClient.put<GameModeFullDTO>(
            `${this.API_URL}/gamemodes/${id}`,
            gameModeRequest
        );
    }

    public deleteById(id: number): Observable<void> {
        return this.httpClient.delete<void>(
            `${this.API_URL}/gamemodes/${id}`
        );
    }

}
