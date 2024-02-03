import {Groups} from "@/API/BackEnd/Groups.js";

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
    }
}
