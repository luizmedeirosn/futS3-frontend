import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { SigninRequestDTO } from 'src/app/models/dto/auth/SigninRequestDTO';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SigninResponseDTO } from '../../../../models/dto/auth/SigninResponseDTO';
import { AuthInterceptor } from 'src/app/interceptors/auth/auth.interceptor';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit, OnDestroy {

    private readonly $destroy: Subject<void> = new Subject();

    public $enabledSubmitButton: BehaviorSubject<boolean> = new BehaviorSubject(true);

    public signinForm = this.formBuilder.group({
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
    });

    public constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private cookieService: CookieService,
        private messageService: MessageService,
        private router: Router
    ) { }

    public ngOnInit(): void {
        this.messageService.clear();
        if (this.authService.isLoggedIn()) {
            this.router.navigate(['/gamemodes']).then(r => {});
        }
    }

    public onSubmitSigninForm(): void {
        if (this.signinForm.valid && this.signinForm.value) {
            this.authService.signin(this.signinForm.value as SigninRequestDTO)
                .pipe(takeUntil(this.$destroy))
                .subscribe({
                    next: (response: SigninResponseDTO) => {
                        if (response) {
                            this.cookieService.set('_accessToken', response.accessToken);
                            this.cookieService.set('_refreshToken', response.refreshToken);
                            AuthInterceptor.accessToken = response.accessToken;
                            AuthInterceptor.refreshToken = response.refreshToken;

                            this.messageService.clear();
                            this.messageService.add({
                                key: 'welcome-back',
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Welcome back!',
                                life: 3000
                            });

                            this.router.navigate(['/players']).then(r => {
                            });
                        }
                    },
                    error: (err) => {
                        console.log(err);

                        this.messageService.clear();
                        const message: string = err.status === 401 ? 'Invalid credentials!' : 'Unexpected error!'
                        this.messageService.add({
                            key: 'login-error',
                            severity: 'error',
                            summary: 'Error',
                            detail: message,
                            life: 3000
                        });
                    }
                });

            this.signinForm.reset();
            this.$enabledSubmitButton.next(false);
            setTimeout(() => this.$enabledSubmitButton.next(true), 3000);
        }
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

}
