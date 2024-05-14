import { Author } from '@/Models/Author/Author.js';

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
    constructor({ displayName, admin = false, openAlex, scopus, orcId, email, staff, id, localUrl, author }) {
        this.id = id;
        this.displayName = displayName;
        this.isAdmin = admin;
        this.openAlex = openAlex;
        this.scopus = scopus;
        this.orcId = orcId;
        this.email = email;
        this.isStaff = staff;
        this.className = className;
        this.localUrl = localUrl;
        this.author = author ? Author.parseResponseAuthor(author) : null;
    }

    // TODO: Remove local_url empty string initialization ( when the user page is implemented in THESIS-6 )
    static parseUserResponse({ displayName, admin, email, openAlex, scopus, orcId, staff, id, local_url = '', author }) {
        return new User({
            id,
            email,
            displayName,
            openAlex,
            scopus,
            orcId,
            admin,
            staff,
            localUrl: local_url,
            author,
        });
    }

    getProperties() {
        return [
            { name: 'Email', value: this.email },
            { name: 'Open Alex', value: this.openAlex ?? '-' },
            { name: 'Scopus', value: this.scopus ?? '-' },
            { name: 'OrcId', value: this.orcId ?? '-' },
        ];
    }
}
