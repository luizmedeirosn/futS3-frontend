import { PlayerParameterDataDTO } from "../../player/response/PlayerParameterDataDTO";

export interface PlayerFullScoreDTO {

    id: number;
    name: string;
    age: number;
    height: number;
    team: string;
    totalScore: number;
    pictureUrl: string;
    parameters: PlayerParameterDataDTO[];
}
