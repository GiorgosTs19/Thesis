import {dispatchAuthorizationErrorEvent} from "@/Events/ErrorEvent/ErrorEvent.js";

export const handleAPIError = (res) => {
    switch (res.status) {
        case 403: {
            dispatchAuthorizationErrorEvent({
                type: 'Authorization Error',
                error: res.statusText,
            })
            break;
        }
        case 422: {
            return res.json();
        }
        default: {
            throw new Error(`Error: ${res.status} - ${res.statusText}`);
        }
    }
}