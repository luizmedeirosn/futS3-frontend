import { ParameterWeightDTO } from '../aux/ParameterWeightDTO';

export interface PositionRequestDTO {
  name: string;
  description: string;
  parameters: Array<ParameterWeightDTO>;
}
