export default class Pageable {

    public indexFirstRow: number = this.pageNumber * this.pageSize;

    constructor(
        public keyword: string,
        public pageNumber: number,
        public pageSize: number,
        public sortField?: string,
        public sortDirection?: number
    ) {
    }

    public keywordIsValid(): boolean {
        return this.keyword === '' || this.keyword.trim() !== '';
    }
}
