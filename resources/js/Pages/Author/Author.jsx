import React from 'react';
import PropTypes, {array, bool, number, string} from 'prop-types';
import BaseLayout from "@/Layouts/BaseLayout.jsx";
import SimpleStatisticsChart from "@/Charts/SimpleStatisticsChart/SimpleStatisticsChart.jsx";

Author.propTypes = {

};

Work.propTypes = {
    title:string,
    authors:array,
    is_oa:bool,
    published_at:string,
    referenced_works_count:number,
    language:string
}
function Work({work}) {
    const {
        title,
        authors,
        is_oa,
        published_at,
        referenced_works_count,
        language
    } = work;
    return <div>
        <li className="mb-4 flex-grow list-decimal">
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

            <p className="text-black border-l-2 border-l-blue-700 pl-3 text-lg font-bold whitespace-pre-wrap">
                {title}
            </p>
            <p className="text-blue-500 border-l-2 border-l-blue-600 pl-3">
                {
                    authors.map((author, index) => <a key={index}
                    href={`http://127.0.0.1:8000/Author/${author.open_alex_id}`}>{author.name} </a>)
                }
            </p>
        </li>
    </div>
}

function Author({author}) {
    console.log(author)
    const {
        name,
        is_user,
        citation_count,
        works_count,
        open_alex_id,
        scopus_id,
        orc_id,
        works,
        statistics
    } = author;

    const ids = [
        {name: 'Open Alex', value: open_alex_id},
        {name: 'Scopus', value: scopus_id},
        {name: 'OrcId', value: orc_id}
    ];

    return (
        <>
            <BaseLayout title={name}>
            <div className="bg-gray-100 flex items-center max-w-9xl mx-auto">
                    <div className="bg-white w-full p-4">
                        <div className="flex flex-wrap mx-auto">
                            <div className="rounded-lg p-6 flex flex-col md:flex-row gap-8 flex-grow flex-wrap">
                                <div className="mb-4 flex-grow">
                                    <p className="text-black border-l-2 border-l-blue-600 pl-3 text-lg font-bold">
                                        {citation_count}
                                    </p>
                                    <p className="text-gray-600 border-l-2 border-l-blue-600 pl-3">
                                        Citations
                                    </p>
                                </div>

                                <div className="mb-4 flex-grow">
                                    <p className="text-black border-l-2 border-l-blue-600 pl-3 text-lg font-bold">
                                        {works_count}
                                    </p>
                                    <p className="text-gray-600 border-l-2 border-l-blue-600 pl-3">
                                        Works
                                    </p>
                                </div>
                                {
                                    ids.map(item =>
                                        <div key={item.name} className="mb-4 flex-grow">
                                            <p className="text-black border-l-2 border-l-blue-600 pl-3 text-lg font-bold">
                                                {item.value}
                                            </p>
                                            <p className="text-gray-600 border-l-2 border-l-blue-600 pl-3">
                                                {item.name}
                                            </p>
                                        </div>)
                                }
                            </div>
                            {/*<div className="px-4 mb-4 flex-grow">*/}
                            {/*    <SimpleStatisticsChart*/}
                            {/*            statistics={statistics}*/}
                            {/*            title={'Citations count per year'}*/}
                            {/*            yAxisName={'Citations count'}*/}
                            {/*            xAxisName={'Year'}*/}
                            {/*        />*/}
                            {/*</div>*/}
                        </div>


                        <div className="mt-8">
                            <div className="rounded-lg bg-yellow-100 p-6 ">
                                <h2 className="text-lg font-semibold mb-4 text-yellow-800">Works</h2>
                                <ul className="list-disc pl-6">
                                    {works.map((work) => (
                                        <Work work={work} key={work.doi}/>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Additional Section */}
                        {/*<div className="mt-8">*/}
                        {/*    <div className="rounded-lg bg-gray-200 p-6">*/}
                        {/*        <h2 className="text-lg font-semibold mb-4 text-gray-800">Additional Section</h2>*/}
                        {/*        /!* Add content for the additional section *!/*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </BaseLayout>
        </>
    )


}

export default Author;
