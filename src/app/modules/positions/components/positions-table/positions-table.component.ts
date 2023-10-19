import { Component, Input } from '@angular/core';
import { PositionDTO } from 'src/app/models/interfaces/position/response/PositionDTO';

@Component({
  selector: 'app-positions-table',
  templateUrl: './positions-table.component.html',
  styleUrls: []
})
export class PositionsTableComponent {

    @Input()
    public positions: PositionDTO[] = [];

}
