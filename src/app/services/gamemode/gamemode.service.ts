import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {environment} from 'src/environments/environment.prod';
import {GameModeRequestDTO} from 'src/app/models/dto/gamemode/request/GameModeRequestDTO';
import {GameModeDTO} from 'src/app/models/dto/gamemode/response/GameModeDTO';
import {GameModeMinDTO} from 'src/app/models/dto/gamemode/response/GameModeMinDTO';
import {PlayerFullDataDTO} from 'src/app/models/dto/gamemode/response/PlayerFullDataDTO';
import Page from "../../models/dto/generics/response/Page";
import Pageable from "../../models/dto/generics/request/Pageable";

@Injectable({
    providedIn: 'root'
})
export class GameModeService {

    private readonly API_URL: string = environment.API_URL;

    public $gameModeView: Subject<boolean> = new Subject();

    public changedGameModeId!: number | undefined;
    public gameModeIdInPreview!: number | undefined;


    public constructor(
        private httpClient: HttpClient
    ) {
        this.$gameModeView.next(false);
    }

    public findAllWithTotalRecords(): Observable<Page<GameModeMinDTO>> {
        return this.httpClient.get<Page<GameModeMinDTO>>(
            `${this.API_URL}/gamemodes`
        );
    }

    public findAll(pageable: Pageable): Observable<Page<GameModeMinDTO>> {
        let queryParams = '';
        queryParams += `?_pageNumber=${pageable.pageNumber}`;
        queryParams += `&_pageSize=${pageable.pageSize}`;

        return this.httpClient.get<Page<GameModeMinDTO>>(
            `${this.API_URL}/gamemodes${queryParams}`
        );
    }

    public findById(id: number): Observable<GameModeDTO> {
        return this.httpClient.get<GameModeDTO>(
            `${this.API_URL}/gamemodes/${id}`
        );
    }

    public getPlayersRanking(gameModeId: number, positionId: number, pageable: Pageable): Observable<Page<PlayerFullDataDTO>> {
        let queryParams = '';
        queryParams += `?_gameModeId=${gameModeId}`;
        queryParams += `&_positionId=${positionId}`;
        queryParams += `&_pageNumber=${pageable.pageNumber}`;
        queryParams += `&_pageSize=${pageable.pageSize}`;

        return this.httpClient.get<Page<PlayerFullDataDTO>>(
            `${this.API_URL}/gamemodes/ranking${queryParams}`
        );
    }

    public save(gameModeRequest: GameModeRequestDTO): Observable<GameModeDTO> {
        return this.httpClient.post<GameModeDTO>(
            `${this.API_URL}/gamemodes`,
            gameModeRequest
        );
    }

    public updateById(id: number, gameModeRequest: GameModeRequestDTO): Observable<GameModeDTO> {
        return this.httpClient.put<GameModeDTO>(
            `${this.API_URL}/gamemodes/${id}`,
            gameModeRequest
        );
    }

    public deleteById(id: number): Observable<void> {
        return this.httpClient.delete<void>(
            `${this.API_URL}/gamemodes/${id}`
        );
    }
}
