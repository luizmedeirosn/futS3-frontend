import { ParameterWeightDTO } from '../aux/ParameterWeightDTO';

export interface PositionDTO {
  id: number;
  name: string;
  description: string;
  parameters: ParameterWeightDTO[];
}
