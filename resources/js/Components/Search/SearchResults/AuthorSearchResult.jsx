import React from 'react';
import { bool, func, instanceOf, string } from 'prop-types';
import { Author } from '@/Models/Author/Author.js';
import { highlightMatchingCharacters } from '@/Components/Search/Utils/Utils.jsx';
import { ChevronRightSVG } from '@/SVGS/ChevronRightSVG.jsx';
import { Checkbox, Label } from 'flowbite-react';
import clsx from 'clsx';

const styles = {
    li: 'flex-grow list-none flex hover:bg-gray-100 p-2 rounded-lg',
    a: 'flex flex-col',
    properties: 'flex flex-wrap border-l-2 border-l-blue-700',
    property: 'text-gray-600 pl-3 text-xs lg:text-sm',
    name: 'pl-3 text-black font-bold truncate whitespace-pre-wrap hover:underline text-sm lg:text-lg',
};
export const AuthorSearchResult = ({
    author,
    query,
    selectable,
    onSelect = (any) => {
        any;
    },
    selected = (any) => {
        any;
    },
}) => {
    const { name, localUrl } = author;

    const extraProperties = [
        { name: 'Open Alex', value: author.openAlexId ?? '-' },
        { name: 'Scopus', value: author.scopusId ?? '-' },
        { name: 'OrcId', value: author.orcId ?? '-' },
    ];

    const content = (
        <>
            <div className={styles.properties}>
                {extraProperties.map((property, index) => (
                    <div key={index} className={styles.property}>
                        {property.name} : {highlightMatchingCharacters(property.value, query)}
                    </div>
                ))}
            </div>
            <div className={styles.name}>{highlightMatchingCharacters(name, query)}</div>
        </>
    );

    return (
        <li className={clsx(styles.li, selectable ? '' : 'cursor-pointer justify-between')}>
            {selectable ? (
                <>
                    <Checkbox id={author.id} className={'mr-5'} onChange={() => onSelect(author)} checked={selected(author)} />
                    <Label htmlFor={author.id} className={'h-full w-full'}>
                        {content}
                    </Label>
                </>
            ) : (
                <a className={styles.a} href={localUrl}>
                    {content}
                </a>
            )}
            {!selectable && (
                <div>
                    <ChevronRightSVG />
                </div>
            )}
        </li>
    );
};

AuthorSearchResult.propTypes = {
    author: instanceOf(Author).isRequired,
    query: string.isRequired,
    selectable: bool,
    onSelect: func,
    selected: func,
};
