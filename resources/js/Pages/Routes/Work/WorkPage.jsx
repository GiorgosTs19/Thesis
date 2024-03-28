import React, { useState } from 'react';
import { array, object } from 'prop-types';
import { Work } from '@/Models/Work/Work.js';
import RowOfProperties from '@/Components/RowOfProperties/RowOfProperties.jsx';
import SimpleStatisticsChart from '@/Charts/SimpleStatisticsChart/SimpleBarChart.jsx';
import clsx from 'clsx';
import { WorkItem } from '@/Components/Assets/WorkItem/WorkItem.jsx';

const styles = {
    propertiesContainer: 'flex flex-col',
    chartContainer: 'flex flex-col rounded-lg p-4 mb-7 4xl:mb-7 xl:mb-0 flex-grow',
    chartDescription: 'text-gray-500 opacity-75 italic mx-auto mb-4',
    chart: 'md:px-4 mb-4 max-w-full',
    chartDisclaimer: 'text-gray-500 text-sm text-center opacity-75 italic mx-auto my-2',
    abstractWrapper: 'rounded-lg w-full mb-10 xl:mb-0 w-full xl:max-w-5/12 mr-5 4xl:mb-10 px-7',
    partialAbstract: 'line-clamp-6 leading-relaxed overflow-ellipsis',
    abstractText: 'text-gray-500 2xl:text-lg  4xl:text-xl',
    abstractTitle: 'my-3 text-yellow-800 2xl:text-lg',
    authorList: 'w-full ',
    title: 'text-xl lg:text-3xl mb-2 p-1 text-center',
    authorElement: 'hover:underline text-xs lg:text-sm',
};
const WorkPage = ({ work, workVersions }) => {
    const workObject = Work.parseResponseWork(work);
    const versions = workVersions.map((item) => Work.parseResponseWork(item));
    const { title } = workObject;
    const { statistics, authors } = workObject;
    const yearsArray = statistics
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
    const abstractPresent = !!workObject.abstract;
    const abstractTooLong = workObject.abstract?.length > 550;
    const [showPartialAbstract, setShowPartialAbstract] = useState(abstractTooLong);

    const REFERENCES_CHART = {
        dataSet: statistics.map((statistic) => statistic.citedCount),
        title: 'References',
        labels: yearsArray,
        description: 'References trends per year.',
        disclaimer:
            'The data presented in this chart may not capture the complete set of references for' +
            ' this work. The statistics gathered might not cover every year, potentially leading' +
            ' to gaps in the information.',
        source: 'Open Alex',
    };

    return (
        <div className={'mx-auto mt-10 w-full lg:px-5 3xl:w-8/12'}>
            <div className="mb-4 flex flex-col gap-2">
                <h3 className={styles.title}>{title}</h3>
                <div className={'mx-auto text-center'}>
                    {authors.map((author, index) => (
                        <React.Fragment key={index}>
                            <a href={author.localUrl} className={clsx(styles.authorElement, author.isUser ? 'font-bold' : '')}>
                                {author.name}
                            </a>
                            {index < authors.length - 1 && ', '}
                        </React.Fragment>
                    ))}
                </div>
                <div className={'flex flex-col'}>
                    <RowOfProperties properties={workObject.getProperties()} className={'my-auto'} />
                    {workObject.abstract && (
                        <div
                            className={clsx(
                                styles.abstractWrapper,
                                showPartialAbstract ? styles.partialAbstract : '',
                                abstractTooLong ? 'cursor-pointer' : '',
                            )}
                            onClick={() => setShowPartialAbstract((prev) => !prev)}
                        >
                            <div className={styles.abstractTitle}>Abstract</div>
                            <div
                                className={clsx(
                                    showPartialAbstract ? styles.partialAbstract : '',
                                    abstractTooLong ? 'cursor-pointer' : '',
                                    styles.abstractText,
                                )}
                            >
                                {workObject.abstract}
                            </div>
                        </div>
                    )}
                    <div className={`${abstractPresent ? 'mt-5' : 'my-auto'} flex w-full flex-col`}>
                        {REFERENCES_CHART.dataSet.length ? (
                            <div className={styles.chartContainer}>
                                <>
                                    <div className={styles.chartDescription}>{REFERENCES_CHART.description}</div>
                                    <div className={styles.chartDescription}>Source : {REFERENCES_CHART.source}</div>
                                    <div className={styles.chart}>
                                        <SimpleStatisticsChart
                                            title={REFERENCES_CHART.title}
                                            dataSet={REFERENCES_CHART.dataSet}
                                            labels={REFERENCES_CHART.labels}
                                        />
                                    </div>
                                    <div className={styles.chartDisclaimer}>{REFERENCES_CHART.disclaimer}</div>
                                </>
                            </div>
                        ) : (
                            <div className={'mx-auto p-3 text-center text-2xl'}>References Metrics are not available for this work!</div>
                        )}
                    </div>
                    {versions.length > 0 && (
                        <div className={'my-3 flex flex-col'}>
                            <div className={'mb-5 text-center text-lg text-gray-400 opacity-85'}>
                                {versions.length} more {versions.length < 2 ? 'version' : 'versions'} of this work
                            </div>
                            <ul className={'mx-auto text-left'}>
                                {versions.map((item, index) => (
                                    <WorkItem key={index} work={item} index={index + 1} hideVersions />
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

WorkPage.propTypes = {
    work: object.isRequired,
    workVersions: array,
};
export default WorkPage;
