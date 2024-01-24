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

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    public static ACCESS_TOKEN = '';
    public static REFRESH_ACCESS_TOKEN = '';
    private refresh = false;

    constructor(private http: HttpClient, private cookieService: CookieService) {
        AuthInterceptor.ACCESS_TOKEN = this.cookieService.get('ACCESS_TOKEN');
        AuthInterceptor.REFRESH_ACCESS_TOKEN = this.cookieService.get('REFRESH_ACCESS_TOKEN');
        console.log(AuthInterceptor.ACCESS_TOKEN);
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        console.log('token', AuthInterceptor.ACCESS_TOKEN);

        const req = request.clone({
            setHeaders: {
                Authorization: `Bearer ${AuthInterceptor.ACCESS_TOKEN}`
            }
        });

        return next.handle(req).pipe(catchError((err: HttpErrorResponse) => {
            if (err.status === 401 && !this.refresh) {
                this.refresh = true;

                console.log('refresh token', AuthInterceptor.REFRESH_ACCESS_TOKEN);
                return this.http.put('http://localhost:8080/auth/refresh-token', {}, {
                    headers: new HttpHeaders({
                        Authorization: `Bearer ${AuthInterceptor.REFRESH_ACCESS_TOKEN}`
                    })
                }).pipe(
                    switchMap((res: any) => {
                        console.log('new access token', res.ACCESS_TOKEN);
                        AuthInterceptor.ACCESS_TOKEN = res.ACCESS_TOKEN;

                        return next.handle(request.clone({
                            setHeaders: {
                                Authorization: `Bearer ${AuthInterceptor.ACCESS_TOKEN}`
                            }
                        }));
                    }),
                    catchError((refreshErr: any) => {
                        this.refresh = false;
                        return throwError(() => refreshErr);
                    })
                );
            }
            this.refresh = false;
            return throwError(() => err);
        }));
    }
}
