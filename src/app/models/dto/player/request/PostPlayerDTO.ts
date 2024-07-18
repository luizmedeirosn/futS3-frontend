import { PlayerParameterIdScoreDTO } from './PlayerParameterIdScoreDTO';

export interface PostPlayerDTO {
  name: string;
  team: string;
  age: string | undefined;
  height: string | undefined;
  positionId: string;
  playerPicture: File | undefined;
  parameters: Array<PlayerParameterIdScoreDTO>;
}
