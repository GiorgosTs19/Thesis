import {useEffect} from 'react';

const name = 'GroupUpdated'

// Hook to dispatch a custom event
export function dispatchGroupUpdatedEvent(eventData) {
    const customEvent = new CustomEvent(name, {
        detail: eventData,
        bubbles: true,
        cancelable: true,
    });
    document.dispatchEvent(customEvent);
}

// Hook to create a listener for a custom event
export function useGroupUpdatedEventListener(callback) {
    useEffect(() => {
        function eventListener(event) {
            if (event.detail && typeof callback === 'function') {
                callback(event.detail);
            }
        }

        document.addEventListener(name, eventListener);

        return () => {
            document.removeEventListener(name, eventListener);
        };
    }, [name, callback]);
}