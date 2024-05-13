import { useEffect } from 'react';

const EVENT_TYPES = {
    AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
    SERVER_ERROR: 'SERVER_ERROR',
};

class ErrorEvent {
    constructor(type, data) {
        this.action = type;
        this.data = data;
    }

    dispatch() {
        const event = new CustomEvent(this.action, {
            detail: this.data,
            bubbles: true,
            cancelable: true,
        });
        document.dispatchEvent(event);
    }
}

export function dispatchAuthorizationErrorEvent(eventData) {
    const authorizationErrorEvent = new ErrorEvent(EVENT_TYPES.AUTHORIZATION_ERROR, eventData);
    authorizationErrorEvent.dispatch();
}

export function dispatchServerErrorEvent(eventData) {
    const groupDeletedEvent = new ErrorEvent(EVENT_TYPES.SERVER_ERROR, eventData);
    groupDeletedEvent.dispatch();
}

// Hook to create a listener for a custom event
export function useAuthorizationErrorEventListener(callback) {
    useEffect(() => {
        const eventListener = (event) => {
            if (typeof callback === 'function' && event.type === EVENT_TYPES.AUTHORIZATION_ERROR) {
                callback(event.detail);
            }
        };

        if (callback && typeof callback === 'function') document.addEventListener(EVENT_TYPES.AUTHORIZATION_ERROR, eventListener);

        return () => {
            if (callback && typeof callback === 'function') document.removeEventListener(EVENT_TYPES.AUTHORIZATION_ERROR, eventListener);
        };
    }, [callback]);
}

export function useServerErrorEventListener(callback) {
    useEffect(() => {
        const eventListener = (event) => {
            if (typeof callback === 'function' && event.type === EVENT_TYPES.SERVER_ERROR) {
                callback(event.detail);
            }
        };

        if (callback && typeof callback === 'function') document.addEventListener(EVENT_TYPES.SERVER_ERROR, eventListener);

        return () => {
            if (callback && typeof callback === 'function') document.removeEventListener(EVENT_TYPES.SERVER_ERROR, eventListener);
        };
    }, [callback]);
}
