import {PositionDTO} from "../../position/response/PositionDTO";

export interface GameModeDTO {

    id: number;
    formationName: string;
    description: string;
    positions: PositionDTO[];
}
