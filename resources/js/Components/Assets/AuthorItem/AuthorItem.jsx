import React from "react";
import {arrayOf, instanceOf, number, oneOfType, shape, string} from "prop-types";
import {Author} from "@/Models/Author/Author.js";
import {numberToDotNotation} from "@/Utility/Numbers/Utils.js";

export const AuthorItem = ({author, index, extraProperties = []}) => {
    const {
        name,
        citationCount,
        worksCount,
        isUser,
        localUrl
    } = author;

    return <li className="mb-4 flex-grow list-none flex">
        <div className="top-0 left-0 text-black text-sm text-center mr-2">
            {index + 1}
        </div>
        <div className={'flex flex-col'}>
            <div className={'flex flex-wrap border-l-2 border-l-blue-700'}>
                <div className="text-gray-600 pl-3 text-sm">
                    {isUser ? 'Registered User' : 'Guest User'}
                </div>
                <div className="text-gray-600 pl-3 text-sm">
                    Citations : {numberToDotNotation(citationCount)}
                </div>
                <div className="text-gray-600 pl-3 text-sm">
                    Works : {numberToDotNotation(worksCount)}
                </div>
                {
                    extraProperties.map((property, index) =>
                        <div key={index} className="text-gray-600 pl-3 text-sm">
                            {property.name} : {property.value}
                        </div>
                    )
                }
            </div>
            <div className={'pl-3'}>
                <a href={localUrl} className="text-black text-lg
                    font-bold truncate whitespace-pre-wrap hover:underline">
                    {name}
                </a>
            </div>
        </div>
    </li>
}

AuthorItem.propTypes = {
    author: instanceOf(Author),
    index: number.isRequired,
    extraProperties: arrayOf(shape({
        name: string,
        value: oneOfType([number, string])
    }))
}
