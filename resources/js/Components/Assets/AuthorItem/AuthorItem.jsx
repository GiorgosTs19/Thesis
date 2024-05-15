import React from 'react';
import { arrayOf, bool, instanceOf, node, number, oneOfType, shape, string } from 'prop-types';
import { Author } from '@/Models/Author/Author.js';
import { numberToDotNotation } from '@/Utility/Numbers/Utils.js';
import clsx from 'clsx';

export const AuthorItem = ({ author, index, extraProperties = [], children, highlightCitations = false, highlightWorks = false, hideProperties, showClaimedStatus, disableUrl, hideIndex }) => {
    const { name, citationCount, worksCount, isUser, localUrl } = author;

    return (
        <li className="mb-4 flex flex-grow list-none">
            <div className={'flex'}>
                <div className="left-0 top-0 mr-2 flex flex-col text-center text-sm text-black lg:text-base">
                    {!hideIndex ? index + 1 : null}
                    {children}
                </div>
                <div className={'flex flex-col'}>
                    {!hideProperties && (
                        <div className={'flex flex-wrap border-l-2 border-l-blue-700'}>
                            <div className="pl-3 text-xs text-gray-600 md:text-sm ">{isUser ? 'Registered User' : 'Guest User'}</div>
                            <div className={clsx('pl-3 text-xs text-gray-600 md:text-sm ', highlightCitations ? 'font-bold' : '')}>Citations: {numberToDotNotation(citationCount)}</div>
                            <div className={clsx('pl-3 text-xs text-gray-600 md:text-sm ', highlightWorks ? 'font-bold' : '')}>Works: {numberToDotNotation(worksCount)}</div>
                            {extraProperties.map((property, index) => (
                                <div key={index} className="pl-3 text-xs text-gray-600 md:text-sm ">
                                    {property.name} : {property.value}
                                </div>
                            ))}
                        </div>
                    )}
                    <div className={'pl-3 text-left'}>
                        {disableUrl ? (
                            <span
                                className={`left-0 truncate whitespace-pre-wrap
                                text-sm font-bold text-text md:text-base`}
                            >
                                {`${name} ${showClaimedStatus ? (author.claimed ? '(Claimed)' : '') : ''}`}
                            </span>
                        ) : (
                            <a
                                href={localUrl}
                                className={`left-0 truncate whitespace-pre-wrap
                                text-sm font-bold text-text hover:underline md:text-base`}
                            >
                                {`${name} ${showClaimedStatus ? (author.claimed ? '(Claimed)' : '') : ''}`}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </li>
    );
};

AuthorItem.propTypes = {
    author: instanceOf(Author).isRequired,
    index: number.isRequired,
    extraProperties: arrayOf(
        shape({
            name: string,
            value: oneOfType([number, string]),
        }),
    ),
    utilityColClassName: string,
    children: oneOfType([node, arrayOf(node)]),
    highlightCitations: bool,
    highlightWorks: bool,
    hideProperties: bool,
    showClaimedStatus: bool,
    disableUrl: bool,
};
