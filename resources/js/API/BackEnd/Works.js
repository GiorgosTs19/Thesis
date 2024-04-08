import { AbstractAPI } from '@/API/AbstractAPI.js';

export class Works extends AbstractAPI {
    filterValue = (value) => {
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        return typeof value === 'string' ? value !== '' : value !== null;
    };

    prepareFilters(filters) {
        return Object.fromEntries(Object.entries(filters).filter(([_, value]) => this.filterValue(value)));
    }

    async filterWorks(params) {
        return this.get(`${route('Works.Filter')}${this.parseParameters(this.prepareFilters(params))}`);
    }

    async getMetadata() {
        return this.get(route('Works.Metadata'));
    }
}
