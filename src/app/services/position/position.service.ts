import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {environment} from 'src/environments/environment.prod';
import {PositionRequestDTO} from 'src/app/models/dto/position/request/PositionRequestDTO';
import {PositionDTO} from 'src/app/models/dto/position/response/PositionDTO';
import PositionMinDTO from 'src/app/models/dto/position/response/PositionMinDTO';
import Page from "../../models/dto/generics/response/Page";
import Pageable from "../../models/dto/generics/request/Pageable";

@Injectable({
    providedIn: 'root'
})
export class PositionService {

    private readonly API_URL: string = environment.API_URL;

    public positionView$!: Subject<boolean>;

    public changedPositionId!: number | undefined;

    public constructor(
        private httpClient: HttpClient
    ) {
        this.positionView$ = new Subject<boolean>();
        this.positionView$.next(false);
    }

    public findAllWithTotalRecords(): Observable<Page<PositionMinDTO>> {
        return this.httpClient.get<Page<PositionMinDTO>>(`${this.API_URL}/positions`);
    }

    public findAll(pageable: Pageable): Observable<Page<PositionMinDTO>> {
        let queryParams = '';
        queryParams += `?_pageNumber=${pageable.pageNumber}`;
        queryParams += `&_pageSize=${pageable.pageSize}`;

        return this.httpClient.get<Page<PositionMinDTO>>(
            `${this.API_URL}/positions${queryParams}`
        );
    }

    public findById(id: number): Observable<PositionDTO> {
        return this.httpClient.get<PositionDTO>(
            `${this.API_URL}/positions/${id}`
        );
    }

    public save(positionRequest: PositionRequestDTO): Observable<PositionMinDTO> {
        return this.httpClient.post<PositionMinDTO>(
            `${this.API_URL}/positions`,
            positionRequest
        );
    }

    public updateById(id: number, positionRequest: PositionRequestDTO): Observable<PositionMinDTO> {
        return this.httpClient.put<PositionMinDTO>(
            `${this.API_URL}/positions/${id}`,
            positionRequest
        );
    }

    public deleteById(id: number): Observable<void> {
        return this.httpClient.delete<void>(
            `${this.API_URL}/positions/${id}`
        );
    }

}

