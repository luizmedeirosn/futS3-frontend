import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment.prod';
import { GameModeDTO } from 'src/app/models/interfaces/gamemode/response/GameModeDTO';

@Injectable({
  providedIn: 'root'
})
export class GameModeService {

    private readonly API_URL: string = environment.API_URL;

    constructor (
        private httpClient: HttpClient
    ) {
    }

    public findAllGameModes(): Observable<GameModeDTO[]> {
        return this.httpClient.get<GameModeDTO[]> (
            `${this.API_URL}/gamemodes`
        );
    }

}
