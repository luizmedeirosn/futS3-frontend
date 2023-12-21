import { PlayerParameterScoreDTO } from "../response/PlayerParameterScoreDTO";

export interface UpdatePlayerDTO {

    id: number;
    name: string;
    team: string;
    age: string;
    height: string;
    positionId: string;
    playerPicture: File;
    parameters: Array<PlayerParameterScoreDTO>

}
