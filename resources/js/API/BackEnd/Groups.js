import {AbstractAPI} from "@/API/AbstractAPI.js";

export class Groups extends AbstractAPI {
    async addMembers(group, authors) {
        if (!authors || !group) {
            throw new Error(
                "The authors and group parameters are marked as required for addMember()",
            );
        }

        return this.post(route("Group.Add.Member"), {
            authors,
            group,
        });
    }

    async removeMember(group, author) {
        if (!author || !group) {
            throw new Error(
                "The author and group parameters are marked as required for removeMember()",
            );
        }

        return this.post(route("Group.Remove.Member"), {
            author,
            group,
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
        });
    }

    async deleteGroup(id) {
        if (!id) {
            throw new Error(
                "id parameter is marked as required for createGroup()",
            );
        }

        return this.post(route("Group.Delete"), {
            id,
        });
    }
}
