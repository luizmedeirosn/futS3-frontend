import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-gamemode-view',
    templateUrl: './gamemode-view.component.html',
    styleUrls: ['./gamemode-view.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class GamemodeViewComponent {

    public obj = [
        {
            "positionId": 5,
            "positionName": "LATERAL ESQUERDO",
            "parameterId": 14,
            "parameterName": "POTÊNCIA DO CHUTE",
            "parameterWeight": 25
        },
        {
            "positionId": 5,
            "positionName": "LATERAL ESQUERDO",
            "parameterId": 15,
            "parameterName": "ACERTO DE PASSE",
            "parameterWeight": 25
        },
        {
            "positionId": 5,
            "positionName": "LATERAL ESQUERDO",
            "parameterId": 16,
            "parameterName": "DESARME",
            "parameterWeight": 25
        },
        {
            "positionId": 5,
            "positionName": "LATERAL ESQUERDO",
            "parameterId": 21,
            "parameterName": "CONDUÇÃO",
            "parameterWeight": 25
        },
        {
            "positionId": 11,
            "positionName": "MEIA-ATACANTE",
            "parameterId": 17,
            "parameterName": "ASSISTÊNCIA",
            "parameterWeight": 20
        },
        {
            "positionId": 11,
            "positionName": "MEIA-ATACANTE",
            "parameterId": 19,
            "parameterName": "AGILIDADE",
            "parameterWeight": 20
        },
        {
            "positionId": 11,
            "positionName": "MEIA-ATACANTE",
            "parameterId": 20,
            "parameterName": "ACELERAÇÃO",
            "parameterWeight": 30
        },
        {
            "positionId": 11,
            "positionName": "MEIA-ATACANTE",
            "parameterId": 21,
            "parameterName": "CONDUÇÃO",
            "parameterWeight": 30
        },
        {
            "positionId": 14,
            "positionName": "ATACANTE",
            "parameterId": 15,
            "parameterName": "ACERTO DE PASSE",
            "parameterWeight": 10
        },
        {
            "positionId": 14,
            "positionName": "ATACANTE",
            "parameterId": 21,
            "parameterName": "CONDUÇÃO",
            "parameterWeight": 40
        },
        {
            "positionId": 14,
            "positionName": "ATACANTE",
            "parameterId": 25,
            "parameterName": "FINALIZAÇÃO",
            "parameterWeight": 50
        }
    ]

}
