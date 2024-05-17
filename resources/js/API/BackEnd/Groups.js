import { AbstractAPI } from '@/API/AbstractAPI.js';
import { dispatchGroupCreatedEvent, dispatchGroupDeletedEvent, dispatchGroupUpdatedEvent } from '@/Events/GroupEvent/GroupEvent.js';
import { ToastTypes } from '@/Contexts/ToastContext.jsx';

export const EVENT_TYPES = {
    GROUP_CREATED: 'Group Created',
    MEMBERS_ADDED: 'Members Added',
    MEMBER_REMOVED: 'Member Removed',
};

export class Groups extends AbstractAPI {
    /**
     * Adds members to a group.
     *
     * @param {Object} group - The group to which authors will be added.
     * @param {Array} authors - The authors to be added to the group.
     * @returns {Promise<Object>} The response from the server.
     * @throws {Error} If the authors or group parameters are not provided.
     */
    async addMembers(group, authors) {
        if (!authors || !group.id) {
            throw new Error('The authors and group parameters are marked as required for addMember()');
        }

        return this.post(route('Group.Add.Member'), {
            authors,
            group_id: group.id,
        }).then((res) => {
            if (!res.errors)
                dispatchGroupUpdatedEvent({
                    type: EVENT_TYPES.MEMBERS_ADDED,
                    success: res.success,
                    error: res.error,
                    data: {
                        action: `Added ${authors.length} ${authors.length < 2 ? 'author' : 'authors'} to ${group.name}`,
                        toastType: ToastTypes.SUCCESS,
                        res: res.data,
                    },
                });
            return res;
        });
    }

    /**
     * Removes a member from a group.
     *
     * @param {Object} group - The group from which the author will be removed.
     * @param {Object} author - The author to be removed from the group.
     * @returns {Promise<Object>} The response from the server.
     * @throws {Error} If the author or group parameters are not provided.
     */
    async removeMember(group, author) {
        if (!author.id || !group.id) {
            throw new Error('The author and group parameters are marked as required for removeMember()');
        }

        return this.post(route('Group.Remove.Member'), {
            author_id: author.id,
            group_id: group.id,
        }).then((res) => {
            if (!res.errors)
                dispatchGroupUpdatedEvent({
                    type: EVENT_TYPES.MEMBER_REMOVED,
                    success: res.success,
                    error: res.error,
                    data: {
                        action: `${author.name} has been removed from ${group.name}`,
                        toastType: ToastTypes.WARNING,
                        group: group.name,
                        res: res.data,
                    },
                });
            return res;
        });
    }

    /**
     * Creates a new group.
     *
     * @param {string} name - The name of the group.
     * @param {string} description - The description of the group.
     * @param {Object} parent - The parent group (optional).
     * @returns {Promise<Object>} The response from the server.
     * @throws {Error} If the name or description parameters are not provided.
     */
    async createGroup(name, description, parent) {
        if (!name || !description) {
            throw new Error('The name and description parameters are marked as required for createGroup()');
        }

        return this.post(route('Group.Create'), {
            name,
            description,
            parent,
        }).then((res) => {
            if (!res.errors)
                dispatchGroupCreatedEvent({
                    type: EVENT_TYPES.GROUP_CREATED,
                    success: res.success,
                    error: res.error,
                    data: {
                        action: `Group Created`,
                        toastType: ToastTypes.SUCCESS,
                        group: res.data.group,
                        res: res.data,
                    },
                });
            return res;
        });
    }

    /**
     * Deletes a group.
     *
     * @param {Object} group - The group to be deleted.
     * @returns {Promise<Object>} The response from the server.
     * @throws {Error} If the group parameter is not provided.
     */
    async deleteGroup(group) {
        if (!group.id) {
            throw new Error('id parameter is marked as required for createGroup()');
        }

        return this.post(route('Group.Delete'), {
            id: group.id,
        }).then((res) => {
            if (!res.errors)
                dispatchGroupDeletedEvent({
                    type: 'Group Deleted',
                    success: res.success,
                    error: res.error,
                    data: {
                        action: `${group.name} has been deleted`,
                        toastType: ToastTypes.WARNING,
                        group,
                        res: res.data,
                    },
                });
        });
    }

    /**
     * Fetches the details of a group.
     *
     * @param {number} id - The ID of the group.
     * @returns {Promise<Object>} The response from the server.
     * @throws {Error} If the id parameter is not provided.
     */
    async getGroup(id) {
        if (!id) {
            throw new Error('id parameter is marked as required for getGroup()');
        }
        const url = route('Groups.Get.Group', id);
        return this.get(url);
    }

    /**
     * Fetches minimal information of all groups.
     *
     * @returns {Promise<Object>} The response from the server.
     */
    async getGroupsMinInfo() {
        return this.get(route('Group.Minimal.Info'));
    }

    /**
     * Fetches all groups.
     *
     * @returns {Promise<Object>} The response from the server.
     */
    async getAllGroups() {
        return this.get(route('Group.All'));
    }

    /**
     * Fetches Omea author statistics for a group.
     *
     * @param {number} id - The ID of the group.
     * @returns {Promise<Object>} The response from the server.
     * @throws {Error} If the id parameter is not provided.
     */
    async getOmeaAuthorStats(id) {
        if (!id) {
            throw new Error('id parameter is marked as required for getOmeaAuthorStats()');
        }
        const url = route('Group.Omea.Author.Stats', id);
        return this.get(url);
    }

    /**
     * Fetches Omea type statistics for a group.
     *
     * @param {number} id - The ID of the group.
     * @param {number} minYear - The minimum year for the statistics.
     * @param {number} maxYear - The maximum year for the statistics.
     * @returns {Promise<Object>} The response from the server.
     * @throws {Error} If the id parameter is not provided.
     */
    async getOmeaTypeStats(id, minYear, maxYear) {
        if (!id) {
            throw new Error('id parameter is marked as required for getOmeaTypeStats()');
        }
        const url = route('Group.Omea.Type.Stats', { id, min: minYear, max: maxYear });
        return this.get(url);
    }
}
