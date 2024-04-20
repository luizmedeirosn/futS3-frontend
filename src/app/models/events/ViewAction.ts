import {TableLazyLoadEvent} from "primeng/table";

export interface ViewAction {

    id: number;
    name?: string;
    description?: string;
    tableLazyLoadEventPreview?: TableLazyLoadEvent;
}
