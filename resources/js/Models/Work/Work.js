import {Author} from "@/Models/Author/Author.js";
import {capitalizeFirstLetter} from "@/Utility/Strings/Utils.js";
import {Statistic} from "@/Models/Statistic/Statistic.js";

/**
 * Class representing a work (e.g., publication).
 * @class
 */
const className = 'Work';

export class Work {
    /**
     * Create a work instance.
     * @constructor
     * @param id
     * @param {string} title - The title of the work.
     * @param {string} doi - The Digital Object Identifier of the work.
     * @param {string} type - The work's type article, conference paper etc.
     * @param {Array<Author>} authors - An array of authors associated with the work.
     * @param {boolean} isOA - Indicates whether the work is open access (true) or not (false).
     * @param {Date} publishedAt - The date when the work was published.
     * @param {number} publicationYear - The year the work was published.
     * @param {number} referencedWorksCount - The count of works that reference this work.
     * @param {string} citesUrl - The url of works that have cited this work.
     * @param {string} openAlexUrl - The work's Open Alex url.
     * @param {string} language - The language in which the work is written.
     * @param openAlexId
     * @param statistics
     * @param localUrl
     */
    constructor({
                    id,
                    title,
                    authors,
                    isOA,
                    publishedAt,
                    publicationYear,
                    referencedWorksCount,
                    language,
                    doi,
                    citesUrl,
                    openAlexUrl,
                    type,
                    openAlexId,
                    statistics,
                    localUrl
                }) {
        this.title = title;
        this.id = id;
        this.doi = doi;
        this.type = type;
        this.authors = authors;
        this.isOA = isOA;
        this.publishedAt = publishedAt;
        this.publicationYear = publicationYear;
        this.referencedWorksCount = referencedWorksCount;
        this.citesUrl = citesUrl;
        this.openAlexUrl = openAlexUrl;
        this.language = language;
        this.className = 'Work';
        this.openAlexId = openAlexId;
        this.statistics = statistics;
        this.localUrl = localUrl;
    }

    static parseResponseWork({
                                 id,
                                 doi,
                                 title,
                                 published_at,
                                 published_at_year,
                                 referenced_works_count,
                                 language,
                                 is_oa,
                                 open_alex_url,
                                 updated_at,
                                 cites_url,
                                 authors,
                                 type,
                                 open_alex_id,
                                 statistics,
                                 local_url
                             }) {
        return new Work({
            id,
            doi,
            title,
            type,
            publishedAt: published_at,
            publicationYear: published_at_year,
            referencedWorksCount: referenced_works_count,
            language,
            isOA: is_oa,
            openAlexUrl: open_alex_url,
            updatedAt: updated_at,
            citesUrl: cites_url,
            authors: authors ? authors.map(author => Author.parseResponseAuthor(author)) : [],
            openAlexId: open_alex_id,
            statistics: statistics?.map(statistic => Statistic.parseResponseStatistic(
                {assetType: className, citedCount: statistic.cited_count, assetId: id, year: statistic.year})) ?? [],
            localUrl: local_url
        });
    }

    getProperties() {
        return [
            {name: 'Type', value: capitalizeFirstLetter(this.type)},
            {name: 'References', value: this.referencedWorksCount},
            {name: 'Published', value: this.publishedAt},
            {name: 'Open Alex', value: this.openAlexId},
            {name: 'Open Access', value: this.isOA ? 'Available' : 'Unavailable'},
        ];
    }
}
