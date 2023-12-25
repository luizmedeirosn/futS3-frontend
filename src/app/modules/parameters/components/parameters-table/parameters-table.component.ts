import { Component, Input } from '@angular/core';
import { ParameterDTO } from 'src/app/models/dto/parameter/response/ParameterDTO';

@Component({
  selector: 'app-parameters-table',
  templateUrl: './parameters-table.component.html',
  styleUrls: []
})
export class ParametersTableComponent {

  @Input()
  public parameters!: ParameterDTO[];

}
