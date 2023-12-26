import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment.prod';
import { PostParameterDTO } from 'src/app/models/dto/parameter/request/PostParameterDTO';
import { ParameterDTO } from 'src/app/models/dto/parameter/response/ParameterDTO';

@Injectable({
    providedIn: 'root'
})
export class ParameterService {

    private readonly API_URL: string = environment.API_URL;
    private $changesOn: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public constructor(
        private httpClient: HttpClient
    ) {
    }

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

    public findAll(): Observable<ParameterDTO[]> {
        return this.httpClient.get<ParameterDTO[]>(
            `${this.API_URL}/parameters`
        );
    }

    public save(parameterRequest: PostParameterDTO): Observable<ParameterDTO> {
        return this.httpClient.post<ParameterDTO>(
            `${this.API_URL}/parameters`,
            parameterRequest
        );
    }

}
