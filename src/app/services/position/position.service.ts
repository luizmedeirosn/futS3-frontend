import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/app/environments/environment.prod';
import { PositionDTO } from 'src/app/models/dto/position/response/PositionDTO';
import { PositionParametersDTO } from 'src/app/models/dto/position/response/PositionParametersDTO';

@Injectable({
    providedIn: 'root'
})
export class PositionService {

    private readonly API_URL: string = environment.API_URL;
    private $changesOn: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public $positionView: Subject<boolean> = new Subject();

    public constructor(
        private httpClient: HttpClient
    ) {
        this.$positionView.next(false);
    };

    public setChangesOn(status: boolean): void {
        if (status !== null && status !== undefined) {
            this.$changesOn.next(status);
        } else {
            console.error("Status is null or undefined");
        }
    }

    public getChangesOn(): BehaviorSubject<boolean> {
        return this.$changesOn;
    }

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
