import React from "react";
import {instanceOf, string} from "prop-types";
import {Author} from "@/Models/Author/Author.js";
import {highlightMatchingCharacters} from "@/Components/Search/Utils/Utils.jsx";
import {ChevronRightSVG} from "@/SVGS/ChevronRightSVG.jsx";

const styles = {
    li: 'flex-grow list-none flex justify-between hover:bg-gray-100 p-2 rounded-lg cursor-pointer',
    a: 'flex flex-col',
    properties: 'flex flex-wrap border-l-2 border-l-blue-700',
    property: 'text-gray-600 pl-3 text-xs lg:text-sm',
    name: 'pl-3 text-black font-bold truncate whitespace-pre-wrap hover:underline text-sm lg:text-lg'
}
export const AuthorSearchResult = ({author, query}) => {
    const {
        name,
        localUrl
    } = author;

    const extraProperties = [
        {name: 'Open Alex', value: author.openAlexId ?? '-'},
        {name: 'Scopus', value: author.scopusId ?? '-'},
        {name: 'OrcId', value: author.orcId ?? '-'}
    ];

    return <li
        className={styles.li}>
        <a className={styles.a} href={localUrl}>
            <div className={styles.properties}>
                {
                    extraProperties.map((property, index) =>
                        <div key={index} className={styles.property}>
                            {property.name} : {highlightMatchingCharacters(property.value, query)}
                        </div>
                    )
                }
            </div>
            <div
                className={styles.name}>
                {highlightMatchingCharacters(name, query)}
            </div>
        </a>
        <div>
            <ChevronRightSVG/>
        </div>
    </li>
}

AuthorSearchResult.propTypes = {
    author: instanceOf(Author).isRequired,
    query: string.isRequired,
}
