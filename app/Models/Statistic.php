<?php

namespace App\Models;

use App\Http\Controllers\APIController;
use App\Jobs\UpdateDatabaseJob;
use Exception;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Arr;
use function App\Providers\rocketDump;

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

    public static function yearExistsForAuthor($author_id,$year): bool {
        return Statistic::where('author_id',$author_id)->where('year',$year)->exists();
    }

    public static function generateStatistics($id, $statistics, $asset_type): void {
        foreach ($statistics as $statistic) {
            try {
                $newYearlyCitations = new Statistic;
                $newYearlyCitations->asset_id = $id;
                $newYearlyCitations->year = $statistic->year;
                $newYearlyCitations->works_count = property_exists($statistic,'works_count') ? $statistic->works_count : null;
                $newYearlyCitations->cited_count = $statistic->cited_by_count;
                $newYearlyCitations->asset_type = $asset_type;
                $newYearlyCitations->save();
            } catch (Exception $error) {
                rocketDump($error->getMessage(), 'error',[__FUNCTION__,__FILE__,__LINE__]);
            }
        }
    }

    public static function generateStatistic($id, $statistic, $asset_type): void {
        try {
            $newYearlyCitations = new Statistic;
            $newYearlyCitations->asset_id = $id;
            $newYearlyCitations->year = $statistic->year;
            $newYearlyCitations->works_count = property_exists($statistic,'works_count') ? $statistic->works_count : null;
            $newYearlyCitations->cited_count = $statistic->cited_by_count;
            $newYearlyCitations->asset_type = $asset_type;
            $newYearlyCitations->save();
        } catch (Exception $error) {
            rocketDump($error->getMessage(), 'error',[__FUNCTION__,__FILE__,__LINE__]);
        }
    }

    public function updateStatistic($asset, $statistics_array, $year_to_update) : void {
        switch ($this->asset_type) {
            case Author::class : {
                $requestStatistic = self::getLatestOpenAlexStatistic($asset, Author::class, $statistics_array, $year_to_update);

                $works_count_differ = $requestStatistic->works_count !== $this->works_count;
                $citation_count_differ = $requestStatistic->cited_by_count !== $this->cited_count;
                try {
                    if (!$works_count_differ && !$citation_count_differ) {
                        rocketDump("No statistics updates required for Author $asset->open_alex_id for the year $requestStatistic->year");
                        return;
                    }

                    if ($works_count_differ) {
                        $this->works_count = $requestStatistic->works_count;
                        rocketDump("Works count has been updated for Author $asset->open_alex_id ", 'info', [__FUNCTION__,__FILE__,__LINE__]);
                    }

                    if ($citation_count_differ) {
                        $this->cited_count = $requestStatistic->cited_by_count;
                        rocketDump("Citation count has been updated for Author $asset->open_alex_id ", 'info', [__FUNCTION__,__FILE__,__LINE__]);
                    }

                    $this->save();
                } catch (Exception $exception) {
                    rocketDump($exception->getMessage(), 'error', [__FUNCTION__,__FILE__,__LINE__]);
                }
                break;
            }
            case Work::class : {
                $requestStatistic = self::getLatestOpenAlexStatistic($asset, Work::class, $statistics_array, $year_to_update);
                $citation_count_differ = $requestStatistic->cited_by_count !== $this->cited_count;

                if (!$citation_count_differ) {
                    rocketDump("No statistics updates required for Work $asset->open_alex_id for the year $requestStatistic->year");
                    return;
                }
                try {
                    $this->cited_count = $requestStatistic->cited_by_count;
                    $this->save();
                } catch (Exception $exception) {
                    rocketDump($exception->getMessage(), 'error', [__FUNCTION__,__FILE__,__LINE__]);
                }

                rocketDump("Citation count has been updated for Work $asset->open_alex_id ", 'info', [__FUNCTION__,__FILE__,__LINE__]);

                break;
            }
        }
    }

    public static function getLatestOpenAlexStatistic($asset, $asset_type, $statistics_array, $year_to_update) {
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

    public function asset(): BelongsTo {
        return $this->morphTo();
    }
}
