import {
    HttpClient,
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpHeaders,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment.prod';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    private readonly API_URL = environment.API_URL;

    public static accessToken = '';
    public static refreshToken = '';
    private refresh = false;

    public constructor(
        private http: HttpClient,
        private cookieService: CookieService,
        private authService: AuthService,

    ) {
        AuthInterceptor.accessToken = this.cookieService.get('_accessToken');
        AuthInterceptor.refreshToken = this.cookieService.get('_refreshToken');
    }

    public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (request.url === `${this.API_URL}/auth/signin`) {
            return next.handle(request);
        }

        const clone = request.clone({
            setHeaders: {
                Authorization: `Bearer ${AuthInterceptor.accessToken}`
            }
        });

        return next.handle(clone).pipe(catchError((err: HttpErrorResponse) => {
            if (err.status === 403 && !this.refresh) {
                this.refresh = true;

                return this.http.put(`${this.API_URL}/auth/refresh-token`, {}, {
                    headers: new HttpHeaders({
                        Authorization: `Bearer ${AuthInterceptor.refreshToken}`
                    })
                }).pipe(
                    switchMap((response: any) => {
                        AuthInterceptor.accessToken = response.accessToken;

                        return next.handle(clone.clone({
                            setHeaders: {
                                Authorization: `Bearer ${AuthInterceptor.accessToken}`
                            }
                        }));
                    }),
                    catchError((refreshErr: any) => {
                        this.refresh = false;
                        this.authService.logout(true);
                        return throwError(() => refreshErr);
                    })
                );
            }
            this.refresh = false;
            return throwError(() => err);
        }));
    }
}
