import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment.prod';
import { FindAllPlayers } from 'src/app/models/interfaces/player/response/FindAllPlayers';

@Injectable({
    providedIn: 'root'
})
export class PlayerService {

    private API_URL: string = environment.API_URL;

    constructor (
        private httpClient: HttpClient
    ) {
    };

    public findAllPlayers(): Observable<Array<FindAllPlayers>> {
        return this.httpClient.get<Array<FindAllPlayers>> (
            `${this.API_URL}/players`,
        );
    }
}
