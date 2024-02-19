import {Groups} from "@/API/BackEnd/Groups.js";
import {Pagination} from "@/API/BackEnd/Pagination.js";

export class API {
    static #instance;
    static instance;

    constructor() {
        if (API.#instance) {
            return API.#instance;
        }
        API.instance = this;
        API.#instance = this;
        this.groups = new Groups();
        this.pagination = new Pagination();
    }
}
