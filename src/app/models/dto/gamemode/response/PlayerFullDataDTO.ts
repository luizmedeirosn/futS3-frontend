import PlayerParameterDataDTO from "../../player/aux/PlayerParameterDataDTO";

export interface PlayerFullDataDTO {

    id: number;
    name: string;
    age: number;
    height: number;
    team: string;
    totalScore: number;
    pictureUrl: string;
    parameters: PlayerParameterDataDTO[];
}
