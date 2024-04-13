import { Groups } from '@/API/BackEnd/Groups.js';
import { Pagination } from '@/API/BackEnd/Pagination.js';
import { Works } from '@/API/BackEnd/Works.js';
import { Search } from '@/API/BackEnd/Search.js';

export class API {
    static #instance;

    constructor() {
        // * Singleton class instance
        if (API.#instance) {
            return API.#instance;
        }
        API.#instance = this;
        this.groups = new Groups();
        this.pagination = new Pagination();
        this.works = new Works();
        this.search = new Search();
    }
}
