import { handleAPIError } from '@/Services/AppError.js';

const headers = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
};

export class AbstractAPI {
    parseParameters(params) {
        return `?${Object.entries(params)
            .map(([key, value]) => (Array.isArray(value) ? value.map((val) => `${encodeURIComponent(key)}[]=${encodeURIComponent(val)}`).join('&') : `${key}=${value}`))
            .join('&')}`;
    }

    async get(endpoint) {
        return fetch(endpoint, { method: 'GET', headers, credentials:'include' }).then((response) => {
            // * Check if the request was unsuccessful and raise the appropriate error.
            if (!response.ok && response.status !== 422) {
                return handleAPIError(response);
            } else {
                // * Parse the response and return it
                return response.json();
            }
        });
    }

    async post(endpoint, data) {
        return fetch(endpoint, {
            method: 'POST',
            headers,
            credentials:'include',
            body: JSON.stringify(data),
        }).then((response) => {
            // * Check if the request was unsuccessful and raise the appropriate error.
            if (!response.ok && response.status !== 422) {
                return handleAPIError(response);
            } else {
                // * Parse the response and return it
                return response.json();
            }
        });
    }

    async patch(endpoint, data) {
        return fetch(endpoint, {
            method: 'PATCH',
            headers,
            credentials:'include',
            body: JSON.stringify(data),
        }).then((response) => {
            // * Check if the request was unsuccessful and raise the appropriate error.
            if (!response.ok && response.status !== 422) {
                return handleAPIError(response);
            } else {
                // * Parse the response and return it
                return response.json();
            }
        });
    }

    async delete(endpoint) {
        return fetch(endpoint, {
            method: 'DELETE',
            credentials:'include',
        }).then((response) => {
            // * Check if the request was unsuccessful and raise the appropriate error.
            if (!response.ok && response.status !== 422) {
                return handleAPIError(response);
            } else {
                // * Parse the response and return it
                return response.json();
            }
        });
    }
}
