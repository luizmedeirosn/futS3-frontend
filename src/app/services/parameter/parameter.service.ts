import { Observable } from 'rxjs';
import { FindAllParametersDTO } from 'src/app/models/interfaces/parameters/response/FindAllParametersDTO';
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

    public findAllParameters(): Observable<FindAllParametersDTO[]> {
        return this.httpClient.get<FindAllParametersDTO[]>(
            `${this.API_URL}/parameters`
        );
    }

}
