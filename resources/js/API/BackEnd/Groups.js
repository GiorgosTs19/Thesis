import {AbstractAPI} from "@/API/AbstractAPI.js";

export class Groups extends AbstractAPI {
    async addMember(group, author) {
        if (!author || !group) {
            throw new Error('The author and group parameters are marked as required for addMember()');
        }

        return this.post(route('Group.Add.Member'), {
            author,
            group
        });
    }

    async removeMember(group, author) {
        if (!author || !group) {
            throw new Error('The author and group parameters are marked as required for removeMember()');
        }

        return this.post(route('Group.Remove.Member'), {
            author,
            group
        });
    }

    async createGroup(name, description) {
        if (!name || !description) {
            throw new Error('The name and description parameters are marked as required for createGroup()');
        }

        return this.post(route('Group.Create'), {
            name
        });
    }

    async deleteGroup(id) {
        if (!id) {
            throw new Error('id parameter is marked as required for createGroup()');
        }

        return this.post(route('Group.Delete'), {
            id
        });
    }
}
