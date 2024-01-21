import React from "react";
import {instanceOf, string} from "prop-types";
import {highlightMatchingCharacters} from "@/Components/Search/Utils/Utils.jsx";
import {ChevronRightSVG} from "@/SVGS/ChevronRightSVG.jsx";
import {Work} from "@/Models/Work/Work.js";

export const WorkSearchResult = ({work, query}) => {
    const {
        title,
        localUrl
    } = work;

    return <li className="mb-4 flex-grow list-none flex justify-between hover:bg-gray-100 p-2 rounded-lg">
        <a className={'flex flex-col'} href={localUrl}>
            <div className={'pl-3 text-black text-lg font-bold truncate whitespace-pre-wrap hover:underline'}>
                {highlightMatchingCharacters(title, query)}
            </div>
        </a>
        <div>
            <ChevronRightSVG/>
        </div>
    </li>
}

WorkSearchResult.propTypes = {
    work: instanceOf(Work).isRequired,
    query: string.isRequired,
}
