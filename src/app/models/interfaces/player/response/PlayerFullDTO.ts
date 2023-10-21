import { PositionDTO } from "../../position/response/PositionDTO";
import { PlayerParameterScoreDTO } from "./PlayerParameterScoreDTO";

export interface PlayerFullDTO {

    id: number;
    name: string;
    position: PositionDTO;
    parameters: Array<PlayerParameterScoreDTO>

}
