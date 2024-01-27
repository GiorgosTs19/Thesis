/**
 * Create a new User.
 * @constructor
 * @param {number} id - The id of the user.
 * @param {string} firstName - The first name of the user.
 * @param {string} lastName - The last name of the user.
 * @param {boolean} isAdmin - Indicates whether the user is an admin or not.
 * @param {string} email - The user's email.
 * @param {string} openAlexId - Unique identifier from OpenAlex associated with the user.
 * @param {string} scopusId - Unique identifier from Scopus associated with the user.
 * @param {string} orcId - Unique identifier from ORCID (Open Researcher and Contributor ID) associated with the user.
 * @param {Date} updatedAt - The timestamp indicating when the author's profile was last updated.
 */
const className = 'User';

export class User {
    constructor({
                    firstName,
                    lastName,
                    isAdmin = false,
                    openAlexId,
                    scopusId,
                    orcId,
                    email,
                    updatedAt,
                    id,
                    localUrl
                }) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.isAdmin = isAdmin;
        this.openAlexId = openAlexId;
        this.scopusId = scopusId;
        this.orcId = orcId;
        this.email = email;
        this.updatedAt = updatedAt;
        this.className = className;
        this.localUrl = localUrl;
    }

    // TODO: Remove local_url empty string initialization ( when the user page is implemented in THESIS-6 )
    static parseResponseAuthor({
                                   first_name, last_name, is_admin, email, open_alex_id,
                                   scopus_id, orc_id, updated_at, id, local_url = ''
                               }) {
        return new User({
            id,
            email,
            firstName: first_name,
            lastName: last_name,
            openAlexId: open_alex_id,
            scopusId: scopus_id,
            orcId: orc_id,
            isAdmin: is_admin,
            updatedAt: updated_at,
            localUrl: local_url
        });
    }

    getProperties() {
        return [
            {name: 'Email', value: this.email},
            {name: 'Open Alex', value: this.openAlexId ?? '-'},
            {name: 'Scopus', value: this.scopusId ?? '-'},
            {name: 'OrcId', value: this.orcId ?? '-'}
        ];
    }
}
