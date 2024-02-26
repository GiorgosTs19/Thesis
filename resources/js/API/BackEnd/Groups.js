import {AbstractAPI} from "@/API/AbstractAPI.js";
import {dispatchGroupCreatedEvent, dispatchGroupDeletedEvent, dispatchGroupUpdatedEvent} from "@/Events/GroupEvent/GroupEvent.js";
import {ToastTypes} from "@/Contexts/ToastContext.jsx";


export class Groups extends AbstractAPI {
    async addMembers(group, authors) {
        if (!authors || !group.id) {
            throw new Error(
                "The authors and group parameters are marked as required for addMember()",
            );
        }

        return this.post(route("Group.Add.Member"), {
            authors,
            group_id: group.id,
        }).then((res) => {
            dispatchGroupUpdatedEvent({
                type: 'Members Added',
                success: res.success,
                error: res.error,
                data: {
                    action: `Added ${authors.length} ${authors.length < 2 ? 'author' : 'authors'} to ${group.name}`,
                    toastType: ToastTypes.SUCCESS,
                    res: res.data
                }
            })
            return res;
        })
    }

    async removeMember(group, author) {
        if (!author.id || !group.id) {
            throw new Error(
                "The author and group parameters are marked as required for removeMember()",
            );
        }

        return this.post(route("Group.Remove.Member"), {
            author_id: author.id,
            group_id: group.id,
        }).then((res) => {
            dispatchGroupUpdatedEvent({
                type: 'Member Removed',
                success: res.success,
                error: res.error,
                data: {
                    action: `${author.name} has been removed from ${group.name}`,
                    toastType: ToastTypes.WARNING,
                    group: group.name,
                    res: res.data
                }
            })
            return res;
        });
    }

    async createGroup(name, description, parent) {
        if (!name || !description) {
            throw new Error(
                "The name and description parameters are marked as required for createGroup()",
            );
        }

        return this.post(route("Group.Create"), {
            name,
            description,
            parent
        }).then((res) => {
            dispatchGroupCreatedEvent({
                type: 'Member Removed',
                success: res.success,
                error: res.error,
                data: {
                    action: `Group Created`,
                    toastType: ToastTypes.SUCCESS,
                    group: res.data.group,
                    res: res.data
                }
            })
            return res;
        });
    }

    async deleteGroup(group) {
        if (!group.id) {
            throw new Error(
                "id parameter is marked as required for createGroup()",
            );
        }

        return this.post(route("Group.Delete"), {
            id: group.id,
        }).then(res => {
            dispatchGroupDeletedEvent({
                type: 'Group Deleted',
                success: res.success,
                error: res.error,
                data: {
                    action: `${group.name} has been deleted`,
                    toastType: ToastTypes.WARNING,
                    group,
                    res: res.data
                }
            })
        });
    }

    async getGroup(id) {
        if (!id) {
            throw new Error(
                "id parameter is marked as required for getGroup()",
            );
        }
        const url = route("Groups.Get.Group", id)
        return this.get(url);
    }
}
