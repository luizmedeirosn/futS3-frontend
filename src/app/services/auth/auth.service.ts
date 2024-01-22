import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { SigninRequestDTO } from 'src/app/models/dto/auth/SigninRequestDTO';
import { SigninResponseDTO } from 'src/app/models/dto/auth/SigninResponseDTO';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly API_URL = environment.API_URL;

    public constructor(
        private httpClient: HttpClient,
        private cookieService: CookieService,
        private router: Router,
    ) { }

    public signin(signin: SigninRequestDTO): Observable<SigninResponseDTO> {
        return this.httpClient.post<SigninResponseDTO>(
            `${this.API_URL}/auth/signin`,
            signin
        );
    }

    public refreshAccessToken(): Observable<SigninResponseDTO> {
        return this.httpClient.put<SigninResponseDTO>(
            `${this.API_URL}/auth/refresh-token`,
            '',
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.cookieService.get('REFRESH_ACCESS_TOKEN')}`
                }),
            }
        );
    }

    public isLoggedIn(): boolean {
        return !!this.cookieService.get('ACCESS_TOKEN');
    }

    public logout(): void {
        this.cookieService.deleteAll();
        this.router.navigate(['/home']);
    }

}
