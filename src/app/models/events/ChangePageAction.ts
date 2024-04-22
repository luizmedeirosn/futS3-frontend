export default interface ChangePageAction {

    pageNumber: number;
    pageSize: number;
    sortField?: string;
    sortDirection?: number;
}
