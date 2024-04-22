export default class Pageable {
    constructor(
        public pageNumber: number,
        public pageSize: number,
        public sortField: string,
        public sortDirection: number
    ) { }
}
