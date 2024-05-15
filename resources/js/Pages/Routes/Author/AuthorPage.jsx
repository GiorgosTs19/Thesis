import { Author } from '@/Models/Author/Author.js';
import Switch from '@/Components/Switch/Switch.jsx';
import React, { useCallback, useMemo, useState } from 'react';
import { WorkItem } from '@/Components/Assets/WorkItem/WorkItem.jsx';
import { array, number, object, shape } from 'prop-types';
import RowOfProperties from '@/Components/RowOfProperties/RowOfProperties.jsx';
import SimpleStatisticsChart from '@/Charts/SimpleStatisticsChart/SimpleBarChart.jsx';
import { useWindowSize } from '@uidotdev/usehooks';
import clsx from 'clsx';
import SimpleDoughnutChart from '@/Charts/DoughnutChart/SimpleDoughnutChart.jsx';
import useWorkFilters from '@/Hooks/useWorkFilters/useWorkFilters.jsx';
import useAPI from '@/Hooks/useAPI/useAPI.js';
import { Work } from '@/Models/Work/Work.js';
import PaginatedList from '@/Components/PaginatedList/PaginatedList.jsx';
import Filters from '@/Components/Filters/Filters.jsx';
import useAsync from '@/Hooks/useAsync/useAsync.js';
import { useAuth } from '@/Hooks/useAuth/useAuth.jsx';
import { useWorkVisibilityChangedEventListener } from '@/Events/WorkEvent/WorkEvent.js';
import { ToastTypes, useToast } from '@/Contexts/ToastContext.jsx';
import { Checkbox, Label } from 'flowbite-react';
import HiddenWorks from '@/Pages/Routes/Author/HiddenWorks.jsx';

const AuthorPage = ({ author, uniqueWorksCounts }) => {
    const authorObject = useMemo(() => Author.parseResponseAuthor(author), [author]);
    const { name, isUser, updatedAt } = authorObject;
    const [showWholeBio, setShowWholeBio] = useState(false);
    const [authorWorks, setAuthorWorks] = useState({ data: [] });
    const authors = useMemo(() => [authorObject], [authorObject]);
    const { filters, dispatch } = useWorkFilters({ authors: authors });
    const api = useAPI();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [refreshWorks, setRefreshWorks] = useState(false);
    const [showHiddenWorks, setShowHiddenWorks] = useState(false);

    useWorkVisibilityChangedEventListener((event) => {
        showToast(event.data.action, ToastTypes.SUCCESS, event.success, 5000);
        setRefreshWorks((prev) => !prev);
    }, false);

    const handleFetchWorks = useCallback(() => {
        if (showHiddenWorks) {
            return;
        }
        return api.works.filterWorks({ ...filters, filter_visibility: true }).then((res) => {
            setAuthorWorks(res.data);
        });
    }, [filters, refreshWorks, showHiddenWorks]);

    const { loading } = useAsync(handleFetchWorks);

    const handleGetPage = (url) => {
        api.pagination.getPage(url).then((res) => {
            setAuthorWorks(res.data);
        });
    };

    const PROFILE_STATUS = {
        INCOMPLETE: `${name} is not a registered user, thus their list of works and information might be incomplete and not always up to date.`,
        REGISTERED: `${name} is a registered user, their info and works are regularly updated.`,
    };

    const { width } = useWindowSize();
    const authorStatistics = authorObject.statistics;
    const yearsArray = authorStatistics
        .map((statistic) => parseInt(statistic.year))
        .sort((a, b) => {
            if (a === b) {
                return 0; // Leave them unchanged relative to each other
            } else if (a < b) {
                return -1; // a comes before b
            } else {
                return 1; // b comes before a
            }
        });

    const CHART_DATA = {
        CITATIONS: {
            dataSet: authorStatistics.map((statistic) => statistic.citedCount),
            title: 'Citations',
            labels: yearsArray,
            description: 'Citation trends per year.',
            source: 'Open Alex',
            disclaimer:
                'The data presented in this chart may not capture the complete set of citations for' +
                ' this author. The statistics gathered might not cover every year, potentially leading' +
                ' to gaps in the information.',
        },
        WORKS: {
            dataSet: authorStatistics.map((statistic) => statistic.worksCount),
            title: 'Works',
            labels: yearsArray,
            description: 'Distribution of works authored per year.',
            source: 'Open Alex',
            disclaimer:
                'The data presented in this chart may not capture the complete set of works for' +
                ' this author. The statistics gathered might not cover every year, potentially leading' +
                ' to gaps in the information.',
        },
    };

    const DOUGHNUT_CHART_DATA = {
        dataSet: [uniqueWorksCounts.OpenAlex, uniqueWorksCounts.ORCID, uniqueWorksCounts.Crossref],
        title: 'Works from Source',
        labels: ['Open Alex ', 'ORCID', 'Crossref'],
        description:
            'Visualization of the distribution of works sourced from each of the different platforms, including OpenAlex, ORCID and Crossref. ' +
            "It offers insights into the relative contribution of each platform to the collection of the author's works.",
        disclaimer: "The majority of the author's works are sourced from a combination of the platforms listed above.",
    };

    const [activeChart, setActiveChart] = useState(CHART_DATA.CITATIONS);

    const renderWorkItem = useCallback(
        (work, index) => {
            return <WorkItem work={work} key={work.id} index={index} showUserOptions={authorObject.id === user?.author?.id} />;
        },
        [authorWorks],
    );

    const authorGeneralProperties = [...authorObject.getProperties()];
    const workSources = [
        { name: 'Open Alex Sourced Works ', value: uniqueWorksCounts.OpenAlex },
        { name: 'OrcId Sourced Works ', value: uniqueWorksCounts.ORCID },
        { name: 'Crossref Sourced Works ', value: uniqueWorksCounts.Crossref },
    ];

    const biographyPresent = !!authorObject.biography;

    return (
        <div className={'flex flex-col py-2 xl:px-5'}>
            <div className={styles.infoContainer}>
                <div className={styles.properties}>
                    <RowOfProperties properties={authorGeneralProperties} title={authorObject.name} className={'my-auto'} />
                    <div className={clsx(styles.statusWrapper, !biographyPresent ? 'my-auto' : '')}>
                        <h2 className={styles.statusHeader}>{isUser ? 'Registered User' : 'Incomplete Profile'}</h2>
                        <div className={styles.status}>{isUser ? PROFILE_STATUS.REGISTERED : PROFILE_STATUS.INCOMPLETE}</div>
                        <div className={styles.lastUpdated}>Last updated: {updatedAt}</div>
                    </div>
                </div>
                <div className={styles.chartsContainer}>
                    <Switch
                        checkedLabel={CHART_DATA.WORKS.title}
                        uncheckedLabel={CHART_DATA.CITATIONS.title}
                        checked={activeChart.title !== CHART_DATA.CITATIONS.title}
                        className="mx-auto my-4"
                        onChange={(checked) => setActiveChart(checked ? CHART_DATA.CITATIONS : CHART_DATA.WORKS)}
                    />
                    <div className={styles.chartContainer}>
                        <div className={styles.chartDescription}>{activeChart.description}</div>
                        <div className={styles.chart}>
                            <SimpleStatisticsChart title={activeChart.title} dataSet={activeChart.dataSet} labels={activeChart.labels} />
                        </div>
                        <div className={styles.chartSource}>Source : {activeChart.source}</div>
                        <div className={styles.chartDisclaimer}>{activeChart.disclaimer}</div>
                    </div>
                </div>
            </div>
            <div className={'line mb-4 flex flex-col border-y border-y-gray-200 py-3 xl:flex-row'}>
                <div className={`my-auto flex flex-col xl:w-6/12 ${biographyPresent ? `w-full overflow-y-auto ${showWholeBio ? 'sm:max-h-[400px]' : ''}` : ''}`}>
                    {biographyPresent ? (
                        <div className={clsx(styles.biographyWrapper, !showWholeBio ? styles.partialAbstract : '')} onClick={() => setShowWholeBio((prev) => !prev)}>
                            <div className={styles.biographyTitle}>
                                Biography <span className={'text-left text-sm text-gray-400 opacity-80'}>( Source: OrcId )</span>
                            </div>
                            <div className={styles.biographyText}>{authorObject.biography}</div>
                        </div>
                    ) : (
                        <div className={styles.biographyMissing}>Biography for this author is not available</div>
                    )}
                </div>
                <div className={`my-3 ml-auto flex w-full flex-col gap-3 px-5 xl:w-6/12`}>
                    <h4 className={styles.chartTitle}>Work Source Distribution</h4>
                    {width < 800 && <RowOfProperties properties={workSources} />}
                    <div className={'flex'}>
                        <div className={'w-full'}>
                            <SimpleDoughnutChart dataSet={DOUGHNUT_CHART_DATA.dataSet} labels={DOUGHNUT_CHART_DATA.labels} title={DOUGHNUT_CHART_DATA.title} className={'mx-auto max-h-52'} />
                            <div className={styles.chartDisclaimer}>{DOUGHNUT_CHART_DATA.disclaimer}</div>
                            <div className={styles.chartDescription}>{DOUGHNUT_CHART_DATA.description}</div>
                        </div>
                        {width >= 800 && <RowOfProperties properties={workSources} vertical className={'w-fit'} />}
                    </div>
                </div>
            </div>
            <div className={styles.listsContainer}>
                <div className={'flex justify-center space-x-4'}>
                    {authorObject.id === user?.author?.id && (
                        <div className="flex items-center gap-2">
                            <Checkbox id="showHiddenWorks" checked={showHiddenWorks} onChange={() => setShowHiddenWorks((prev) => !prev)} />
                            <Label htmlFor="showHiddenWorks" className="flex">
                                Show Hidden Works
                            </Label>
                        </div>
                    )}
                    <Filters authors={[authorObject]} filters={filters} dispatch={dispatch} />
                </div>
                {showHiddenWorks ? (
                    <HiddenWorks author={authorObject} />
                ) : (
                    <PaginatedList
                        response={authorWorks}
                        renderFn={renderWorkItem}
                        parser={Work.parseResponseWork}
                        collapsable={width <= 765}
                        className={'order-2 w-full xl:order-none xl:border-r xl:border-r-gray-300'}
                        title={`Works`}
                        header={isUser ? '' : `( Only works co-authored with registered users appear in the list )`}
                        gap={7}
                        loading={loading}
                        onLinkClick={handleGetPage}
                        perPage={filters.per_page ?? 10}
                    />
                )}
            </div>
        </div>
    );
};

AuthorPage.propTypes = {
    author: object,
    uniqueWorksCounts: shape({ ORCID: number, OpenAlex: number, Crossref: number }).isRequired,
    topCoAuthors: array,
};

const styles = {
    infoContainer: 'flex flex-col lg:flex-row pb-4 w-full',
    properties: 'w-full lg:w-5/12 flex flex-col',
    statusWrapper: 'rounded-lg p-3 my-auto',
    statusHeader: 'font-semibold mb-2 text-sm lg:text-lg',
    status: 'text-gray-700 italic text-xs lg:text-base',
    lastUpdated: 'mt-2 text-gray-500 opacity-80 text-xs lg:text-sm',
    chartsContainer: 'w-full lg:7/12 flex flex-col h-full my-auto',
    chartContainer: 'flex flex-col h-full',
    chartDescription: 'text-gray-500 opacity-75 italic mx-auto mb-3 max-w-3xl overflow-visible text-center text-sm',
    chartTitle: 'text-black mx-auto mb-2 text-center',
    chartSource: 'text-gray-500 opacity-75 italic mx-auto text-center',
    chartDisclaimer: 'text-gray-500 opacity-75 italic mx-auto mt-3 text-center text-sm',
    chart: 'md:px-4 mb-4 max-w-full',
    listsContainer: 'flex flex-col gap-4',
    listTitle: '2xl:text-xl font-semibold mb-4 text-yellow-800',
    listText: 'mx-2 text-xs sm:text-sm text-gray-600 opacity-50',
    biographyMissing: 'text-gray-700 opacity-75 italic m-auto text-center pb-5 sm:pb-0 text-lg xl:text-2xl border-b border-b-gray-400 sm:border-b-0 ',
    biographyWrapper: 'w-full mb-7 pr-7 xl:border-r xl:border-r-gray-300',
    biographyText: 'text-gray-500 flex-wrap whitespace-pre-wrap 2xl:text-lg cursor-pointer text-left',
    biographyTitle: 'my-3 text-yellow-800 2xl:text-lg',
    partialAbstract: 'line-clamp-6 xl:line-clamp-13 leading-relaxed overflow-ellipsis',
};
export default AuthorPage;
