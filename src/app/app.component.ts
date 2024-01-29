import { Component, OnInit } from '@angular/core';

import { PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: []
})
export class AppComponent implements OnInit {

    public title = 'futS3-frontend';

    public constructor(
        private primeNGConfig: PrimeNGConfig,
    ) {
    }

    public ngOnInit() {
        this.primeNGConfig.ripple = true;
    }

}
