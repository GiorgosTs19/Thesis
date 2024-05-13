import { useEffect } from 'react';

const EVENT_TYPES = {
    WORK_HIDDEN: 'WORK_HIDDEN',
};

class WorkEvent {
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

export function dispatchWorkHiddenEvent(eventData) {
    const workHiddenEvent = new WorkEvent(EVENT_TYPES.WORK_HIDDEN, eventData);
    workHiddenEvent.dispatch();
}

// Hook to create a listener for a custom event
export function useWorkHiddenEventListener(callback) {
    useEffect(() => {
        const eventListener = (event) => {
            if (typeof callback === 'function' && event.type === EVENT_TYPES.WORK_HIDDEN) {
                callback(event.detail);
            }
        };

        if (callback && typeof callback === 'function') document.addEventListener(EVENT_TYPES.WORK_HIDDEN, eventListener);

        return () => {
            if (callback && typeof callback === 'function') document.removeEventListener(EVENT_TYPES.WORK_HIDDEN, eventListener);
        };
    }, [callback]);
}
