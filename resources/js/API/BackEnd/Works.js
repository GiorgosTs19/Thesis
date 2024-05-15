import { AbstractAPI } from '@/API/AbstractAPI.js';
import {dispatchWorkHiddenEvent, dispatchWorkShownEvent} from '@/Events/WorkEvent/WorkEvent.js';
import { ToastTypes } from '@/Contexts/ToastContext.jsx';

export const EVENT_TYPES = {
    WORK_HIDDEN: 'WORK_HIDDEN',
    WORK_SHOWN: 'WORK_SHOWN',
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

    async toggleWorkVisibility(work, visibility) {
        if(!work) {
            throw new Error('work parameter is marked as required for toggleWorkVisibility()');
        }
        if(visibility === undefined) {
            throw new Error('visibility parameter is marked as required for toggleWorkVisibility()');
        }
        return this.post(route('Work.Visibility.Toggle'), { id: work.id, visibility }).then((res) => {
            if (!res.ok)
                return;
            if(visibility) {
                dispatchWorkShownEvent({
                    type: EVENT_TYPES.WORK_SHOWN,
                    success: res.success,
                    error: res.error,
                    data: {
                        action: `The work and its versions are now showing in your profile.`,
                        toastType: ToastTypes.SUCCESS,
                        work,
                        res: res.data,
                    },
                });
            } else {
                dispatchWorkHiddenEvent({
                    type: EVENT_TYPES.WORK_HIDDEN,
                    success: res.success,
                    error: res.error,
                    data: {
                        action: `The work and its versions have been hidden from your profile.`,
                        toastType: ToastTypes.WARNING,
                        work,
                        res: res.data,
                    },
                });
            }
        });
    }

    async getHiddenWorks() {
        return this.get(route('Works.Hidden')).then(res => {
            if(!res.ok) {
                return {data:[]};
            }
            return res.data.works;
        })
    }
}
