import { ParameterWeightDTO } from "../data/ParameterWeightDTO";

export interface PositionRequestDTO {

    name: string;
    description: string;
    parameters: Array<ParameterWeightDTO>;

}
