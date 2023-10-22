import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/app/environments/environment.prod';
import { PlayerFullDTO } from 'src/app/models/interfaces/player/response/PlayerFullDTO';
import { PlayerMinDTO } from 'src/app/models/interfaces/player/response/PlayerMinDTO';

@Injectable({
    providedIn: 'root'
})
export class PlayerService {

    private readonly API_URL: string = environment.API_URL;

    public playerView$: Subject<boolean> = new Subject<boolean>();

    constructor (
        private httpClient: HttpClient
    ) {
        this.playerView$.next(false);
    };

    public findAll(): Observable<Array<PlayerMinDTO>> {
        return this.httpClient.get<Array<PlayerMinDTO>> (
            `${this.API_URL}/players`,
        );
    }

    public findFullById(id: number): Observable<PlayerFullDTO> {
        return this.httpClient.get<PlayerFullDTO> (
            `${this.API_URL}/players/${id}/full`,
        );
    }

}
