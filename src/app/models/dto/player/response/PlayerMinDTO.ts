import { PositionMinDTO } from "../../position/response/PositionMinDTO";

interface Comparable<T> {
    compare(other: T): boolean;
}

export class PlayerMinDTO implements Comparable<PlayerMinDTO> {

    id: number;
    name: string;
    position: PositionMinDTO;
    profilePictureLink: string;

    public constructor(id: number, name: string, position: PositionMinDTO, profilePictureLink: string) {
        this.id = id;
        this.name = name;
        this.position = position;
        this.profilePictureLink = profilePictureLink;
    }

    public compare(other: PlayerMinDTO): boolean {
        return this.id === other.id;
    }
}
