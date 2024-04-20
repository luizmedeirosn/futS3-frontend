import { PositionMinDTO } from "../../position/response/PositionMinDTO";

export default interface PlayerMinDTO {

    id: number;
    name: string;
    pictureUrl: string;
    position: PositionMinDTO;
}
