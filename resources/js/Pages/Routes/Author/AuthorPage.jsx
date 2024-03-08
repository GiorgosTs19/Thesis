import { Work } from '@/Models/Work/Work.js';
import { Author } from '@/Models/Author/Author.js';
import Switch from '@/Components/Switch/Switch.jsx';
import React, { useCallback, useMemo, useState } from 'react';
import { WorkItem } from '@/Components/Assets/WorkItem/WorkItem.jsx';
import PaginatedList from '@/Components/PaginatedList/PaginatedList.jsx';
import PropTypes, { arrayOf, bool, number, object, shape, string } from 'prop-types';
import RowOfProperties from '@/Components/RowOfProperties/RowOfProperties.jsx';
import SimpleStatisticsChart from '@/Charts/SimpleStatisticsChart/SimpleBarChart.jsx';
import { getTopCoAuthors } from '@/Utility/Arrays/Utils.js';
import { AuthorItem } from '@/Components/Assets/AuthorItem/AuthorItem.jsx';
import List from '@/Components/List/List.jsx';
import { useWindowSize } from '@uidotdev/usehooks';
import clsx from 'clsx';
import SimpleDoughnutChart from '@/Charts/DoughnutChart/SimpleDoughnutChart.jsx';

const styles = {
    infoContainer: 'grid grid-cols-1 2xl:grid-cols-5 gap-4 mb-4',
    info: '2xl:col-span-2 flex flex-col',
    statusWrapper: 'rounded-lg p-3',
    statusHeader: 'font-semibold mb-2 text-sm lg:text-lg',
    status: 'text-gray-700 italic text-xs lg:text-base',
    lastUpdated: 'mt-2 text-gray-500 opacity-80 text-xs lg:text-sm',
    chartsContainer: '2xl:col-span-3 flex flex-col h-full',
    chartContainer: 'flex flex-col h-full',
    chartDescription: 'text-gray-500 opacity-75 italic mx-auto mb-4 max-w-3xl overflow-visible text-center',
    chart: 'md:px-4 mb-4 max-w-full',
    chartDisclaimer: 'text-gray-500 opacity-75 italic m-auto text-center',
    listsContainer: 'flex flex-col xl:flex-row gap-4',
    authorsListContainer: 'w-full flex flex-col ',
    worksListContainer: 'w-full flex flex-col',
    listTitle: '2xl:text-xl font-semibold mb-4 text-yellow-800',
    listText: 'mx-2 text-xs sm:text-sm text-gray-600 opacity-50',
    biographyWrapper: 'rounded-lg w-full mb-7',
    biographyText: 'text-gray-500 flex-wrap whitespace-pre-wrap 2xl:text-lg cursor-pointer text-left',
    biographyTitle: 'my-3 text-yellow-800 2xl:text-lg',
    partialAbstract: 'line-clamp-6 leading-relaxed overflow-ellipsis',
};
const AuthorPage = ({ author, works, sortingOptions, currentSortOption, uniqueWorksCounts }) => {
    const authorObject = useMemo(() => Author.parseResponseAuthor(author), [author]);
    const { name, isUser, updatedAt } = authorObject;
    const PROFILE_STATUS = {
        INCOMPLETE: `${name} is not a registered user, thus their list of works and information might be incomplete and not always up to date.`,
        REGISTERED: `${name} is a registered user, their info and works are regularly updated.`,
    };
    const { width } = useWindowSize();
    const [showWholeBio, setShowWholeBio] = useState(false);
    const authorStatistics = authorObject.statistics;
    const yearsArray = authorStatistics.map((statistic) => statistic.year);

    const CHART_DATA = {
        CITATIONS: {
            dataSet: authorStatistics.map((statistic) => statistic.citedCount),
            title: 'Citations',
            labels: yearsArray,
            description: 'Citation trends per year.',
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
            'Visualization of the distribution of works sourced from different platforms, including OpenAlex, ORCID and Crossref. ' +
            "It offers insights into the relative contribution of each platform to the overall collection of the author's works.",
        disclaimer: '',
    };
    const topCoAuthors = useMemo(() => getTopCoAuthors(authorObject.works, 5, authorObject), [authorObject.works]);

    const [activeChart, setActiveChart] = useState(CHART_DATA.CITATIONS);

    const renderWorkItem = useCallback(
        (work, index) => {
            return <WorkItem work={work} key={work.id} index={index} authorToExclude={authorObject.id} />;
        },
        [works],
    );

    const renderAuthorItem = (item, index) => (
        <AuthorItem
            key={item.value.id}
            author={item.value}
            index={index}
            extraProperties={[
                {
                    name: 'Works Co-Authored',
                    value: item.occurrences,
                },
            ]}
        />
    );

    const authorProperties = [
        ...authorObject.getProperties(),
        { name: 'OpenAlex Works', value: uniqueWorksCounts.OpenAlex },
        { name: 'Crossref Works', value: uniqueWorksCounts.Crossref },
        { name: 'OrcId Works', value: uniqueWorksCounts.ORCID }
    ];

    return (
        <div className={'flex flex-col py-2 xl:px-5'}>
            <div className={styles.infoContainer}>
                <div className={styles.info}>
                    <RowOfProperties properties={authorProperties} title={authorObject.name}></RowOfProperties>
                    <div className={styles.statusWrapper}>
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
                        <div className={styles.chartDisclaimer}>{activeChart.disclaimer}</div>
                    </div>
                </div>
            </div>
            <div className={'mb-5 mt-10 flex flex-col gap-5 border-b border-b-gray-300 pt-5'}>
                <h4 className={styles.chartDescription}>Work Source Distribution</h4>
                <SimpleDoughnutChart
                    dataSet={DOUGHNUT_CHART_DATA.dataSet}
                    labels={DOUGHNUT_CHART_DATA.labels}
                    title={DOUGHNUT_CHART_DATA.title}
                    className={'mx-auto max-h-52'}
                />
                <div className={styles.chartDescription}>{DOUGHNUT_CHART_DATA.description}</div>
            </div>
            {authorObject.biography && (
                <div
                    className={clsx(styles.biographyWrapper, !showWholeBio ? styles.partialAbstract : '')}
                    onClick={() => setShowWholeBio((prev) => !prev)}
                >
                    <div className={styles.biographyTitle}>
                        Biography <span className={'text-left text-sm text-gray-400 opacity-80'}>( Source: OrcId )</span>
                    </div>
                    <div className={styles.biographyText}>{authorObject.biography}</div>
                </div>
            )}
            <div className={styles.listsContainer}>
                <PaginatedList
                    response={works}
                    renderFn={renderWorkItem}
                    parser={Work.parseResponseWork}
                    collapsable={width <= 765}
                    sortingOptions={sortingOptions}
                    currentSortOption={currentSortOption}
                    useInertia
                    className={'order-2 w-full xl:order-none xl:border-r xl:border-r-gray-300'}
                    title={`Works`}
                    header={isUser ? '' : `( Only works co-authored with registered users appear in the list )`}
                />
                <List
                    data={topCoAuthors}
                    renderFn={renderAuthorItem}
                    wrapperClassName={'h-full xl:max-w-fit'}
                    title={'Top Co-Authors'}
                    vertical
                    header={`Top authors who have collaborated with ${authorObject.name} on various works`}
                    footer={'( Based on the works list in this page )'}
                    collapsable={width <= 765}
                />
            </div>
        </div>
    );
};

const SortingOptionPropTypes = PropTypes.shape({
    name: string.isRequired,
    value: number.isRequired,
    url: string.isRequired,
    default: bool.isRequired,
});

AuthorPage.propTypes = {
    author: object,
    works: shape({}),
    uniqueWorksCounts: shape({ ORCID: number, OpenAlex: number, Crossref:number }).isRequired,
    sortingOptions: arrayOf(SortingOptionPropTypes).isRequired,
    currentSortOption: number.isRequired,
};

export default AuthorPage;
