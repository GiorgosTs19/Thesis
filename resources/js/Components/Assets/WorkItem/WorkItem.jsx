import React, { useState } from 'react';
import { ExternalSVG } from '@/SVGS/ExternalSVG.jsx';
import { capitalizeFirstLetter } from '@/Utility/Strings/Utils.js';
import { bool, instanceOf, number, shape } from 'prop-types';
import { SOURCES, Work } from '@/Models/Work/Work.js';
import clsx from 'clsx';
import { Modal, Tooltip } from 'flowbite-react';
import { useClickAway } from '@uidotdev/usehooks';
import DropDownMenu from '@/Components/DropDownMenu/DropDownMenu.jsx';
import { containsKey } from '@/Utility/Objects/utils.js';
import { FaCircleNodes } from 'react-icons/fa6';
import { OpenAlexSVG } from '@/SVGS/OpenAlexSVG.jsx';
import { OrcidSVG } from '@/SVGS/OrcidSVG.jsx.jsx';
import { DoiSVG } from '@/SVGS/DoiSVG.jsx';

const MAX_VISIBLE_AUTHORS = 4;
const styles = {
    authorElement: 'text-xs lg:text-sm',
    authorElementLink: 'hover:underline text-xs lg:text-sm text-blue-500',
    li: 'flex justify-between',
    index: 'top-0 left-0 pr-2 text-black text-sm lg:text-base 2xl:text-lg flex flex-col gap-2 text-center h-fit',
    infoContainer: 'flex flex-col border-l-2 border-l-blue-700',
    innerInfoContainer: 'flex flex-wrap ',
    infoProperty: 'text-gray-600 pl-3 text-xs md:text-sm',
    title: 'text-black text-sm lg:text-base font-bold truncate whitespace-pre-wrap hover:underline',
    authorsList: 'pl-3',
    showMoreLessAuthors: 'cursor-pointer underline text-amber-950 ml-2 text-xs lg:text-sm',
};

export const PROPERTIES = {
    TYPE: 'type',
    AUTHORS: 'authors',
    OA: 'oa',
    VERSIONS: 'versions',
    PUBLICATION_DATE: 'publicationDate',
    LANGUAGE: 'lang',
    CITATIONS: 'citations',
};

export const WorkItem = ({ work, index, authorToExclude, hiddenProperties = {}, highlightUserAuthors, showUserOptions = false }) => {
    const { doi, title, authors, type, isOA, publicationYear, referencedByCount, language, localUrl, versions } = work;
    const [versionsOpen, setVersionsOpen] = useState(false);
    const [showAllAuthors, setShowAllAuthors] = useState(false);
    const visibleAuthors = showAllAuthors ? authors : authors.slice(0, MAX_VISIBLE_AUTHORS);
    const filteredAuthors = authorToExclude ? visibleAuthors.filter((author) => author.id !== authorToExclude) : visibleAuthors;

    const modalRef = useClickAway(() => {
        setVersionsOpen(false);
    });

    const authorElements = work.authorsAsString ? (
        <div>{work.authorsString}</div>
    ) : (
        filteredAuthors.map((author, index) => {
            return (
                <React.Fragment key={index}>
                    {author.localUrl ? (
                        <a href={author.localUrl} className={clsx(styles.authorElementLink, author.isUser ? 'font-bold' : '')}>
                            {author.name}
                        </a>
                    ) : (
                        <span className={clsx(styles.authorElement, author.isUser && highlightUserAuthors ? 'font-bold' : '')}>{author.name}</span>
                    )}
                    {index < filteredAuthors.length - 1 && ', '}
                </React.Fragment>
            );
        })
    );

    const remainingAuthors = authors.length - MAX_VISIBLE_AUTHORS;

    const authorsToShow = (
        <div className={styles.authorsList}>
            {authorElements}
            {remainingAuthors > 0 && !showAllAuthors ? (
                <span className={styles.showMoreLessAuthors} onClick={() => setShowAllAuthors(true)}>{`+${remainingAuthors} more`}</span>
            ) : (
                remainingAuthors > 0 && <span className={styles.showMoreLessAuthors} onClick={() => setShowAllAuthors(false)}>{`show less`}</span>
            )}
        </div>
    );

    // TODO implement when authentication is implemented.
    // const hideWork = () => {
    //
    // }

    const handleOpenVersions = () => setVersionsOpen(true);
    const getSourceIcon = () => {
        if (work.isAggregated) {
            return (
                <Tooltip content="Unified version: This version combines information from multiple sources into a comprehensive representation of the work.">
                    <FaCircleNodes className={'mx-2'} width={24} height={24} />
                </Tooltip>
            );
        }
        switch (work.source) {
            case SOURCES.OPENALEX:
                return (
                    <Tooltip content="All the information about this work version was retrieved from Open Alex">
                        <OpenAlexSVG className={'mx-2'} />
                    </Tooltip>
                );
            case SOURCES.ORCID:
                return (
                    <Tooltip content="All the information about this work version was retrieved from ORCID">
                        <OrcidSVG className={'mx-2'} />
                    </Tooltip>
                );
            case SOURCES.CROSSREF:
                return (
                    <Tooltip content="All the information about this work version was retrieved from CROSSREF">
                        <DoiSVG className={'mx-2'} />
                    </Tooltip>
                );
        }
    };
    const dropDownOptions = [{ name: 'Hide Work', value: 1, default: false }];
    const [multipleSources, sources] = work.getSources();
    return (
        <li className={styles.li}>
            <Modal show={versionsOpen} onClose={() => setVersionsOpen(false)} ref={modalRef} style={{ zIndex: 9999 }}>
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
                {showUserOptions && <DropDownMenu dotsButton smallDots verticalDots options={dropDownOptions} />}
                <div className={styles.index}>
                    {index}
                    {getSourceIcon()}
                </div>
                <div className={styles.infoContainer}>
                    <div className={styles.innerInfoContainer}>
                        {!containsKey(hiddenProperties, PROPERTIES.TYPE) && <div className={styles.infoProperty}>{capitalizeFirstLetter(type)}</div>}
                        {!containsKey(hiddenProperties, PROPERTIES.OA) && <div className={styles.infoProperty}>{isOA ? 'Open Access Available' : 'Open Access Unavailable'}</div>}
                        {!containsKey(hiddenProperties, PROPERTIES.PUBLICATION_DATE) && <div className={styles.infoProperty}>Published: {publicationYear ?? '-'}</div>}
                        {!containsKey(hiddenProperties, PROPERTIES.CITATIONS) && <div className={styles.infoProperty}>Citations: {referencedByCount ?? '-'}</div>}
                        {!containsKey(hiddenProperties, PROPERTIES.LANGUAGE) && <div className={styles.infoProperty}>Language: {language}</div>}
                        <div className={styles.infoProperty}>
                            {multipleSources ? 'Sources' : 'Source'}: {sources}
                        </div>
                        {!containsKey(hiddenProperties, PROPERTIES.VERSIONS) && versions.length > 0 && (
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
                    {!containsKey(hiddenProperties, PROPERTIES.AUTHORS) && authorsToShow}
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
    highlightUserAuthors: bool,
    hiddenProperties: shape({
        authors: bool,
        type: bool,
        oa: bool,
        publicationDate: bool,
        citations: bool,
        lang: bool,
        versions: bool,
    }),
    showUserOptions: bool,
};
