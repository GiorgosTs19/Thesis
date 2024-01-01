<?php

namespace App\Models;

use Exception;
use Illuminate\Support\Arr;
use function App\Providers\rocketDump;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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
        'count'
        ];

    /**
     * Parses all the statistics contained in the Api response
     * and generates statistics accordingly.
     * @param $asset_id
     * The id of the asset that the statistics refer to.
     * @param $statistics
     * The statistics array of the asset from the Api response.
     * @param $asset_type
     * The type of the asset that the statistics refer to.
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
     * The id of the asset that the statistic refer to.
     * @param $statistic
     * The statistic object from the Api response.
     * @param $asset_type
     * The type of the asset that the statistic refer to.
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
            rocketDump($error->getMessage(), 'error', [__FUNCTION__, __FILE__, __LINE__]);
        }
    }

    public static function generateStatistic($id, $statistic, $asset_type): void {
        self::newStatistic($id, $statistic, $asset_type);
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
    public function updateStatistic($asset, $statistics_array) : void {
        switch ($this->asset_type) {
            case Author::class : {
                $requestStatistic = self::getCurrentYearsOpenAlexStatistic(Author::class, $statistics_array);

                $works_count_differ = $requestStatistic->works_count !== $this->works_count;
                $citation_count_differ = $requestStatistic->cited_by_count !== $this->cited_count;
                try {
                    if (!$works_count_differ && !$citation_count_differ) {
                        return;
                    }

                    if ($works_count_differ) {
                        $this->works_count = $requestStatistic->works_count;
                        rocketDump("Works count has been updated for Author $asset->open_alex_id");
                    }

                    if ($citation_count_differ) {
                        $this->cited_count = $requestStatistic->cited_by_count;
                        rocketDump("Citation count has been updated for Author $asset->open_alex_id ");
                    }

                    $this->save();
                } catch (Exception $exception) {
                    rocketDump($exception->getMessage(), 'error', [__FUNCTION__,__FILE__,__LINE__]);
                }
                break;
            }
            case Work::class : {
                $requestStatistic = self::getCurrentYearsOpenAlexStatistic(Work::class, $statistics_array);
                $citation_count_differ = $requestStatistic->cited_by_count !== $this->cited_count;

                if (!$citation_count_differ) {
                    return;
                }
                try {
                    $this->cited_count = $requestStatistic->cited_by_count;
                    $this->save();
                    rocketDump("Citation count has been updated for Work $asset->open_alex_id ");
                } catch (Exception $exception) {
                    rocketDump($exception->getMessage(), 'error', [__FUNCTION__,__FILE__,__LINE__]);
                }
                break;
            }
        }
    }

    /**
     * @param $asset_type
     * The type of asset the statistic refers to.
     * @param $statistics_array
     * The asset's array of statistics to extract the statistic from.
     * @return mixed
     * The asset's statistic for the current year ( if it exists ).
     */
    public static function getCurrentYearsOpenAlexStatistic($asset_type, $statistics_array) : mixed {
        $year_to_update =  date('Y');
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
     * The asset that the statistic refers to.
     */
    public function asset(): BelongsTo {
        return $this->morphTo();
    }
}
