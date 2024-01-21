import React from "react";
import {instanceOf, string} from "prop-types";
import {Author} from "@/Models/Author/Author.js";
import {highlightMatchingCharacters} from "@/Components/Search/Utils/Utils.jsx";
import {ChevronRightSVG} from "@/SVGS/ChevronRightSVG.jsx";

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

    return <li className="mb-4 flex-grow list-none flex justify-between hover:bg-gray-100 p-2 rounded-lg">
        <a className={'flex flex-col'} href={localUrl}>
            <div className={'flex flex-wrap border-l-2 border-l-blue-700'}>
                {
                    extraProperties.map((property, index) =>
                        <div key={index} className="text-gray-600 pl-3 text-sm">
                            {property.name} : {highlightMatchingCharacters(property.value, query)}
                        </div>
                    )
                }
            </div>
            <div className={'pl-3 text-black text-lg font-bold truncate whitespace-pre-wrap hover:underline'}>

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
