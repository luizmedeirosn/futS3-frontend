import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/app/environments/environment.prod';
import { GameModeFullDTO } from 'src/app/models/interfaces/gamemode/response/GameModeFullDTO';
import { GameModeMinDTO } from 'src/app/models/interfaces/gamemode/response/GameModeMinDTO';
import { PlayerFullScoreDTO } from 'src/app/models/interfaces/gamemode/response/PlayerFullScoreDTO';
import { GameModePositionDTO } from './../../models/interfaces/gamemode/response/GameModePositonDTO';

@Injectable({
  providedIn: 'root'
})
export class GameModeService {

    private readonly API_URL: string = environment.API_URL;

    public gameModeView$: Subject<boolean> = new Subject();

    constructor (
        private httpClient: HttpClient
    ) {
        this.gameModeView$.next(false);
    }

    public findAll(): Observable<GameModeMinDTO[]> {
        return this.httpClient.get<GameModeMinDTO[]> (
            `${this.API_URL}/gamemodes`
        );
    }

    public findFullById(id: number): Observable<GameModeFullDTO> {
        return this.httpClient.get<GameModeFullDTO> (
            `${this.API_URL}/gamemodes/${id}/full`
        );
    }

    public findGameModePositions(id: number): Observable<GameModePositionDTO[]> {
        return this.httpClient.get<GameModePositionDTO[]> (
            `${this.API_URL}/gamemodes/${id}/positions`
        );
    }

    public getRanking(gameModeId: number, positionId: number): Observable<PlayerFullScoreDTO[]> {
        return this.httpClient.get<PlayerFullScoreDTO[]> (
            `${this.API_URL}/gamemodes/ranking?gameModeId=${gameModeId}&positionId=${positionId}`
        );
    }

}
