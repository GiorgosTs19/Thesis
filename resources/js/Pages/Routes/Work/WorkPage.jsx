import React, { useState } from 'react';
import { object } from 'prop-types';
import { Work } from '@/Models/Work/Work.js';
import RowOfProperties from '@/Components/RowOfProperties/RowOfProperties.jsx';
import SimpleStatisticsChart from '@/Charts/SimpleStatisticsChart/SimpleBarChart.jsx';
import clsx from 'clsx';

const styles = {
    propertiesContainer: 'flex flex-col',
    chartContainer: 'flex flex-col rounded-lg p-4 mb-7 4xl:mb-7 xl:mb-0 flex-grow',
    chartDescription: 'text-gray-500 opacity-75 italic mx-auto mb-4',
    chart: 'md:px-4 mb-4 max-w-full',
    chartDisclaimer: 'text-gray-500 text-sm text-center opacity-75 italic mx-auto my-2',
    abstractWrapper: 'rounded-lg w-full mb-10 xl:mb-0 w-full xl:max-w-5/12 mr-5 h-full 4xl:mb-10',
    partialAbstract: 'line-clamp-6 leading-relaxed overflow-ellipsis',
    abstractText: 'text-gray-500 2xl:text-lg  4xl:text-xl',
    abstractTitle: 'my-3 text-yellow-800 2xl:text-lg',
    authorList: 'w-full ',
    title: 'text-xl lg:text-3xl mb-2 p-1 text-center',
    authorElement: 'hover:underline text-xs lg:text-sm',
};
const WorkPage = ({ work }) => {
    const workObject = Work.parseResponseWork(work);
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
    };

    return (
        <>
            <div className={'mx-auto mt-10 lg:px-5 xl:w-10/12'}>
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
                    <div className={styles.propertiesContainer}>
                        <RowOfProperties properties={workObject.getProperties()}></RowOfProperties>
                    </div>
                    <div className={'mb-5 flex w-full flex-col xl:flex-row'}>
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
                        <div className={styles.chartContainer}>
                            {REFERENCES_CHART.dataSet.length ? (
                                <>
                                    <div className={styles.chartDescription}>{REFERENCES_CHART.description}</div>
                                    <div className={styles.chart}>
                                        <SimpleStatisticsChart
                                            title={REFERENCES_CHART.title}
                                            dataSet={REFERENCES_CHART.dataSet}
                                            labels={REFERENCES_CHART.labels}
                                        />
                                    </div>
                                    <div className={styles.chartDisclaimer}>{REFERENCES_CHART.disclaimer}</div>
                                </>
                            ) : (
                                <div className={'m-auto p-3 text-center text-2xl'}>References Metrics are not available for this work!</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

WorkPage.propTypes = {
    work: object,
};
export default WorkPage;
