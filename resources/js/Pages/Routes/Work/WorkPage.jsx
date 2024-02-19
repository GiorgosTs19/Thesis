import React from "react";
import {object} from "prop-types";
import {Work} from "@/Models/Work/Work.js";
import RowOfProperties from "@/Components/RowOfProperties/RowOfProperties.jsx";
import SimpleStatisticsChart from "@/Charts/SimpleStatisticsChart/SimpleStatisticsChart.jsx";
import List from "@/Components/List/List.jsx";
import {AuthorItem} from "@/Components/Assets/AuthorItem/AuthorItem.jsx";

const styles = {
    propertiesContainer: 'flex flex-col',
    chartContainer: 'flex flex-col rounded-lg p-4 mb-7 4xl:mb-7 xl:mb-0 flex-grow',
    chartDescription: 'text-gray-500 opacity-75 italic mx-auto mb-4',
    chart: 'md:px-4 mb-4 max-w-full',
    chartDisclaimer: 'text-gray-500 text-sm text-center opacity-75 italic mx-auto my-2',
    abstractWrapper: 'p-3 rounded-lg w-full mb-10 xl:mb-0 xl:w-5/12 4xl:w-full mr-5 h-full 4xl:mb-10',
    abstractText: 'text-gray-500 flex-wrap whitespace-pre-wrap 2xl:text-lg  4xl:text-xl',
    abstractTitle: 'my-3 text-yellow-800 2xl:text-lg',
    authorList: 'w-full '
}
const WorkPage = ({work}) => {
    const workObject = Work.parseResponseWork(work);
    const {title} = workObject;
    const {statistics, authors} = workObject
    const yearsArray = statistics.map((statistic) => statistic.year);

    const REFERENCES_CHART = {
        dataSet: statistics.map((statistic) => statistic.citedCount),
        title: 'References',
        labels: yearsArray,
        description: 'References trends per year.',
        disclaimer: 'The data presented in this chart may not capture the complete set of references for' +
            ' this work. The statistics gathered might not cover every year, potentially leading' +
            ' to gaps in the information.'
    }

    const renderAuthorItem = (item, index) => {
        return <AuthorItem author={item} index={index} key={index}/>
    }

    return <>
        <div className={'lg:px-5'}>
            <div className="mb-4">
                <div className={styles.propertiesContainer}>
                    <RowOfProperties properties={workObject.getProperties()}
                                     title={title}></RowOfProperties>
                </div>
                <div className={'flex flex-col xl:flex-row 4xl:flex-col mb-5'}>
                    {workObject.abstract && <div className={styles.abstractWrapper}>
                        <div className={styles.abstractTitle}>
                            Abstract
                        </div>
                        <div className={styles.abstractText}>
                            {workObject.abstract}
                        </div>
                    </div>}
                    <div className={styles.chartContainer}>
                        {REFERENCES_CHART.dataSet.length ?
                            <>
                                <div className={styles.chartDescription}>{REFERENCES_CHART.description}</div>
                                <div className={styles.chart}>
                                    <SimpleStatisticsChart title={REFERENCES_CHART.title}
                                                           dataSet={REFERENCES_CHART.dataSet}
                                                           labels={REFERENCES_CHART.labels}/>
                                </div>
                                <div className={styles.chartDisclaimer}>
                                    {REFERENCES_CHART.disclaimer}
                                </div>
                            </>
                            :
                            <div className={'text-2xl text-center m-auto p-3'}>References Metrics are not available
                                for this work!</div>}
                    </div>
                </div>
            </div>
            <List data={authors} renderFn={renderAuthorItem}
                  wrapperClassName={styles.authorList} title={'Authors'}/>
        </div>
    </>
}

WorkPage.propTypes = {
    work: object,
}
export default WorkPage;

