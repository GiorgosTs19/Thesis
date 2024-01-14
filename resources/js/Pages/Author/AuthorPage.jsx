import React, {useMemo, useState} from 'react';
import {object} from 'prop-types';
import BaseLayout from "@/Layouts/BaseLayout.jsx";
import SimpleStatisticsChart from "@/Charts/SimpleStatisticsChart/SimpleStatisticsChart.jsx";
import Switch from "@/Components/Switch/Switch.jsx";
import {Author} from "@/Models/Author/Author.js";
import WorksList from "@/Pages/Author/WorksList/WorksList.jsx";
import RowOfProperties from "@/Components/RowOfProperties/RowOfProperties.jsx";

 const AuthorPage = ({author, wosrks}) => {
    const authorObject = useMemo(()=>Author.parseResponseAuthor(author),[author]);

    const {
        name,
        isUser,
        citationCount,
        worksCount,
        openAlexId,
        scopusId,
        orcId,
        updatedAt
    } = authorObject;

     const PROFILE_STATUS = {
         INCOMPLETE: `${name} is not a registered user, thus their list of works and information might be incomplete and not always up to date.`,
         REGISTERED: `${name} is a registered user, their info and works are regularly updated`,
     }

    const properties = [
        {name:'Citations', value:  citationCount},
        {name:'Works', value:  worksCount},
        {name: 'Open Alex', value: openAlexId ?? '-'},
        {name: 'Scopus', value: scopusId ?? '-'},
        {name: 'OrcId', value: orcId ?? '-'}
    ];

    const authorStatistics = authorObject.statistics;
    const authorWorks = authorObject.works;

    const yearsArray = authorStatistics.map((statistic)=>statistic.year);

    const CHART_DATA = {
         CITATIONS : {
             dataSet:authorStatistics.map((statistic)=>statistic.citedCount),
             title:'Citations',
             labels:yearsArray,
             description: 'Citation trends per year.',
         },
         WORKS : {
            dataSet:authorStatistics.map((statistic)=>statistic.worksCount),
            title:'Works',
            labels:yearsArray,
            description: 'Distribution of works authored per year.',
         }
    }

    const [activeChart, setActiveChart] = useState(CHART_DATA.CITATIONS);

    return (
        <>
            <BaseLayout title={name}>
                <div className="bg-gray-100 flex items-center justify-self-end">
                    <div className="bg-white w-full p-6 flex flex-col">
                        <RowOfProperties properties={properties}></RowOfProperties>

                        <Switch checkedLabel={CHART_DATA.WORKS.title} uncheckedLabel={CHART_DATA.CITATIONS.title}
                                checked={activeChart.title !== CHART_DATA.CITATIONS.title} className={'mx-auto my-4'}
                                onChange={(checked)=> setActiveChart(checked ?  CHART_DATA.CITATIONS : CHART_DATA.WORKS)}/>
                        <div className={'px-4 flex flex-col'}>
                            <div className={'text-gray-500 opacity-75 italic mx-auto mb-4'}>
                                {activeChart.description}
                            </div>
                            <div className="px-4 mb-4 max-w-full">
                                <SimpleStatisticsChart title={activeChart.title} dataSet={activeChart.dataSet} labels={activeChart.labels} />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="rounded-lg bg-gray-100 px-6 py-4">
                                <h2 className="text-lg font-semibold mb-2">{isUser ? 'Registered User' : 'Incomplete Profile'}</h2>
                                {/*<div className={'whitespace-pre-wrap flex flex-wrap text-center'}><InfoSVG className={'mr-2'}/>*/}
                                <div className={'text-gray-700 italic'}>{isUser ? PROFILE_STATUS.REGISTERED : PROFILE_STATUS.INCOMPLETE}</div>
                                <div className={'mt-2 text-gray-500 opacity-80 text-sm'}>Last updated : {updatedAt}</div>
                            </div>
                        </div>

                        <WorksList works={authorWorks}>
                            <div className="text-lg font-semibold mb-4 text-yellow-800">
                                Works
                                <span
                                    className={'mx-2 text-gray-600 opacity-50'}>{isUser ? '' : `(Only works co-authored with registered users appear in the list )`}</span>
                            </div>
                        </WorksList>
                    </div>
                </div>
            </BaseLayout>
        </>
    )
 }

AuthorPage.propTypes = {
    author: object
};

export default AuthorPage;
