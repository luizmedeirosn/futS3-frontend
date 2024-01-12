import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
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

    private $changesOn: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public changedPlayerId!: number;
    public changedPlayerPicture!: boolean;

    public $playerView: Subject<boolean> = new Subject();


    public constructor(
        private httpClient: HttpClient
    ) {
        this.$playerView.next(false);
    };

    public setChangesOn(status: boolean, changedPlayerId?: number): void {
        if (status !== null && status !== undefined) {
            this.$changesOn.next(status);
            changedPlayerId && (this.changedPlayerId = changedPlayerId);

        } else {
            console.error("Status is null or undefined");
        }
    }

    public getChangesOn(): BehaviorSubject<boolean> {
        return this.$changesOn;
    }

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
