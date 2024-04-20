export default interface PageMin<T> {
    content: T[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
}
