import { Author } from '@/Models/Author/Author.js';
import { capitalizeFirstLetter } from '@/Utility/Strings/Utils.js';
import { Statistic } from '@/Models/Statistic/Statistic.js';

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
     * @param {string} sourceUrl - The work's external source url.
     * @param {string} externalId - The work's external ID.
     * @param {string} language - The language in which the work is written.
     * @param {Array<Work>} versions - The source from which the work's information where retrieved.
     * @param statistics
     * @param localUrl
     * @param event - The event where the work was first presented.
     * @param sourceTitle - The title of the journal where the work was published.
     * @param subtype - A more specific name for the work type.
     * @param abstract - The work's abstract.
     * @param referencedByCount
     */
    constructor({
        id,
        title,
        authors,
        isOA,
        publicationYear,
        language,
        doi,
        sourceUrl,
        type,
        externalId,
        statistics,
        localUrl,
        event,
        sourceTitle,
        subtype,
        abstract,
        referencedByCount,
        versions,
        source,
    }) {
        this.title = title;
        this.id = id;
        this.doi = doi;
        this.type = type;
        this.authors = authors;
        this.isOA = isOA;
        this.publicationYear = publicationYear;
        this.sourceUrl = sourceUrl;
        this.language = language;
        this.className = 'Work';
        this.externalId = externalId;
        this.statistics = statistics;
        this.localUrl = localUrl;
        this.event = event;
        this.sourceTitle = sourceTitle;
        this.subtype = subtype;
        this.abstract = abstract;
        this.referencedByCount = referencedByCount;
        this.versions = versions;
        this.source = source;
    }

    static parseResponseWork({
        id,
        doi,
        title,
        published_at_year,
        language,
        is_oa,
        source_url,
        updated_at,
        authors,
        type,
        external_id,
        statistics,
        local_url,
        event,
        subtype,
        abstract,
        source_title,
        referenced_by_count,
        source,
        versions,
    }) {
        return new Work({
            id,
            doi,
            title: title !== '' ? title : 'Title not available',
            type,
            publicationYear: published_at_year,
            language,
            isOA: is_oa,
            sourceUrl: source_url,
            updatedAt: updated_at,
            authors: authors ? authors.map((author) => Author.parseResponseAuthor(author)) : [],
            externalId: external_id,
            statistics:
                statistics?.map((statistic) =>
                    Statistic.parseResponseStatistic({ assetType: className, citedCount: statistic.cited_count, assetId: id, year: statistic.year }),
                ) ?? [],
            localUrl: local_url,
            event,
            abstract,
            sourceTitle: source_title,
            subtype,
            referencedByCount: referenced_by_count,
            versions: versions ? versions.map((work) => Work.parseResponseWork(work)) : [],
            source,
        });
    }

    getSources() {
        const multipleSources = this.source.includes(',');
        return [multipleSources, this.source];
    }

    getProperties() {
        const properties = [
            { name: 'Doi', value: this.doi },
            { name: 'Type', value: capitalizeFirstLetter(this.type) },
            { name: 'Published', value: this.publicationYear },
            { name: 'Open Access', value: this.isOA ? 'Available' : 'Unavailable' },
            { name: 'Versions', value: this.versions.length + 1 },
            {
                name: this.source === 'Aggregate' ? 'Sources' : 'Source',
                value:
                    this.source === 'Aggregate'
                        ? this.versions.length > 1
                            ? this.versions.map((version) => version.source).join(', ')
                            : this.source
                        : this.source,
            },
        ];
        if (this.subtype && this.subtype !== this.type) properties.push({ name: 'Subtype', value: this.subtype });
        if (this.referencedByCount) properties.push({ name: 'Referenced By', value: this.referencedByCount });
        if (this.sourceTitle) properties.push({ name: 'Published on', value: this.sourceTitle });
        if (this.event) properties.push({ name: 'Published At', value: this.event });
        return properties;
    }
}
