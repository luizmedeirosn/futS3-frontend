import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { AuthService } from '../../services/auth/auth.service';

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

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url === `${this.API_URL}/auth/signin` || request.url === `${this.API_URL}/auth/refresh-token`) {
      return next.handle(request);
    }

    const clone = request.clone({
      setHeaders: {
        Authorization: `Bearer ${AuthInterceptor.accessToken}`,
      },
    });

    return next.handle(clone).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 403 && !this.refresh) {
          this.refresh = true;

          return this.http
            .put(
              `${this.API_URL}/auth/refresh-token`,
              {},
              {
                headers: new HttpHeaders({
                  Authorization: `Bearer ${AuthInterceptor.refreshToken}`,
                }),
              },
            )
            .pipe(
              switchMap((response: any) => {
                this.cookieService.set('_accessToken', response.accessToken);
                AuthInterceptor.accessToken = response.accessToken;

                return next.handle(
                  request.clone({
                    setHeaders: {
                      Authorization: `Bearer ${AuthInterceptor.accessToken}`,
                    },
                  }),
                );
              }),
              catchError((refreshErr: any) => {
                this.refresh = false;
                this.authService.logout(true);
                return throwError(() => refreshErr);
              }),
            );
        }

        this.refresh = false;
        return throwError(() => err);
      }),
    );
  }
}
