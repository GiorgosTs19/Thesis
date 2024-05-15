import React from "react";
import {instanceOf, string} from "prop-types";
import {highlightMatchingCharacters} from "@/Components/Search/Utils/Utils.jsx";
import {ChevronRightSVG} from "@/SVGS/ChevronRightSVG.jsx";
import {SOURCES, Work} from "@/Models/Work/Work.js";
import {Tooltip} from "flowbite-react";
import {FaCircleNodes} from "react-icons/fa6";
import {OpenAlexSVG} from "@/SVGS/OpenAlexSVG.jsx";
import {OrcidSVG} from "@/SVGS/OrcidSVG.jsx.jsx";
import {DoiSVG} from "@/SVGS/DoiSVG.jsx";

const styles = {
    index: 'text-black text-sm lg:text-base 2xl:text-lg flex flex-col gap-2 text-center m-auto w-1/12',
}

export const WorkSearchResult = ({work, query}) => {
    const {
        title,
        localUrl
    } = work;

    const getSourceIcon = () => {
        if (work.isAggregated) {
            return (
                <Tooltip className={'flex'} content="Unified version: This version combines information from multiple sources into a comprehensive representation of the work.">
                    <FaCircleNodes width={24} height={24} className={'mx-auto w-[24px] h-[24px]'}/>
                </Tooltip>
            );
        }
        switch (work.source) {
            case SOURCES.OPENALEX:
                return (
                    <Tooltip className={'flex'} content="All the information about this work version was retrieved from Open Alex" >
                        <OpenAlexSVG className={'mx-auto'}/>
                    </Tooltip>
                );
            case SOURCES.ORCID:
                return (
                    <Tooltip className={'flex'} content="All the information about this work version was retrieved from ORCID">
                        <OrcidSVG className={'mx-auto'}/>
                    </Tooltip>
                );
            case SOURCES.CROSSREF:
                return (
                    <Tooltip className={'flex'} content="All the information about this work version was retrieved from CROSSREF">
                        <DoiSVG className={'mx-auto'}/>
                    </Tooltip>
                );
        }
    };

    return <li className="flex-grow list-none flex justify-between hover:bg-gray-100 p-2 rounded-lg">
        <div className={styles.index}>
            {getSourceIcon()}
        </div>
        <a className={'flex flex-col w-11/12 ml-2'} href={localUrl}>
            <div
                className={'pl-3 text-black font-bold truncate whitespace-pre-wrap hover:underline cursor-pointer text-sm lg:text-lg border-l-2 border-l-blue-700'}>
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
