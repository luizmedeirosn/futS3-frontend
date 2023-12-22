import { PostPlayerDTO } from 'src/app/models/interfaces/player/request/PostPlayerDTO';
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

    public playerView$: Subject<boolean> = new Subject();

    public constructor(
        private httpClient: HttpClient
    ) {
        this.playerView$.next(false);
    };

    public findAll(): Observable<Array<PlayerMinDTO>> {
        return this.httpClient.get<Array<PlayerMinDTO>>(
            `${this.API_URL}/players`,
        );
    }

    public findFullById(id: number): Observable<PlayerFullDTO> {
        return this.httpClient.get<PlayerFullDTO>(
            `${this.API_URL}/players/${id}/full`,
        );
    }

    public save(playerRequest: PostPlayerDTO): Observable<PlayerFullDTO> {

        const body: FormData = new FormData();
        body.set('name', playerRequest.name);
        body.set('team', playerRequest.team);
        playerRequest.age && body.set('age', playerRequest.age);
        playerRequest.height && body.set('height', playerRequest.height);
        body.set('positionId', playerRequest.positionId);
        body.set('playerPicture', playerRequest.playerPicture);

        const parameters = playerRequest.parameters.map(element => `${element.id} ${element.playerScore}`).join(',');
        body.set('parameters', parameters);

        console.log(body.get('parameters'));

        return this.httpClient.post<PlayerFullDTO>(
            `${this.API_URL}/players`,
            body
        );
    }

}
