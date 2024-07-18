import { ParameterWeightDTO } from './ParameterWeightDTO';

export interface FullDataPosition {
  id: number;
  name: string;
  description: string;
  parameters: Array<ParameterWeightDTO>;
}
