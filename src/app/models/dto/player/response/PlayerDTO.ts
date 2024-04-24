import { PositionMinDTO } from "../../position/response/PositionMinDTO";
import PlayerParameterDataDTO from "../aux/PlayerParameterDataDTO";

export default interface PlayerDTO {

    id: number;
    name: string;
    age: number;
    height: number;
    team: string;
    pictureUrl: string;
    position: PositionMinDTO;
    parameters: Array<PlayerParameterDataDTO>
}
