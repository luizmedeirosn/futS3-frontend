import { EnumPositionEventsCrud } from "src/app/models/enums/EnumPositionEventsCrud";

export interface EditOrDeletePositionAction {

    id: number;
    action: EnumPositionEventsCrud;
}
