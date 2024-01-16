import React, {useState} from "react";
import {ExternalSVG} from "@/SVGS/ExternalSVG.jsx";
import {capitalizeFirstLetter} from "@/Utility/Strings/Utils.js";
import {instanceOf, number} from "prop-types";
import {Work} from "@/Models/Work/Work.js";

const MAX_VISIBLE_AUTHORS = 4;
export const WorkItem = ({work, index}) => {
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
            <a href={`http://127.0.0.1:8000/Author/${author.openAlexId}`}
               className={'hover:underline'}>{author.name} </a>
            {index < authors.length && ', '}
        </React.Fragment>
    ));

    const remainingAuthors = authors.length - MAX_VISIBLE_AUTHORS;

    return <li className="mb-4 flex-grow list-none flex">
        <div className="top-0 left-0 text-black text-sm flex flex-col gap-4 text-center">
            {index}
            <a href={doi} title={'Open to source'} className={'mr-1'}><ExternalSVG width={26} height={26}/></a>
        </div>
        <div className={'flex flex-col'}>
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
                    font-bold truncate whitespace-pre-wrap hover:underline">
                    {title}
                </a>
            </div>
            <div className="pl-3 text-blue-500 ">
                {authorElements}
                {remainingAuthors > 0 && !showAllAuthors ? (
                        <span className={'cursor-pointer underline text-amber-950 ml-2'}
                              onClick={() => setShowAllAuthors(true)}>{`+${remainingAuthors} more`}</span>) :
                    remainingAuthors > 0 && (<span className={'cursor-pointer underline text-amber-950 ml-2 '}
                                                   onClick={() => setShowAllAuthors(false)}>{`show less`}</span>)}
            </div>
        </div>
    </li>
}

WorkItem.propTypes = {
    work: instanceOf(Work),
    index: number.isRequired
}
