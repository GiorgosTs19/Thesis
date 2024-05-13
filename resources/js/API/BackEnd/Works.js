import { AbstractAPI } from '@/API/AbstractAPI.js';
import { dispatchWorkHiddenEvent } from '@/Events/WorkEvent/WorkEvent.js';
import { ToastTypes } from '@/Contexts/ToastContext.jsx';

export const EVENT_TYPES = {
    WORK_HIDDEN: 'WORK_HIDDEN',
};

export class Works extends AbstractAPI {
    filterValue = (value) => {
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        return typeof value === 'string' ? value !== '' : value !== null;
    };

    prepareFilters(filters) {
        return Object.fromEntries(Object.entries(filters).filter(([_, value]) => this.filterValue(value)));
    }

    async filterWorks(params) {
        return this.get(`${route('Works.Filter')}${this.parseParameters(this.prepareFilters(params))}`);
    }

    async getMetadata() {
        return this.get(route('Works.Metadata'));
    }

    async hideWork(work) {
        return this.post(route('Work.Hide'), { id: work.id }).then((res) => {
            if (res.ok) {
                dispatchWorkHiddenEvent({
                    type: EVENT_TYPES.WORK_HIDDEN,
                    success: res.success,
                    error: res.error,
                    data: {
                        action: `The work and its versions have been hidden from your profile`,
                        toastType: ToastTypes.WARNING,
                        work,
                        res: res.data,
                    },
                });
            }
        });
    }
}
