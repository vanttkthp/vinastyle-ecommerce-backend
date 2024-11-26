
export class PageMetaDto {
    readonly total: number;
    readonly page: number;
    readonly limit: number;
    readonly lastPage: number;
    readonly hasNextPage: boolean;
    readonly hasPreviousPage: boolean;
    readonly message: string;

    constructor(total: number, page: number, limit: number, message: string) {
        this.total = total;
        this.page = page;
        this.limit = limit;
        this.lastPage = Math.ceil(total / limit);
        this.message = message;
        this.hasNextPage = page < this.lastPage;
        this.hasPreviousPage = page > 1;
    }
}
