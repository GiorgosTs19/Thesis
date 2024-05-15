import { useEffect } from 'react';

const EVENT_TYPES = {
    WORK_HIDDEN: 'WORK_HIDDEN',
    WORK_SHOWN: 'WORK_SHOWN',
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
export function dispatchWorkShownEvent(eventData) {
    const workShownEvent = new WorkEvent(EVENT_TYPES.WORK_SHOWN, eventData);
    workShownEvent.dispatch();
}

// Hook to create a listener for a custom event
export function useWorkVisibilityChangedEventListener(callback, visibility) {
    useEffect(() => {
        const eventListener = (event) => {
            if (typeof callback === 'function' && visibility ? event.type === EVENT_TYPES.WORK_SHOWN : event.type === EVENT_TYPES.WORK_HIDDEN) {
                callback(event.detail);
            }
        };

        if (callback && typeof callback === 'function') document.addEventListener(visibility ? EVENT_TYPES.WORK_SHOWN : EVENT_TYPES.WORK_HIDDEN, eventListener);

        return () => {
            if (callback && typeof callback === 'function') document.removeEventListener(visibility ? EVENT_TYPES.WORK_SHOWN : EVENT_TYPES.WORK_HIDDEN, eventListener);
        };
    }, [callback]);
}
