import { AbstractAPI } from '@/API/AbstractAPI.js';
import { handleAPIError } from '@/Services/AppError.js';

export class Search extends AbstractAPI {
    async search(url, params) {
        if (!url) {
            throw new Error('url parameter is marked as required for search()');
        }
        const urlWithParams = `${url}${this.parseParameters(params)}`;
        return this.get(urlWithParams).then((res) => {
            if (!res.ok) {
                handleAPIError(res);
                return res.data;
            }
            return res.data;
        });
    }

    async searchAuthorsByIdentifiers(params) {
        if (!params) {
            throw new Error('At least one identifier is required for searchAuthorsByIdentifiers()');
        }
        const urlWithParams = `${route('Search.Authors.Identifiers')}${this.parseParameters(params)}`;
        return this.get(urlWithParams).then((res) => {
            if (res.ok) {
                return res.data.searchResults.authors;
            }
            return [];
        });
    }
}
