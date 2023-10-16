import { Observable } from 'rxjs';
import { ParameterMinDTO } from 'src/app/models/interfaces/parameters/response/ParameterMinDTO';
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

    public findAllParameters(): Observable<ParameterMinDTO[]> {
        return this.httpClient.get<ParameterMinDTO[]>(
            `${this.API_URL}/parameters`
        );
    }

}
