import { EnumGameModeEventsCrud } from "src/app/models/enums/EnumGameModeEventsCrud";

export interface EditOrDeleteGameModeAction {

    id: number;
    action: EnumGameModeEventsCrud;

}
