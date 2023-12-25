import { PositionDTO } from "../../position/response/PositionDTO";
import { PlayerParameterScoreDTO } from "./PlayerParameterScoreDTO";

export interface PlayerFullDTO {

    id: number;
    name: string;
    age: number;
    height: number;
    position: PositionDTO;
    profilePictureLink: string;
    team: string;
    parameters: Array<PlayerParameterScoreDTO>

}
