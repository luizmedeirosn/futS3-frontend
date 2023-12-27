import { ParameterIdWeightDTO } from "./ParameterWeightDTO";

export interface PositionRequestDTO {

    name: string;
    description: string;
    parameters: Array<ParameterIdWeightDTO>;

}
