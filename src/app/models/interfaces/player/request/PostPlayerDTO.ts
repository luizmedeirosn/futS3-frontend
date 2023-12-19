import { PlayerParameterScoreDTO } from "../response/PlayerParameterScoreDTO";

export interface PostPlayerDTO {

    name: string;
    team: string;
    age: string;
    height: string;
    positionId: string;
    playerPicture: File;
    parameters: Array<PlayerParameterScoreDTO>

}
