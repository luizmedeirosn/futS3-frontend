import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ParameterMinDTO } from 'src/app/models/interfaces/parameters/response/ParameterMinDTO';

@Component({
  selector: 'app-parameters-table',
  templateUrl: './parameters-table.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})
export class ParametersTableComponent {

    @Input()
    public parameters: ParameterMinDTO[] = [];

}
