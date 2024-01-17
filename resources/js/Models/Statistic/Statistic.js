/**
 * Class representing statistics related to a particular asset (e.g., author, work).
 * @class
 */
export class Statistic {
    /**
     * Create a statistic instance.
     * @constructor
     * @param {string} assetType - The type of asset (e.g., 'Author', 'Work') associated with the statistics.
     * @param {assetId} assetId - The id of asset associated with the statistics.
     * @param {number} citedCount - The count of citations for the asset.
     * @param {number} worksCount - The count of works associated with the asset.
     * @param {number} year - The year to which the statistics correspond.
     */
    constructor({assetType, citedCount = 0, worksCount = 0, year, assetId}) {
        this.assetType = assetType;
        this.assetId = assetId;
        if (assetType === 'Author') this.worksCount = worksCount;
        this.citedCount = citedCount;
        this.year = year;
    }

    static parseResponseStatistic({assetType, assetId, year, worksCount, citedCount}) {
        return new Statistic({
            assetType,
            assetId,
            year,
            worksCount,
            citedCount
        });
    }
}
