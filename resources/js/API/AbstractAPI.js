import {handleAPIError} from "@/Services/AppError.js";

const headers = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
}

export class AbstractAPI {
    async get(endpoint) {
        return fetch(endpoint).then(response => {
            // * Check if the request was unsuccessful and raise the appropriate error.
            if (!response.ok) {
                handleAPIError(response)
            }
            // * Parse the response and return it
            return response.json();
        });
    }

    async post(endpoint, data) {
        return fetch(endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        }).then(response => {
            // * Check if the request was unsuccessful and raise the appropriate error.
            if (!response.ok) {
                handleAPIError(response)
            }
            // * Parse the response and return it
            return response.json();
        });

    }

    async patch(endpoint, data) {
        return fetch(endpoint, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(data),
        }).then(response => {
            // * Check if the request was unsuccessful and raise the appropriate error.
            if (!response.ok) {
                handleAPIError(response)
            }
            // * Parse the response and return it
            return response.json();
        });

    }

    async delete(endpoint) {
        return fetch(endpoint, {
            method: 'DELETE',
        }).then(response => {
            // * Check if the request was unsuccessful and raise the appropriate error.
            if (!response.ok) {
                handleAPIError(response)
            }
            // * Parse the response and return it
            return response.json();
        });

    }
}
