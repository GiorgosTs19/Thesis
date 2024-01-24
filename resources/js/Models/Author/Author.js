import {Work} from "@/Models/Work/Work.js";
import {Statistic} from "@/Models/Statistic/Statistic.js";
import {numberToDotNotation} from "@/Utility/Numbers/Utils.js";

/**
 * Create a new Author.
 * @constructor
 * @param {number} id - The id of the author.
 * @param {string} name - The name of the author.
 * @param {boolean} isUser - Indicates whether the author is associated with a user (true) or not (false).
 * @param {number} citationCount - The count of citations attributed to the author's works.
 * @param {number} worksCount - The count of works (e.g., publications) associated with the author.
 * @param {string} openAlexId - Unique identifier from OpenAlex associated with the author.
 * @param {string} scopusId - Unique identifier from Scopus associated with the author.
 * @param {string} orcId - Unique identifier from ORCID (Open Researcher and Contributor ID) associated with the author.
 * @param {Array<Work>} works - An array of works (e.g., publications) associated with the author.
 * @param {Array<Statistic>} statistics - A collection of statistical data related to the author's profile (e.g., citations/year, works/year).
 * @param {Date} updatedAt - The timestamp indicating when the author's profile was last updated.
 */
const className = 'Author';

export class Author {
    constructor({
                    name,
                    isUser,
                    citationCount,
                    worksCount,
                    openAlexId,
                    scopusId,
                    orcId,
                    works,
                    statistics,
                    updatedAt,
                    id,
                    localUrl
                }) {
        this.id = id;
        this.name = name;
        this.isUser = isUser;
        this.citationCount = citationCount;
        this.worksCount = worksCount;
        this.openAlexId = openAlexId;
        this.scopusId = scopusId;
        this.orcId = orcId;
        this.works = works;
        this.statistics = statistics;
        this.updatedAt = updatedAt;
        this.className = className;
        this.localUrl = localUrl;
    }

    static parseResponseAuthor({
                                   name, is_user, citation_count, works_count, open_alex_id,
                                   scopus_id, orc_id, works = [], statistics, updated_at, id, local_url
                               }) {
        return new Author({
            id,
            name,
            openAlexId: open_alex_id,
            scopusId: scopus_id,
            orcId: orc_id,
            isUser: is_user,
            citationCount: citation_count,
            worksCount: works_count,
            works: works ? works.map(work => Work.parseResponseWork(work)) : [],
            updatedAt: updated_at,
            statistics: statistics ? statistics.map(statistic => Statistic.parseResponseStatistic(
                {
                    assetType: className,
                    citedCount: statistic.cited_count,
                    worksCount: statistic.works_count,
                    assetId: id,
                    year: statistic.year
                })) : [],
            localUrl: local_url
        });
    }

    getProperties() {
        return [
            {name: 'Citations', value: numberToDotNotation(this.citationCount)},
            {name: 'Works', value: numberToDotNotation(this.worksCount)},
            {name: 'Open Alex', value: this.openAlexId ?? '-'},
            {name: 'Scopus', value: this.scopusId ?? '-'},
            {name: 'OrcId', value: this.orcId ?? '-'}
        ];
    }
}
