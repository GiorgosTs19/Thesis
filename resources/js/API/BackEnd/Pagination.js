import {AbstractAPI} from "@/API/AbstractAPI.js";

export class Pagination extends AbstractAPI {
    async getPage(url) {
        if (!url) {
            throw new Error(
                "url parameter is marked as required for getPage()",
            );
        }
        return this.get(url);
    }
}