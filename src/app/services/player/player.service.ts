import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment.prod';
import { FindAllPlayersDTO } from 'src/app/models/interfaces/player/response/FindAllPlayersDTO';

@Injectable({
    providedIn: 'root'
})
export class PlayerService {

    private readonly API_URL: string = environment.API_URL;

    constructor (
        private httpClient: HttpClient
    ) {
    };

    public findAllPlayers(): Observable<Array<FindAllPlayersDTO>> {
        return this.httpClient.get<Array<FindAllPlayersDTO>> (
            `${this.API_URL}/players`,
        );
    }
}
