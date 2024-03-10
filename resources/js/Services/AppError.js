import { dispatchAuthorizationErrorEvent } from '@/Events/ErrorEvent/ErrorEvent.js';

export const handleAPIError = (res) => {
    console.log('🚀 ~ AppError.js 4', res);
    switch (res.status) {
        case 403: {
            dispatchAuthorizationErrorEvent({
                type: 'Authorization Error',
                error: res.statusText,
            });
            break;
        }
        default: {
            throw new Error(`Error: ${res.status} - ${res.statusText}`);
        }
    }
};
