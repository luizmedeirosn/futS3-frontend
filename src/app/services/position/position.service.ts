import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/app/environments/environment.prod';
import { PositionDTO } from 'src/app/models/dto/position/response/PositionDTO';
import { PositionParametersDTO } from 'src/app/models/dto/position/response/PositionParametersDTO';

@Injectable({
    providedIn: 'root'
})
export class PositionService {

    private readonly API_URL: string = environment.API_URL;

    public positionView$: Subject<boolean> = new Subject();

    constructor(
        private httpClient: HttpClient
    ) {
        this.positionView$.next(false);
    };

    public findAll(): Observable<Array<PositionDTO>> {
        return this.httpClient.get<Array<PositionDTO>>(
            `${this.API_URL}/positions`,
        );
    }

    public findPositionParametersById(id: number): Observable<PositionParametersDTO[]> {
        return this.httpClient.get<PositionParametersDTO[]>(
            `${this.API_URL}/positions/${id}/parameters`
        );
    }
}
