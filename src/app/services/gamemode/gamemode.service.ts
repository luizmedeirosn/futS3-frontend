import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment.prod';
import { GameModeMinDTO } from 'src/app/models/interfaces/gamemode/response/GameModeMinDTO';

@Injectable({
  providedIn: 'root'
})
export class GameModeService {

    private readonly API_URL: string = environment.API_URL;

    constructor (
        private httpClient: HttpClient
    ) {
    }

    public findAll(): Observable<GameModeMinDTO[]> {
        return this.httpClient.get<GameModeMinDTO[]> (
            `${this.API_URL}/gamemodes`
        );
    }

}
