import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment.prod';
import { PositionDTO } from 'src/app/models/interfaces/position/response/PositionDTO';

@Injectable({
    providedIn: 'root'
})
export class PositionService {

    private readonly API_URL: string = environment.API_URL;

    constructor (
        private httpClient: HttpClient
    ) {
    };

    public findAll(): Observable<Array<PositionDTO>> {
        return this.httpClient.get<Array<PositionDTO>> (
            `${this.API_URL}/positions`,
        );
    }
}
