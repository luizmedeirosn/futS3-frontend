import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment.prod';
import { PostPlayerDTO } from 'src/app/models/dto/player/request/PostPlayerDTO';
import { UpdatePlayerDTO } from 'src/app/models/dto/player/request/UpdatePlayerDTO';
import { PlayerFullDTO } from 'src/app/models/dto/player/response/PlayerFullDTO';
import { PlayerMinDTO } from 'src/app/models/dto/player/response/PlayerMinDTO';

@Injectable({
    providedIn: 'root'
})
export class PlayerService {

    private readonly API_URL: string = environment.API_URL;

    public changedPlayerId!: number | undefined;
    public changedPlayerPicture!: boolean;

    public $playerView: BehaviorSubject<boolean> = new BehaviorSubject(false);


    public constructor(
        private httpClient: HttpClient
    ) {
        this.$playerView.next(false);
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
        body.set('positionId', playerRequest.positionId);
        playerRequest.age && body.set('age', playerRequest.age);
        playerRequest.height && body.set('height', playerRequest.height);
        playerRequest.playerPicture && body.set('playerPicture', playerRequest.playerPicture);

        const parameters = playerRequest.parameters.map(element => `${element.id} ${element.playerScore}`).join(',');
        body.set('parameters', parameters);

        return this.httpClient.post<PlayerFullDTO>(
            `${this.API_URL}/players`,
            body
        );
    }

    public update(playerRequest: UpdatePlayerDTO): Observable<PlayerFullDTO> {
        const body: FormData = new FormData();
        body.set('name', playerRequest.name);
        body.set('team', playerRequest.team);
        body.set('positionId', playerRequest.positionId);
        playerRequest.age && body.set('age', playerRequest.age);
        playerRequest.height && body.set('height', playerRequest.height);
        playerRequest.playerPicture && body.set('playerPicture', playerRequest.playerPicture);

        const parameters = playerRequest.parameters.map(element => `${element.id} ${element.playerScore}`).join(',');
        body.set('parameters', parameters);

        return this.httpClient.put<PlayerFullDTO>(
            `${this.API_URL}/players/${playerRequest.id}`,
            body
        );
    }

    public deleteById(id: number): Observable<void> {
        return this.httpClient.delete<void>(
            `${this.API_URL}/players/${id}`,
        );
    }

}
