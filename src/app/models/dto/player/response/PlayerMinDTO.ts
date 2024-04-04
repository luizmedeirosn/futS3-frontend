import { PositionMinDTO } from "../../position/response/PositionMinDTO";

export interface PlayerMinDTO {

    id: number;
    name: string;
    position: PositionMinDTO;
    pictureUrl: string;
}
