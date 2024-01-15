import React, {useState} from 'react';
import {array, arrayOf, bool, instanceOf, number, shape, string} from "prop-types";
import {Work} from "@/Models/Work/Work.js";
import useWorkSort from "@/Hooks/useWorksSort/useWorkSort.jsx";
import {capitalizeFirstLetter} from "@/Utility/Strings/Utils.js";
import {Pagination} from "@/Components/Pagination/Pagination.jsx";

const MAX_VISIBLE_AUTHORS = 4;

const WorkItem = ({work, index}) => {
    const {
        doi,
        title,
        authors,
        type,
        isOA,
        publishedAt,
        referencedWorksCount,
        language
    } = work;

    const [showAllAuthors, setShowAllAuthors] = useState(false);

    const authorElements = (showAllAuthors ? authors : authors.slice(0, MAX_VISIBLE_AUTHORS)).map((author, index) => (
        <React.Fragment key={index}>
            <a href={`http://127.0.0.1:8000/Author/${author.openAlexId}`} className={'hover:underline'}>{author.name} </a>
            {index < authors.length  && ', '}
        </React.Fragment>
    ));

    const remainingAuthors = authors.length - MAX_VISIBLE_AUTHORS ;

    return <li className="mb-4 flex-grow list-none ml-6">
        <div className="top-0 left-0 -ml-6 mt-2 text-black text-sm">
            {index}
        </div>
        <div className={'flex flex-wrap border-l-2 border-l-blue-700'}>
            <div className="text-gray-600  pl-3 text-sm">
                {capitalizeFirstLetter(type)}
            </div>
            <div className="text-gray-600  pl-3 text-sm">
                {isOA ? 'Open Access Available' : 'Open Access Unavailable'}
            </div>
            <div className="text-gray-600 pl-3 text-sm">
                Published : {publishedAt}
            </div>
            <div className="text-gray-600 pl-3 text-sm">
                Citations : {referencedWorksCount}
            </div>
            <div className="text-gray-600 pl-3 text-sm">
                Language : {language}
            </div>
        </div>
        <div className={'pl-3'}>
            <a className="text-black text-lg
                font-bold truncate whitespace-pre-wrap hover:underline" href={doi}>
                {title}
            </a>
        </div>
        <div className="pl-3 text-blue-500 ">
            {authorElements}
            {remainingAuthors > 0 && !showAllAuthors ? (<span className={'cursor-pointer underline text-amber-950 ml-2'}
                                                              onClick={() => setShowAllAuthors(true)}>{`+${remainingAuthors} more`}</span>) :
                remainingAuthors > 0 && (<span className={'cursor-pointer underline text-amber-950 ml-2 '}
                                               onClick={() => setShowAllAuthors(false)}>{`show Less`}</span>)}
        </div>
    </li>
}

const WorksList = ({response, isUser}) => {
    const works = response.data.map(work => Work.parseResponseWork(work))
    const [sortedWorks, sortingDropDown] = useWorkSort(works);
    return <div className="">
        <div className="rounded-lg bg-gray-200 px-6 py-4 flex flex-col">
            <div className={'grid grid-cols-1 sm:grid-cols-2 mb-4'}>
                <div className={'col-span-1'}>
                    <div className="text-lg font-semibold mb-4 text-yellow-800">
                        Works
                        <span
                            className={'mx-2 text-gray-600 opacity-50'}>{isUser ? '' : `(Only works co-authored with registered users appear in the list )`}</span>
                    </div>
                </div>
                <div className={'col-span-1 flex'}>
                    {sortingDropDown}
                </div>
            </div>
            <ul className="list-disc pl-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedWorks.map((work, index) =>
                    work.title.length >0 && <WorkItem work={work} key={work.doi} index={response.meta.from + index}/>
                )}
            </ul>
            <Pagination response={response} className={'mx-auto mt-2'}/>
        </div>
    </div>
}

WorkItem.propTypes = {
    work:instanceOf(Work),
    index:number.isRequired
}

WorksList.propTypes = {
    isUser: bool.isRequired,
    response:shape({
        data:array.isRequired,
        links:shape({
            first:string.isRequired,
            last:string.isRequired,
            prev:string,
            next:string,
        }),
        meta:shape({
            current_page:number,
            from:number,
            last_page:number,
            per_page:number.isRequired,
            path:string.isRequired,
            to:number.isRequired,
            total:number.isRequired,
            links:arrayOf(shape({
                url:string,
                label:string.isRequired,
                active:bool.isRequired
            })),
        })
    })
}
export default WorksList;
