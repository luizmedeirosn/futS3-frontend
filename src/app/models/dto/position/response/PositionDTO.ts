import { ParameterWeightDTO } from "../data/ParameterWeightDTO";

export interface PositionDTO {

    id: number;
    name: string;
    description: string;
    parameters: Array<ParameterWeightDTO>;

}
