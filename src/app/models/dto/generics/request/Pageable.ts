export default class Pageable {

    public indexFirstRow: number = this.pageNumber * this.pageSize;
    public keyword: string = '';

    constructor(
        public pageNumber: number,
        public pageSize: number,
        public sortField: string,
        public sortDirection: number,
    ) {
    }

    public keywordIsValid(): boolean {
        return this.keyword.trim().length > 0;
    }
}
