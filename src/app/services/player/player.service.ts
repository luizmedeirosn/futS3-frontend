import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { PostPlayerDTO } from 'src/app/models/dto/player/request/PostPlayerDTO';
import { UpdatePlayerDTO } from 'src/app/models/dto/player/request/UpdatePlayerDTO';
import { PlayerFullDTO } from 'src/app/models/dto/player/response/PlayerDTO';
import { PlayerMinDTO } from 'src/app/models/dto/player/response/PlayerMinDTO';

@Injectable({
    providedIn: 'root'
})
export class PlayerService {

    private readonly API_URL: string = environment.API_URL;

    public changedPlayerId!: number | undefined;
    public changedPlayerPicture!: boolean;

    public $playerView: Subject<boolean> = new Subject();


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

    public findById(id: number): Observable<PlayerFullDTO> {
        return this.httpClient.get<PlayerFullDTO>(
            `${this.API_URL}/players/${id}`,
        );
    }

    public save(playerRequest: PostPlayerDTO): Observable<PlayerFullDTO> {
        const body = this.convertPlayerRequestToFormData(playerRequest);
        return this.httpClient.post<PlayerFullDTO>(
            `${this.API_URL}/players`,
            body
        );
    }

    public update(playerRequest: UpdatePlayerDTO): Observable<PlayerFullDTO> {
        const body = this.convertPlayerRequestToFormData(playerRequest);
        return this.httpClient.put<PlayerFullDTO>(
            `${this.API_URL}/players/${playerRequest.id}`,
            body
        );
    }

    private convertPlayerRequestToFormData(playerRequest: PostPlayerDTO | UpdatePlayerDTO) : FormData {
        const body: FormData = new FormData();
        body.set('name', playerRequest.name);
        body.set('team', playerRequest.team);
        body.set('positionId', playerRequest.positionId);
        playerRequest.age && body.set('age', playerRequest.age);
        playerRequest.height && body.set('height', playerRequest.height);
        playerRequest.playerPicture && body.set('playerPicture', playerRequest.playerPicture);

        const parametersJson = JSON.stringify(playerRequest.parameters);
        body.set('parameters', parametersJson);

        return body;
    }

    public deleteById(id: number): Observable<void> {
        return this.httpClient.delete<void>(
            `${this.API_URL}/players/${id}`,
        );
    }

}
