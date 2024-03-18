<?php

namespace App\Models;

use App\Utility\ULog;
use Exception;
use Illuminate\Database\Eloquent\{Factories\HasFactory, Model, Relations\BelongsTo};
use Illuminate\Support\Arr;

/**
 * @property mixed year
 * @property mixed works_count
 * @property mixed cited_count
 * @property mixed asset_type
 * @property mixed asset_id
 *
 * @method static where(string $string, $author_id)
 */
class Statistic extends Model {
    use HasFactory;

    protected $fillable = [
        'year',
        'works_count',
        'cited_count',
        'asset_type'
    ];

    /**
     * Parses all the statistics contained in the API response
     * and generates statistics entries.
     * @param $asset_id
     * The id of the asset.
     * @param $statistics
     * The asset's statistics array from the API response.
     * @param $asset_type
     * The type of asset ( Model::class ).
     * @return void
     */
    public static function generateStatistics($asset_id, $statistics, $asset_type): void {
        foreach ($statistics as $statistic) {
            self::newStatistic($asset_id, $statistic, $asset_type);
        }
    }

    /**
     * Create a new statistic
     * @param $asset_id
     * The id of the asset.
     * @param $statistic
     * The statistic object from the API response.
     * @param $asset_type
     * The type of asset ( Model::class ).
     * @return void
     */
    private static function newStatistic($asset_id, $statistic, $asset_type): void {
        try {
            $newYearlyCitations = new Statistic;
            $newYearlyCitations->asset_id = $asset_id;
            $newYearlyCitations->year = $statistic->year;
            $newYearlyCitations->works_count = property_exists($statistic, 'works_count') ? $statistic->works_count : null;
            $newYearlyCitations->cited_count = $statistic->cited_by_count;
            $newYearlyCitations->asset_type = $asset_type;
            $newYearlyCitations->save();
        } catch (Exception $error) {
            ULog::error($error->getMessage() . ", file: " . $error->getFile() . ", line: " . $error->getLine());
        }
    }

    /**
     * @param $asset_id
     * The asset's id.
     * @param $statistic
     * The statistic object from the API response.
     * @param $asset_type
     * The type of asset ( Model::class ).
     * @return void
     */
    public static function generateStatistic($asset_id, $statistic, $asset_type): void {
        self::newStatistic($asset_id, $statistic, $asset_type);
    }

    /** Updates the statistic based on the asset type of the statistic, checks for updates on the fields below :
     * - Author :
     *      - works_count
     *      - cited_by_count
     *  - Work :
     *      - cited_by_count
     * @param $asset
     * The asset the statistic references to.
     * @param $statistics_array
     * The array of statistics for the asset.
     * @return void
     */
    public function updateStatistic($asset, $statistics_array): void {
        switch ($this->asset_type) {
            case Author::class :
            {
                $requestStatistic = self::getCurrentYearsOpenAlexStatistic(Author::class, $statistics_array);

                $works_count_differ = $requestStatistic->works_count !== $this->works_count;
                $citation_count_differ = $requestStatistic->cited_by_count !== $this->cited_count;
                try {
                    if (!$works_count_differ && !$citation_count_differ) {
                        return;
                    }

                    if ($works_count_differ) {
                        $this->works_count = $requestStatistic->works_count;
                        ULog::log("Works count has been updated for Author $asset->open_alex_id");
                    }

                    if ($citation_count_differ) {
                        $this->cited_count = $requestStatistic->cited_by_count;
                        ULog::log("Citation count has been updated for Author $asset->open_alex_id ");
                    }

                    $this->save();
                } catch (Exception $error) {
                    ULog::error($error->getMessage() . ", file: " . $error->getFile() . ", line: " . $error->getLine());
                }
                break;
            }
            case Work::class :
            {
                $requestStatistic = self::getCurrentYearsOpenAlexStatistic(Work::class, $statistics_array);
                $citation_count_differ = $requestStatistic->cited_by_count !== $this->cited_count;

                if (!$citation_count_differ) {
                    return;
                }
                try {
                    $this->cited_count = $requestStatistic->cited_by_count;
                    $this->save();
                    ULog::log("Citation count has been updated for Work $asset->open_alex_id ");
                } catch (Exception $error) {
                    ULog::error($error->getMessage() . ", file: " . $error->getFile() . ", line: " . $error->getLine());
                }
                break;
            }
        }
    }

    /**
     * @param $asset_type
     * The type of asset ( Model::class ).
     * @param $statistics_array
     * The asset's array of statistics.
     * @return mixed
     * The asset's statistic for the current year ( if it exists ).
     */
    public static function getCurrentYearsOpenAlexStatistic($asset_type, $statistics_array): mixed {
        $year_to_update = date('Y');
        return match ($asset_type) {
            Author::class => Arr::first($statistics_array,
                function ($value) use ($year_to_update) {
                    return $value->year == (int)$year_to_update;
                }),
            Work::class => Arr::first($statistics_array,
                function ($value) use ($year_to_update) {
                    return $value->year == (int)$year_to_update;
                })
        };
    }

    /**
     * @return BelongsTo
     * The statistic's asset.
     */
    public function asset(): BelongsTo {
        return $this->morphTo();
    }
}
