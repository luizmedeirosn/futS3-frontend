import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment.prod';
import { PositionRequestDTO } from 'src/app/models/dto/position/request/PositionRequestDTO';
import { PositionDTO } from 'src/app/models/dto/position/response/PositionDTO';
import { PositionMinDTO } from 'src/app/models/dto/position/response/PositionMinDTO';

@Injectable({
    providedIn: 'root'
})
export class PositionService {

    private readonly API_URL: string = environment.API_URL;

    public readonly $positionView: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public changedPositionId!: number | undefined;

    public constructor(
        private httpClient: HttpClient
    ) { }

    public findAll(): Observable<Array<PositionMinDTO>> {
        return this.httpClient.get<Array<PositionMinDTO>>(
            `${this.API_URL}/positions`,
        );
    }

    public findAllWithParameters(): Observable<Array<PositionDTO>> {
        return this.httpClient.get<Array<PositionDTO>>(
            `${this.API_URL}/positions/parameters`,
        );
    }

    public findByIdWithParameters(id: number): Observable<PositionDTO> {
        return this.httpClient.get<PositionDTO>(
            `${this.API_URL}/positions/${id}/parameters`
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

