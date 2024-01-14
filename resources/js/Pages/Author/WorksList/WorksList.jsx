import React, {useMemo, useState} from 'react';
import {array, arrayOf, bool, instanceOf, node, number, oneOf, oneOfType, string} from "prop-types";
import {Work} from "@/Models/Work/Work.js";
import DropDownMenu from "@/Components/DropDownMenu/DropDownMenu.jsx";

const MAX_VISIBLE_AUTHORS = 4;

const WorkItem = ({work, highlighted}) => {
    const {
        title,
        authors,
        isOa,
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

    return <li className="mb-4 flex-grow list-decimal basis-1/3 px-4 ">
        <div className={'flex flex-wrap border-l-2 border-l-blue-700'}>
            <div className="text-gray-600  pl-3 text-sm">
                {isOa ? 'Open Access Available' : 'Open Access Unavailable'}
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

        <div className="text-black pl-3 text-lg
            font-bold truncate whitespace-pre-wrap">
            {title}
        </div>
        <div className="pl-3 text-blue-500 ">
            {authorElements}
            {remainingAuthors > 0 && !showAllAuthors ?  (<span className={'cursor-pointer underline text-amber-950 ml-2'} onClick={()=>setShowAllAuthors(true)}>{`+${remainingAuthors} more`}</span>) :
                remainingAuthors > 0 && (<span className={'cursor-pointer underline text-amber-950 ml-2 '} onClick={()=>setShowAllAuthors(false)}>{`show Less`}</span>)}
        </div>
    </li>
}

const WorksList = ({works, children}) => {
    const SORTING_OPTIONS = [
        {name:'Alphabetically ( A to Z )',value:0},
        {name:'Alphabetically ( Z to A )', value:1},
        {name:'Earliest Published', value:2},
        {name:'Latest Published', value:3},
        {name:'Lowest Citations', value:4},
        {name:'Highest Citations', value:5},
        {name:'Most Authors', value:6},
    ]

    const [sortingCriteria,setSortingCriteria] = useState(SORTING_OPTIONS[0].value);

    const sortedWorks = useMemo(() => {
        const titleSorting = (a, b) => {
            const titleA = a.title.toUpperCase();
            const titleB = b.title.toUpperCase();
            return titleA.localeCompare(titleB);
        };

        const publicationDateSorting = (a, b) => {
            const dateA = new Date(a.publishedAt);
            const dateB = new Date(b.publishedAt);
            return dateA - dateB;
        };

        const citedCountSorting = (a, b) => a.referencedWorksCount - b.referencedWorksCount;

        const authorsCountSorting = (a, b) => a.authors.length - b.authors.length;

        switch (sortingCriteria) {
            case 0:
                return [...works].sort(titleSorting);
            case 1:
                return [...works].sort((a, b) => -titleSorting(a, b));
            case 2:
                return [...works].sort(publicationDateSorting);
            case 3:
                return [...works].sort((a, b) => -publicationDateSorting(a, b));
            case 4:
                return [...works].sort(citedCountSorting);
            case 5:
                return [...works].sort((a, b) => -citedCountSorting(a, b));
            case 6:
                return [...works].sort((a, b) => -authorsCountSorting(a, b));
            default:
                return [...works];
        }
    }, [sortingCriteria, works]);


    console.log(sortedWorks)

    return <div className="mt-4">
        <div className="rounded-lg bg-gray-200 p-6">
            <div className={'flex  mb-6'}>
                {children}
                <DropDownMenu options={SORTING_OPTIONS} onSelect={(value)=>setSortingCriteria(value)} className={'ms-auto'} label={'Sort by'}/>
            </div>
            <ul className="list-disc pl-8 flex flex-wrap items-stretch">
                {sortedWorks.map((work) =>
                    work.title.length >0 && <WorkItem work={work} key={work.doi}/>
                )}
            </ul>
        </div>
    </div>
}

WorkItem.propTypes = {
    title: string,
    authors: array,
    is_oa: bool,
    published_at: string,
    referenced_works_count: number,
    language: string
}

WorksList.propTypes = {
    works: arrayOf(instanceOf(Work)).isRequired,
    children: oneOfType([arrayOf(instanceOf(node)), node])
}
export default WorksList;
