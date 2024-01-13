import React, {useState} from 'react';
import {array, bool, number, object, string} from 'prop-types';
import BaseLayout from "@/Layouts/BaseLayout.jsx";
import {InfoSVG} from "@/SVGS/InfoSVG.jsx";
import SimpleStatisticsChart from "@/Charts/SimpleStatisticsChart/SimpleStatisticsChart.jsx";
import Switch from "@/Components/Switch/Switch.jsx";

const MAX_VISIBLE_AUTHORS = 4;

const PROFILE_STATUS = {
    INCOMPLETE:(name)=><div className={'whitespace-pre-wrap flex flex-wrap text-center'}><InfoSVG className={'mr-2'}/>
        {name} is not a registered user, thus the list of their works and some information might be incomplete and not always up to date.
     </div>,
    REGISTERED:(name)=><div>
        {name} is a registered user, their info and works are regularly updated.
    </div>,

}
const Work = ({work}) => {
    const {
        title,
        authors,
        is_oa,
        published_at,
        referenced_works_count,
        language
    } = work;
    const [showAllAuthors, setShowAllAuthors] = useState(false);

    const authorElements = (showAllAuthors ? authors : authors.slice(0, MAX_VISIBLE_AUTHORS)).map((author, index) => (
        <React.Fragment key={index}>
            <a href={`http://127.0.0.1:8000/Author/${author.open_alex_id}`} className={'hover:underline'}>{author.name} </a>
            {index < authors.length  && ', '}
        </React.Fragment>
    ));

    const remainingAuthors = authors.length - MAX_VISIBLE_AUTHORS ;

    return <li className="mb-4 flex-grow list-decimal">
            <div className={'flex flex-wrap'}>
                <div className="text-gray-600  pl-3 text-sm">
                    {is_oa ? 'Open Access Available' : 'Open Access Unavailable'}
                </div>
                <div className="text-gray-600 pl-3 text-sm">
                    Published : {published_at}
                </div>
                <div className="text-gray-600 pl-3 text-sm">
                    Citations : {referenced_works_count}
                </div>
                <div className="text-gray-600 pl-3 text-sm">
                    Language : {language}
                </div>
            </div>

            <div className="text-black border-l-2 border-l-blue-700 pl-3 text-lg
            font-bold truncate flex-wrap whitespace-pre-wrap">
                {title}
            </div>
            <div className="border-l-2 border-l-blue-600 pl-3 text-blue-500 ">
                {authorElements}
                {remainingAuthors > 0 && !showAllAuthors ?  (<span className={'cursor-pointer underline text-amber-950 ml-2'} onClick={()=>setShowAllAuthors(true)}>{`+${remainingAuthors} more`}</span>) :
                remainingAuthors > 0 && (<span className={'cursor-pointer underline text-amber-950 ml-2 '} onClick={()=>setShowAllAuthors(false)}>{`show Less`}</span>)}
            </div>
        </li>
}

 const Author = ({author, wosrks}) => {
    console.log(wosrks)
    const {
        name,
        is_user,
        citation_count,
        works_count,
        open_alex_id,
        scopus_id,
        orc_id,
        works,
        statistics,
        updated_at
    } = author;

    const ids = [
        {name: 'Open Alex', value: open_alex_id ?? '-'},
        {name: 'Scopus', value: scopus_id ?? '-'},
        {name: 'OrcId', value: orc_id ?? '-'}
    ];

    const yearsArray = statistics.map(statistic=>statistic.year);

     const CHART_DATA = {
         CITATIONS : {
             dataSet:statistics.map(statistic=>statistic.cited_count),
             title:'Citations',
             labels:yearsArray,
         },
         WORKS : {
             dataSet:statistics.map(statistic=>statistic.works_count),
             title:'Works',
             labels:yearsArray,
         }
     }

     const [activeChart, setActiveChart] = useState(CHART_DATA.CITATIONS);
     console.log(activeChart)
    return (
        <>
            <BaseLayout title={name}>
                <div className="bg-gray-100 flex items-center max-w-9xl mx-auto">
                    <div className="bg-white w-full p-6 flex flex-col">
                        <div className="rounded-lg p-6 flex flex-wrap gap-8">
                            <div className="mb-4 w-fit flex-grow">
                                <p className="text-black border-l-2 border-l-blue-600 pl-3 text-lg font-bold">
                                    {citation_count}
                                </p>
                                <p className="text-gray-600 border-l-2 border-l-blue-600 pl-3">
                                    Citations
                                </p>
                            </div>

                            <div className="mb-4 w-fit flex-grow">
                                <p className="text-black border-l-2 border-l-blue-600 pl-3 text-lg font-bold">
                                    {works_count}
                                </p>
                                <p className="text-gray-600 border-l-2 border-l-blue-600 pl-3">
                                    Works
                                </p>
                            </div>

                            {ids.map(item => (
                                <div key={item.name} className="mb-4 w-fit flex-grow">
                                    <p className="text-black border-l-2 border-l-blue-600 pl-3 text-lg font-bold">
                                        {item.value}
                                    </p>
                                    <p className="text-gray-600 border-l-2 border-l-blue-600 pl-3">
                                        {item.name}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <Switch checkedLabel={CHART_DATA.WORKS.title} uncheckedLabel={CHART_DATA.CITATIONS.title}
                                checked={activeChart.title !== CHART_DATA.CITATIONS.title} className={'mx-auto my-4'}
                                onChange={(checked)=>setActiveChart(checked ?  CHART_DATA.CITATIONS : CHART_DATA.WORKS)}/>

                        <div className="px-4 mb-4 overflow-x-auto w-full">
                            <SimpleStatisticsChart title={activeChart.title} dataSet={activeChart.dataSet} labels={activeChart.labels} />
                        </div>

                        <div className="mt-4">
                            <div className="rounded-lg bg-gray-100 px-6 py-4">
                                <h2 className="text-lg font-semibold mb-2">{is_user ? 'Registered User' : 'Incomplete Profile'}</h2>
                                <div className={'text-gray-700 italic'}>{is_user ? PROFILE_STATUS.REGISTERED(name) : PROFILE_STATUS.INCOMPLETE(name)}</div>
                                <div className={'mt-2 text-gray-500 opacity-80 text-sm'}>Last updated : {updated_at}</div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="rounded-lg bg-gray-200 p-6">
                                <div className="text-lg font-semibold mb-4 text-yellow-800">
                                    Works
                                    <span className={'mx-2 text-gray-600 opacity-50'}>{is_user ? '' : `(Only works co-authored with registered users appear in the list )`}</span>
                                </div>
                                <ul className="list-disc pl-8">
                                    {works.map((work) => (
                                        <Work work={work} key={work.doi}/>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </BaseLayout>
        </>
    )


}

Author.propTypes = {
    author:object
};

Work.propTypes = {
    title:string,
    authors:array,
    is_oa:bool,
    published_at:string,
    referenced_works_count:number,
    language:string
}


export default Author;
