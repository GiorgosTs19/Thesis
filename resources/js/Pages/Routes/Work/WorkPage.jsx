import React from "react";
import {object} from "prop-types";
import {Work} from "@/Models/Work/Work.js";
import RowOfProperties from "@/Components/RowOfProperties/RowOfProperties.jsx";
import SimpleStatisticsChart from "@/Charts/SimpleStatisticsChart/SimpleStatisticsChart.jsx";
import List from "@/Components/List/List.jsx";

const WorkPage = ({work}) => {
    const workObject = Work.parseResponseWork(work);
    const {statistics, authors} = workObject
    const yearsArray = statistics.map((statistic) => statistic.year);

    const REFERENCES_CHART = {
        dataSet: statistics.map((statistic) => statistic.citedCount),
        title: 'References',
        labels: yearsArray,
        description: 'References trends per year.',
    }

    const renderAuthorItem = (item, index) => {
        return <div key={index}>{item.name}</div>
    }

    return <>
        <div className="bg-gray-100 flex items-center justify-self-end h-full ">
            <div className="bg-white w-full p-6 flex flex-col h-full rounded-lg">
                <div className="grid grid-cols-1 2xl:grid-cols-5 gap-4 mb-4">
                    <div className="2xl:col-span-2 flex flex-col">
                        <RowOfProperties properties={workObject.getProperties()}
                                         title={workObject.title}></RowOfProperties>
                        <div className="rounded-lg bg-gray-100 px-6 py-4">
                            {/*<h2 className="text-lg font-semibold mb-2">{isUser ? 'Registered User' : 'Incomplete Profile'}</h2>*/}
                            {/*<div*/}
                            {/*    className="text-gray-700 italic">{isUser ? PROFILE_STATUS.REGISTERED : PROFILE_STATUS.INCOMPLETE}</div>*/}
                            {/*<div className="mt-2 text-gray-500 opacity-80 text-sm">Last*/}
                            {/*    updated: {updatedAt}</div>*/}
                        </div>
                    </div>

                    <div className="2xl:col-span-3 flex flex-col">
                        <div className="flex flex-col">
                            <div
                                className="text-gray-500 opacity-75 italic mx-auto mb-4">{REFERENCES_CHART.description}</div>
                            <div className="md:px-4 mb-4 max-w-full">
                                <SimpleStatisticsChart title={REFERENCES_CHART.title}
                                                       dataSet={REFERENCES_CHART.dataSet}
                                                       labels={REFERENCES_CHART.labels}/>
                            </div>
                        </div>
                    </div>
                </div>
                <List data={authors} renderFn={renderAuthorItem}>
                    <div className="text-lg font-semibold mb-4 text-yellow-800">
                        Authors
                    </div>
                </List>
            </div>
        </div>
    </>
}

WorkPage.propTypes = {
    work: object,
}
export default WorkPage;

