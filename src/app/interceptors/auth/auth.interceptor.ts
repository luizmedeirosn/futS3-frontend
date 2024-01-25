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

    public static ACCESS_TOKEN = '';
    public static REFRESH_ACCESS_TOKEN = '';
    private refresh = false;

    public constructor(
        private http: HttpClient,
        private cookieService: CookieService,
        private authService: AuthService,

    ) {
        AuthInterceptor.ACCESS_TOKEN = this.cookieService.get('ACCESS_TOKEN');
        AuthInterceptor.REFRESH_ACCESS_TOKEN = this.cookieService.get('REFRESH_ACCESS_TOKEN');
    }

    public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

        if (request.url === `${this.API_URL}/auth/signin`) {
            return next.handle(request);
        }

        const clone = request.clone({
            setHeaders: {
                Authorization: `Bearer ${AuthInterceptor.ACCESS_TOKEN}`
            }
        });

        return next.handle(clone).pipe(catchError((err: HttpErrorResponse) => {
            if (err.status === 403 && !this.refresh) {
                this.refresh = true;

                return this.http.put('http://localhost:8080/auth/refresh-token', {}, {
                    headers: new HttpHeaders({
                        Authorization: `Bearer ${AuthInterceptor.REFRESH_ACCESS_TOKEN}`
                    })
                }).pipe(
                    switchMap((res: any) => {
                        AuthInterceptor.ACCESS_TOKEN = res.ACCESS_TOKEN;

                        return next.handle(clone.clone({
                            setHeaders: {
                                Authorization: `Bearer ${AuthInterceptor.ACCESS_TOKEN}`
                            }
                        }));
                    }),
                    catchError((refreshErr: any) => {
                        this.refresh = false;
                        this.authService.logout();
                        return throwError(() => refreshErr);
                    })
                );
            }
            this.refresh = false;
            return throwError(() => err);
        }));
    }
}
