import React from "react";
import {object} from "prop-types";
import {Work} from "@/Models/Work/Work.js";
import RowOfProperties from "@/Components/RowOfProperties/RowOfProperties.jsx";
import SimpleStatisticsChart from "@/Charts/SimpleStatisticsChart/SimpleStatisticsChart.jsx";
import List from "@/Components/List/List.jsx";
import {AuthorItem} from "@/Components/Assets/AuthorItem/AuthorItem.jsx";

const styles = {
    container:'bg-gray-100 flex items-center justify-self-end h-full mx-auto',
    innerContainer:'bg-white w-full p-6 flex flex-col h-full rounded-lg',
    propertiesContainer:'flex flex-col',
    chartContainer:'flex flex-col bg-gray-100 rounded-lg p-4',
    chartDescription:'text-gray-500 opacity-75 italic mx-auto mb-4',
    chart:'md:px-4 mb-4 max-w-full',
    chartDisclaimer:'text-gray-500 text-sm text-center opacity-75 italic mx-auto my-2',
    authorList:'w-full'
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
        disclaimer:'The data presented in this chart may not capture the complete set of references for' +
            ' this work. The statistics gathered might not cover every year, potentially leading' +
            ' to gaps in the information.'
    }

    const renderAuthorItem = (item, index) => {
        return <AuthorItem author={item} index={index} key={index}/>
    }

    return <>
        <div className={styles.container}>
            <div className={styles.innerContainer}>
                <div className="gap-4 mb-4">
                    <div className={styles.propertiesContainer}>
                        <RowOfProperties properties={workObject.getProperties()}
                                         title={title}></RowOfProperties>
                        {/*<div className="rounded-lg bg-gray-100 px-6 py-4">*/}
                        {/*<h2 className="text-lg font-semibold mb-2">{isUser ? 'Registered User' : 'Incomplete Profile'}</h2>*/}
                        {/*<div*/}
                        {/*    className="text-gray-700 italic">{isUser ? PROFILE_STATUS.REGISTERED : PROFILE_STATUS.INCOMPLETE}</div>*/}
                        {/*<div className="mt-2 text-gray-500 opacity-80 text-sm">Last*/}
                        {/*    updated: {updatedAt}</div>*/}
                        {/*</div>*/}
                    </div>

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
                <List data={authors} renderFn={renderAuthorItem}
                      wrapperClassName={styles.authorList} title={'Authors'}/>
            </div>
        </div>
    </>
}

WorkPage.propTypes = {
    work: object,
}
export default WorkPage;

