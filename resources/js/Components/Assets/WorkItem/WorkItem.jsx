import React, {useState} from "react";
import {ExternalSVG} from "@/SVGS/ExternalSVG.jsx";
import {capitalizeFirstLetter} from "@/Utility/Strings/Utils.js";
import {instanceOf, number} from "prop-types";
import {Work} from "@/Models/Work/Work.js";

const MAX_VISIBLE_AUTHORS = 4;
const styles = {
    authorElement: 'hover:underline text-xs lg:text-sm',
    li: 'flex-grow list-none flex',
    index: 'top-0 left-0 text-black text-sm flex flex-col gap-4 text-center',
    infoContainer: 'flex flex-col',
    innerInfoContainer: 'flex flex-wrap border-l-2 border-l-blue-700',
    infoProperty: 'text-gray-600  pl-3 text-xs lg:text-sm',
    title: 'text-black text-sm font-bold truncate whitespace-pre-wrap hover:underline',
    authorsList: 'pl-3 text-blue-500',
    showMoreLessAuthors: 'cursor-pointer underline text-amber-950 ml-2 text-xs lg:text-sm'
}
export const WorkItem = ({work, index, authorToExclude}) => {
    const {
        doi,
        title,
        authors,
        type,
        isOA,
        publishedAt,
        referencedWorksCount,
        language,
        localUrl
    } = work;

    const [showAllAuthors, setShowAllAuthors] = useState(false);
    const visibleAuthors = showAllAuthors ? authors : authors.slice(0, MAX_VISIBLE_AUTHORS);

    const filteredAuthors = authorToExclude
        ? visibleAuthors.filter(author => author.id !== authorToExclude)
        : visibleAuthors;

    const authorElements = filteredAuthors.map((author, index) => (
        <React.Fragment key={index}>
            <a href={`http://127.0.0.1:8000/Author/${author.openAlexId}`}
               className={styles.authorElement}>{author.name} </a>
            {index < filteredAuthors.length - 1 && ', '}
        </React.Fragment>
    ));

    const remainingAuthors = authors.length - MAX_VISIBLE_AUTHORS;

    return <li className={styles.li}>
        <div className={styles.index}>
            {index}
            <a href={doi} title={'Open to source'} className={'mr-1'}><ExternalSVG width={26} height={26}/></a>
        </div>
        <div className={styles.infoContainer}>
            <div className={styles.innerInfoContainer}>
                <div className={styles.infoProperty}>
                    {capitalizeFirstLetter(type)}
                </div>
                <div className={styles.infoProperty}>
                    {isOA ? 'Open Access Available' : 'Open Access Unavailable'}
                </div>
                <div className={styles.infoProperty}>
                    Published : {publishedAt}
                </div>
                <div className={styles.infoProperty}>
                    Citations : {referencedWorksCount}
                </div>
                <div className={styles.infoProperty}>
                    Language : {language}
                </div>
            </div>
            <div className={'pl-3'}>
                <a href={localUrl} className={styles.title}>
                    {title ?? 'Title Unavailable'}
                </a>
            </div>
            <div className={styles.authorsList}>
                {authorElements}
                {remainingAuthors > 0 && !showAllAuthors ? (
                        <span className={styles.showMoreLessAuthors}
                              onClick={() => setShowAllAuthors(true)}>{`+${remainingAuthors} more`}</span>) :
                    remainingAuthors > 0 && (<span className={styles.showMoreLessAuthors}
                                                   onClick={() => setShowAllAuthors(false)}>{`show less`}</span>)}
            </div>
        </div>
    </li>
}

WorkItem.propTypes = {
    work: instanceOf(Work),
    index: number.isRequired,
    authorToExclude: number
}
