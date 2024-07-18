import { EnumPlayerEventsCrud } from 'src/app/models/enums/EnumPlayerEventsCrud';

export interface EditOrDeletePlayerAction {
  id: number;
  action: EnumPlayerEventsCrud;
}
