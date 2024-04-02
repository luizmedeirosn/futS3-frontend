import { PositionMinDTO } from "../../position/response/PositionMinDTO";
import { PlayerParameterDataDTO } from "./PlayerParameterDataDTO";

export interface PlayerFullDTO {

    id: number;
    name: string;
    age: number;
    height: number;
    team: string;
    pictureUrl: string;
    position: PositionMinDTO;
    parameters: Array<PlayerParameterDataDTO>

}
