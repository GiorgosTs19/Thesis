import React, { useState } from 'react';
import { ExternalSVG } from '@/SVGS/ExternalSVG.jsx';
import { capitalizeFirstLetter } from '@/Utility/Strings/Utils.js';
import { bool, instanceOf, number } from 'prop-types';
import { Work } from '@/Models/Work/Work.js';
import clsx from 'clsx';
import { Modal } from 'flowbite-react';
import { useClickAway } from '@uidotdev/usehooks';
import DropDownMenu from '@/Components/DropDownMenu/DropDownMenu.jsx';

const MAX_VISIBLE_AUTHORS = 4;
const styles = {
    authorElement: 'hover:underline text-xs lg:text-sm',
    li: 'flex justify-between flex-grow',
    index: 'top-0 left-0 pr-2 text-black text-sm lg:text-base 2xl:text-lg flex flex-col gap-2 text-center h-fit',
    infoContainer: 'flex flex-col',
    innerInfoContainer: 'flex flex-wrap border-l-2 border-l-blue-700',
    infoProperty: 'text-gray-600 pl-3 text-xs md:text-sm',
    title: 'text-black text-sm lg:text-base font-bold truncate whitespace-pre-wrap hover:underline',
    authorsList: 'pl-3 text-blue-500',
    showMoreLessAuthors: 'cursor-pointer underline text-amber-950 ml-2 text-xs lg:text-sm',
};
export const WorkItem = ({
    work,
    index,
    authorToExclude,
    hideAuthors = false,
    hideType = false,
    hideOA = false,
    hidePublicationDate = false,
    hideCitations = false,
    hideLanguage = false,
    highlightUserAuthors = true,
    hideVersions = false,
}) => {
    const { doi, title, authors, type, isOA, publicationYear, referencedByCount, language, localUrl, source, versions } = work;
    const [versionsOpen, setVersionsOpen] = useState(false);
    const [showAllAuthors, setShowAllAuthors] = useState(false);
    const visibleAuthors = showAllAuthors ? authors : authors.slice(0, MAX_VISIBLE_AUTHORS);
    const filteredAuthors = authorToExclude ? visibleAuthors.filter((author) => author.id !== authorToExclude) : visibleAuthors;

    const modalRef = useClickAway(() => {
        setVersionsOpen(false);
    });

    const authorElements = filteredAuthors.map((author, index) => {
        return (
            <React.Fragment key={index}>
                <a href={author.localUrl} className={clsx(styles.authorElement, author.isUser && highlightUserAuthors ? 'font-bold' : '')}>
                    {author.name}
                </a>
                {index < filteredAuthors.length - 1 && ', '}
            </React.Fragment>
        );
    });

    const remainingAuthors = authors.length - MAX_VISIBLE_AUTHORS;

    // TODO implement when authentication is implemented.
    // const hideWork = () => {
    //
    // }

    const handleOpenVersions = () => setVersionsOpen(true);

    const dropDownOptions = [{ name: 'Hide Work', value: 1, default: false }];

    return (
        <li className={styles.li}>
            <Modal show={versionsOpen} onClose={() => setVersionsOpen(false)} ref={modalRef}>
                <Modal.Header>{title} Versions</Modal.Header>
                <Modal.Body>
                    <div className={'mb-5 text-center text-gray-400 opacity-85'}>
                        {versions.length} more {versions.length < 2 ? 'version' : 'versions'} of this work
                    </div>
                    <div className="space-y-6">
                        {versions.map((item, index) => (
                            <WorkItem key={index} work={item} index={index + 1} />
                        ))}
                    </div>
                </Modal.Body>
            </Modal>
            <div className={'mb-5 flex h-fit flex-grow list-none '}>
                <div className={styles.index}>
                    {index}
                    <DropDownMenu dotsButton smallDots verticalDots options={dropDownOptions} />
                </div>
                <div className={styles.infoContainer}>
                    <div className={styles.innerInfoContainer}>
                        {!hideType && <div className={styles.infoProperty}>{capitalizeFirstLetter(type)}</div>}
                        {!hideOA && <div className={styles.infoProperty}>{isOA ? 'Open Access Available' : 'Open Access Unavailable'}</div>}
                        {!hidePublicationDate && <div className={styles.infoProperty}>Published: {publicationYear}</div>}
                        {!hideCitations && <div className={styles.infoProperty}>Citations: {referencedByCount}</div>}
                        {!hideLanguage && <div className={styles.infoProperty}>Language: {language}</div>}
                        <div className={styles.infoProperty}>Source: {source}</div>
                        {!hideVersions && versions.length > 0 && (
                            <div className={'cursor-pointer pl-3 text-xs text-blue-500 hover:underline md:text-sm'} onClick={handleOpenVersions}>
                                ( + {versions.length} {versions.length < 2 ? 'version' : 'versions'} )
                            </div>
                        )}
                    </div>
                    <div className={'pl-3'}>
                        <a href={localUrl} className={styles.title}>
                            {title ?? 'Title Unavailable'}
                        </a>
                    </div>
                    {!hideAuthors && (
                        <div className={styles.authorsList}>
                            {authorElements}
                            {remainingAuthors > 0 && !showAllAuthors ? (
                                <span
                                    className={styles.showMoreLessAuthors}
                                    onClick={() => setShowAllAuthors(true)}
                                >{`+${remainingAuthors} more`}</span>
                            ) : (
                                remainingAuthors > 0 && (
                                    <span className={styles.showMoreLessAuthors} onClick={() => setShowAllAuthors(false)}>{`show less`}</span>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
            <a href={doi} title={'Go to source'} className={'mt-2'}>
                <ExternalSVG width={26} height={26} />
            </a>
        </li>
    );
};

WorkItem.propTypes = {
    work: instanceOf(Work).isRequired,
    index: number.isRequired,
    authorToExclude: number,
    hideAuthors: bool,
    hideType: bool,
    hideOA: bool,
    hidePublicationDate: bool,
    hideCitations: bool,
    hideLanguage: bool,
    highlightUserAuthors: bool,
    hideVersions: bool,
};
