import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FindAllParametersDTO } from 'src/app/models/interfaces/parameters/response/FindAllParametersDTO';

@Component({
  selector: 'app-parameters-table',
  templateUrl: './parameters-table.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})
export class ParametersTableComponent {

    @Input()
    public parameters: FindAllParametersDTO[] = [];

}
