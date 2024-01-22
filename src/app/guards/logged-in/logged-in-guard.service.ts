import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class LoggedInGuardService {

    public constructor(
        private authService: AuthService,
        private router: Router
    ) {
    }

    public canActivate():
        Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | UrlTree | boolean {
        if (!this.authService.isLoggedIn()) {
            return true;

        } else {
            this.router.navigate(['/gamemodes']);
            return false;
        }
    }

}
