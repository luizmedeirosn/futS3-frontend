import { PositionDTO } from "../../position/response/PositionDTO";
import { PlayerParameterScoreDTO } from "./PlayerParameterScoreDTO";

export interface PlayerFullDTO {

    id: number;
    name: string;
    position: PositionDTO;
    profilePictureLink: string;
    parameters: Array<PlayerParameterScoreDTO>

}
