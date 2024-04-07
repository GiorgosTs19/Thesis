import { AbstractAPI } from '@/API/AbstractAPI.js';

export class Works extends AbstractAPI {
    async filterWorks(params) {
        return this.get(`${route('Works.Filter')}${this.parseParameters(params)}`);
    }
}
