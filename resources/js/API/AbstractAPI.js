import { handleAPIError } from '@/Services/AppError.js';

const headers = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
};

export class AbstractAPI {
    #csrfToken;

    parseParameters(params) {
        return `?${Object.entries(params)
            .map(([key, value]) => (Array.isArray(value) ? value.map((val) => `${encodeURIComponent(key)}[]=${encodeURIComponent(val)}`).join('&') : `${key}=${value}`))
            .join('&')}`;
    }

    async get(endpoint) {
        return fetch(endpoint, { method: 'GET', headers: { ...headers, 'X-XSRF-TOKEN': this.getCsrfToken() }, credentials: 'include' }).then((response) => {
            if (response.redirected) {
                this.handleRedirection(response);
                return;
            }
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
            headers: { ...headers, 'X-XSRF-TOKEN': this.getCsrfToken() },
            credentials: 'include',
            body: JSON.stringify(data),
        }).then((response) => {
            if (response.redirected) {
                this.handleRedirection(response);
                return;
            }
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
            headers: { ...headers, 'X-XSRF-TOKEN': this.getCsrfToken() },
            credentials: 'include',
            body: JSON.stringify(data),
        }).then((response) => {
            if (response.redirected) {
                this.handleRedirection(response);
                return;
            }
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
            headers: { ...headers, 'X-XSRF-TOKEN': this.getCsrfToken() },
            credentials: 'include',
        }).then((response) => {
            if (response.redirected) {
                this.handleRedirection(response);
                return;
            }
            // * Check if the request was unsuccessful and raise the appropriate error.
            if (!response.ok && response.status !== 422) {
                return handleAPIError(response);
            } else {
                // * Parse the response and return it
                return response.json();
            }
        });
    }

    getCsrfToken() {
        if (this.#csrfToken) return this.#csrfToken;

        const cookies = document.cookie.split(';');

        for (let cookie of cookies) {
            let [name, value] = cookie.split('=');
            name = name.trim(); // Trim whitespace
            if (name === 'XSRF-TOKEN') {
                this.#csrfToken = decodeURIComponent(value);
                return this.#csrfToken; // Return the decoded value of the CSRF token
            }
        }

        return null; // Return null if no token found
    }

    handleRedirection(res) {
        if(window.location.href !== res.url)
            window.location.href = res.url;
    }
}
