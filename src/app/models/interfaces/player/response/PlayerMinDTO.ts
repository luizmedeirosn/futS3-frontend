import { PositionDTO } from "../../position/response/PositionDTO";

export interface PlayerMinDTO {

    id: number;
    name: string;
    position: PositionDTO;
    profilePictureLink: string;

}
