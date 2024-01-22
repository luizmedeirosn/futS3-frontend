import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss']
})
export class SigninComponent {

    public signinForm = this.formBuilder.group({
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
    });

    public constructor(
        private formBuilder: FormBuilder
    ) { }

    public onSubmitSigninForm(): void {
        throw new Error('Method not implemented.');
    }

}
