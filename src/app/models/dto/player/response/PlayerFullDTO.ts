import { PositionMinDTO } from "../../position/response/PositionMinDTO";
import { PlayerParameterScoreDTO } from "./PlayerParameterScoreDTO";

export interface PlayerFullDTO {

    id: number;
    name: string;
    age: number;
    height: number;
    position: PositionMinDTO;
    profilePictureLink: string;
    team: string;
    parameters: Array<PlayerParameterScoreDTO>

}
