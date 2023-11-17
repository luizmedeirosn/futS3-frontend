import { PlayerParameterScoreDTO } from "../../player/response/PlayerParameterScoreDTO";

export interface PlayerFullScoreDTO {

    id: number;
    name: string;
    profilePictureLink: string;
    age: number;
    height: number;
    team: string;
    totalScore: number;
    parameters: PlayerParameterScoreDTO[];

}
