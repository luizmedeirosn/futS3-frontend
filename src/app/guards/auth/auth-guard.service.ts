import { Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService {

    public constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    public canActivate():
        Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | UrlTree | boolean {
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/home']).then(r => {})
            return false;

        } else {
            return true;
        }
    }
}
