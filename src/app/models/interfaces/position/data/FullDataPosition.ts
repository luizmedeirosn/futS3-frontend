import { PositionParametersDTO } from "../response/PositionParametersDTO";

export interface FullDataPosition {

    id: number;
    name: string;
    description: string;
    parameters: Array<PositionParametersDTO>;

}
