import React, {useState} from 'react';
import {arrayOf, instanceOf, node, oneOfType} from "prop-types";
import {Work} from "@/Models/Work/Work.js";
import useWorkSort from "@/Hooks/useWorksSort/useWorkSort.jsx";
import {capitalizeFirstLetter} from "@/Utility/Strings/Utils.js";

const MAX_VISIBLE_AUTHORS = 4;

const WorkItem = ({work}) => {
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

    return <li className="mb-4 flex-grow list-decimal ">
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

        <a className="text-black pl-3 text-lg
            font-bold truncate whitespace-pre-wrap hover:underline" href={doi}>
            {title}
        </a>
        <div className="pl-3 text-blue-500 ">
            {authorElements}
            {remainingAuthors > 0 && !showAllAuthors ?  (<span className={'cursor-pointer underline text-amber-950 ml-2'} onClick={()=>setShowAllAuthors(true)}>{`+${remainingAuthors} more`}</span>) :
                remainingAuthors > 0 && (<span className={'cursor-pointer underline text-amber-950 ml-2 '} onClick={()=>setShowAllAuthors(false)}>{`show Less`}</span>)}
        </div>
    </li>
}

const WorksList = ({works, children}) => {
    const [sortedWorks, sortingDropDown] = useWorkSort(works);

    return <div className="mt-4">
        <div className="rounded-lg bg-gray-200 p-6">
            <div className={'flex  mb-6'}>
                {children}
                {sortingDropDown}
            </div>
            <ul className="list-disc pl-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedWorks.map((work) =>
                    work.title.length >0 && <WorkItem work={work} key={work.doi}/>
                )}
            </ul>
        </div>
    </div>
}

WorkItem.propTypes = {
    work:instanceOf(Work)
}

WorksList.propTypes = {
    works: arrayOf(instanceOf(Work)).isRequired,
    children: oneOfType([arrayOf(instanceOf(node)), node])
}
export default WorksList;
