import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { ParameterRequestDTO } from 'src/app/models/dto/parameter/request/ParameterRequestDTO';
import { ParameterDTO } from 'src/app/models/dto/parameter/response/ParameterDTO';
import Page from '../../models/dto/generics/response/Page';
import Pageable from '../../models/dto/generics/request/Pageable';

@Injectable({
  providedIn: 'root',
})
export class ParameterService {
  private readonly API_URL: string = environment.API_URL;

  public constructor(private httpClient: HttpClient) {}

  public findAllWithTotalRecords(): Observable<Page<ParameterDTO>> {
    return this.httpClient.get<Page<ParameterDTO>>(`${this.API_URL}/parameters`);
  }

  public findAll(pageable: Pageable): Observable<Page<ParameterDTO>> {
    let queryParams = '';
    queryParams += `?_pageNumber=${pageable.pageNumber}`;
    queryParams += `&_pageSize=${pageable.pageSize}`;

    return this.httpClient.get<Page<ParameterDTO>>(`${this.API_URL}/parameters${queryParams}`);
  }

  public findById(id: number): Observable<ParameterDTO> {
    return this.httpClient.get<ParameterDTO>(`${this.API_URL}/parameters/${id}`);
  }

  public save(parameterRequest: ParameterRequestDTO): Observable<ParameterDTO> {
    return this.httpClient.post<ParameterDTO>(`${this.API_URL}/parameters`, parameterRequest);
  }

  public updateById(id: number, parameterRequest: ParameterRequestDTO): Observable<ParameterDTO> {
    return this.httpClient.put<ParameterDTO>(`${this.API_URL}/parameters/${id}`, parameterRequest);
  }

  public deleteById(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.API_URL}/parameters/${id}`);
  }
}
