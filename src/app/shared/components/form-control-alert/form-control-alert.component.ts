import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-form-control-alert',
    templateUrl: './form-control-alert.component.html',
    styleUrls: ['./form-control-alert.component.scss'],
})
export class FormControlAlertComponent {
    @Input()
    public form!: any;

    @Input()
    public controlName!: string;

    @Input()
    public minNumberCharacters!: number;

    @Input()
    public maxNumberCharacters!: number;
}
