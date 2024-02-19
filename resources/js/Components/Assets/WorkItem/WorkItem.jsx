import React, {useState} from "react";
import {ExternalSVG} from "@/SVGS/ExternalSVG.jsx";
import {capitalizeFirstLetter} from "@/Utility/Strings/Utils.js";
import {bool, instanceOf, number} from "prop-types";
import {Work} from "@/Models/Work/Work.js";
import clsx from "clsx";

const MAX_VISIBLE_AUTHORS = 4;
const styles = {
    authorElement: 'hover:underline text-xs lg:text-sm',
    li: 'flex-grow list-none flex',
    index: 'top-0 left-0 pr-2 text-black text-sm lg:text-base 2xl:text-lg flex flex-col gap-4 text-center',
    infoContainer: 'flex flex-col',
    innerInfoContainer: 'flex flex-wrap border-l-2 border-l-blue-700',
    infoProperty: 'text-gray-600 pl-3 text-xs md:text-sm',
    title: 'text-black text-sm lg:text-base font-bold truncate whitespace-pre-wrap hover:underline',
    authorsList: 'pl-3 text-blue-500',
    showMoreLessAuthors: 'cursor-pointer underline text-amber-950 ml-2 text-xs lg:text-sm'
}
export const WorkItem = ({
                             work, index, authorToExclude, hideAuthors = false,
                             hideType = false, hideOA = false, hidePublicationDate = false,
                             hideCitations = false, hideLanguage = false, highlightUserAuthors = false
                         }) => {
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
    const visibleAuthors = showAllAuthors ? authors.sort((a, b) => {
        if (a.isUser === b.isUser) {
            return 0; // Leave them unchanged relative to each other
        } else if (a.isUser) {
            return -1; // a comes before b
        } else {
            return 1; // b comes before a
        }
    }) : authors.sort((a, b) => {
        if (a.isUser === b.isUser) {
            return 0; // Leave them unchanged relative to each other
        } else if (a.isUser) {
            return -1; // a comes before b
        } else {
            return 1; // b comes before a
        }
    }).slice(0, MAX_VISIBLE_AUTHORS);

    const filteredAuthors = authorToExclude
        ? visibleAuthors.filter(author => author.id !== authorToExclude)
        : visibleAuthors;

    const authorElements = filteredAuthors.map((author, index) => {
        return (
            <React.Fragment key={index}>
                <a href={author.localUrl}
                   className={clsx(styles.authorElement, author.isUser && highlightUserAuthors ? 'font-bold' : '')}>{author.name} </a>
                {index < filteredAuthors.length - 1 && ', '}
            </React.Fragment>
        )
    });

    const remainingAuthors = authors.length - MAX_VISIBLE_AUTHORS;

    return <li className={styles.li}>
        <div className={styles.index}>
            {index}
            <a href={doi} title={'Open to source'} className={'mr-1'}><ExternalSVG width={26} height={26}/></a>
        </div>
        <div className={styles.infoContainer}>
            <div className={styles.innerInfoContainer}>
                {!hideType && <div className={styles.infoProperty}>
                    {capitalizeFirstLetter(type)}
                </div>}
                {!hideOA && <div className={styles.infoProperty}>
                    {isOA ? 'Open Access Available' : 'Open Access Unavailable'}
                </div>}
                {!hidePublicationDate && <div className={styles.infoProperty}>
                    Published : {publishedAt}
                </div>}
                {!hideCitations && <div className={styles.infoProperty}>
                    Citations : {referencedWorksCount}
                </div>}
                {!hideLanguage && <div className={styles.infoProperty}>
                    Language : {language}
                </div>}
            </div>
            <div className={'pl-3'}>
                <a href={localUrl} className={styles.title}>
                    {title ?? 'Title Unavailable'}
                </a>
            </div>
            {!hideAuthors && <div className={styles.authorsList}>
                {authorElements}
                {remainingAuthors > 0 && !showAllAuthors ? (
                        <span className={styles.showMoreLessAuthors}
                              onClick={() => setShowAllAuthors(true)}>{`+${remainingAuthors} more`}</span>) :
                    remainingAuthors > 0 && (<span className={styles.showMoreLessAuthors}
                                                   onClick={() => setShowAllAuthors(false)}>{`show less`}</span>)}
            </div>}
        </div>
    </li>
}

WorkItem.propTypes = {
    work: instanceOf(Work),
    index: number.isRequired,
    authorToExclude: number,
    hideAuthors: bool,
    hideType: bool,
    hideOA: bool,
    hidePublicationDate: bool,
    hideCitations: bool,
    hideLanguage: bool,
    highlightUserAuthors: bool
}
