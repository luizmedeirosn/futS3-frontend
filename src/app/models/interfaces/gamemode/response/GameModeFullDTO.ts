export interface GameModeFullDTO {

    id: number;
    formationName: string;
    description: string;
    fields: Array<
        {
            positionId: number;
            positionName: string;
            parameterId: number;
            parameterName: string;
            parameterWeight: number;
        }
    >;

}
