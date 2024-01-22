import { CookieService } from 'ngx-cookie-service';
import { SigninResponseDTO } from './../../../../models/dto/auth/SigninResponseDTO';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { SigninRequestDTO } from 'src/app/models/dto/auth/SigninRequestDTO';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnDestroy {

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

    public onSubmitSigninForm(): void {
        if (this.signinForm.valid && this.signinForm.value) {
            this.authService.signin(this.signinForm.value as SigninRequestDTO)
                .pipe(takeUntil(this.$destroy))
                .subscribe({
                    next: (response: SigninResponseDTO) => {
                        if (response) {
                            this.cookieService.set('ACCESS_TOKEN', response.ACCESS_TOKEN);
                            this.cookieService.set('REFRESH_ACCESS_TOKEN', response.REFRESH_ACCESS_TOKEN);
                            this.signinForm.reset();
                            this.router.navigate(['/gamemodes']);
                        }
                    },
                    error: (err) => {
                        console.log(err);
                        this.messageService.clear();

                        const message: string = err.status === 403 ? 'Invalid credentials!' : 'Unexpected error!'
                        this.messageService.add({
                            key: 'login-error',
                            severity: 'error',
                            summary: 'Error',
                            detail: message,
                            life: 5000
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
