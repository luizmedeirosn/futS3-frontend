import { Observable } from 'rxjs';
import { ParameterDTO } from 'src/app/models/interfaces/parameter/response/ParameterDTO';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ParameterService {

    private readonly API_URL: string = environment.API_URL;

    constructor(
        private httpClient: HttpClient
    ) {
    }

    public findAll(): Observable<ParameterDTO[]> {
        return this.httpClient.get<ParameterDTO[]>(
            `${this.API_URL}/parameters`
        );
    }

}
