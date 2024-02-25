import {useEffect} from 'react';

const EVENT_TYPES = {
    GROUP_UPDATED: 'GROUP_UPDATED',
    GROUP_CREATED: 'GROUP_CREATED',
    GROUP_DELETED: 'GROUP_DELETED',
}

class GroupEvent {
    constructor(type, data) {
        this.action = type;
        this.data = data;
    }

    dispatch() {
        const event = new CustomEvent(this.action, {
            detail: this.data,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(event);
    }
}

export function dispatchGroupUpdatedEvent(eventData) {
    const groupUpdatedEvent = new GroupEvent(EVENT_TYPES.GROUP_UPDATED, eventData);
    groupUpdatedEvent.dispatch();
}

export function dispatchGroupCreatedEvent(eventData) {
    const groupCreatedEvent = new GroupEvent(EVENT_TYPES.GROUP_CREATED, eventData);
    groupCreatedEvent.dispatch();
}

export function dispatchGroupDeletedEvent(eventData) {
    const groupDeletedEvent = new GroupEvent(EVENT_TYPES.GROUP_DELETED, eventData);
    groupDeletedEvent.dispatch();
}

// Hook to create a listener for a custom event
export function useGroupUpdatedEventListener(callback) {
    useEffect(() => {
        const eventListener = (event) => {
            if (typeof callback === 'function' && event.type === EVENT_TYPES.GROUP_UPDATED) {
                callback(event.detail);
            }
        }

        if (callback && typeof callback === 'function')
            document.addEventListener(EVENT_TYPES.GROUP_UPDATED, eventListener);

        return () => {
            if (callback && typeof callback === 'function')
                document.removeEventListener(EVENT_TYPES.GROUP_UPDATED, eventListener);
        };
    }, [callback]);
}

export function useGroupCreatedEventListener(callback) {
    useEffect(() => {
        const eventListener = (event) => {
            if (typeof callback === 'function' && event.type === EVENT_TYPES.GROUP_CREATED) {
                callback(event.detail);
            }
        }

        if (callback && typeof callback === 'function')
            document.addEventListener(EVENT_TYPES.GROUP_CREATED, eventListener);

        return () => {
            if (callback && typeof callback === 'function')
                document.removeEventListener(EVENT_TYPES.GROUP_CREATED, eventListener);
        };
    }, [callback]);
}

export function useGroupDeletedEventListener(callback) {
    useEffect(() => {
        const eventListener = (event) => {
            if (typeof callback === 'function' && event.type === EVENT_TYPES.GROUP_DELETED) {
                callback(event.detail);
            }
        }

        if (callback && typeof callback === 'function')
            document.addEventListener(EVENT_TYPES.GROUP_DELETED, eventListener);

        return () => {
            if (callback && typeof callback === 'function')
                document.removeEventListener(EVENT_TYPES.GROUP_DELETED, eventListener);
        };
    }, [callback]);
}