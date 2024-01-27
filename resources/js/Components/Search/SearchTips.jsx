import React from "react";
import {ChevronRightSVG} from "@/SVGS/ChevronRightSVG.jsx";
import {arrayOf, func, string} from "prop-types";
import {DoiSVG} from "@/SVGS/DoiSVG.jsx";
import {OpenAlexSVG} from "@/SVGS/OpenAlexSVG.jsx";
import {OrcidSVG} from "@/SVGS/OrcidSVG.jsx.jsx";
import {ScopusSVG} from "@/SVGS/ScopusSVG.jsx";

const styles = {
    wrapper: 'flex flex-col',
    recentWrapper: 'flex flex-col border-b border-b-gray-200 py-2',
    recentHeader: 'text-sm font-semibold my-2 text-gray-500 mx-2',
    recentQuery: 'flex-grow list-none flex justify-between hover:bg-gray-100 p-2 rounded-lg cursor-pointer text-xs lg:text-sm',
    tipsWrapper: 'flex flex-col mx-auto text-center mt-4',
    tipsHeader: 'text-lg font-semibold text-yellow-800 text-auto',
    tipsSubHeader: 'text-sm font-semibold my-2 text-gray-500 mx-2',
    list: 'flex gap-4 mx-auto',
    subTip: 'text-sm font-semibold my-2 text-gray-500 mx-auto mt-4 text-center'
}
const SearchTips = ({setData, recentQueries}) => {
    return (
        <div className={styles.wrapper}>
            {recentQueries.length > 0 &&
                <div className={styles.recentWrapper}>
                    <h4 className={styles.recentHeader}>Recently Searched</h4>
                    <ul className={'gap-2'}>
                        {recentQueries.map((query, index) => <li key={index} onClick={() => setData(query)}
                                                                 className={styles.recentQuery}>
                            <div>
                                {query}
                            </div>
                            <div>
                                <ChevronRightSVG/>
                            </div>
                        </li>)}
                    < /ul>
                </div>}
            <div className={styles.tipsWrapper}>
                <div className={styles.tipsHeader}>
                    Explore the catalog of renowned authors and their works
                </div>
                <h4 className={styles.tipsSubHeader}>Search for authors
                    using</h4>
                <ul className={styles.list}>
                    <li className={'text-lg'} title={"Author's name"}>
                        Author Name
                    </li>
                    <li className={'my-auto'} title={'Scopus Id'}>
                        <ScopusSVG/>
                    </li>
                    <li className={'my-auto'} title={'Orcid Id'}>
                        <OrcidSVG/>
                    </li>
                    <li className={'my-auto'} title={'Open Alex Id'}>
                        <OpenAlexSVG/>
                    </li>
                </ul>
                <h4 className={styles.tipsSubHeader}>Search for works
                    using</h4>
                <ul className={'flex gap-4 mx-auto'}>
                    <li className={'text-lg'} title={"Work's title"}>
                        Work Title
                    </li>
                    <li className={'my-auto'} title={'DOI'}>
                        <DoiSVG/>
                    </li>
                    <li className={'my-auto'} title={'Open Alex Id'}>
                        <OpenAlexSVG/>
                    </li>
                </ul>
            </div>
            <div className={styles.subTip}>
                * To perform a search with DOI, only provide the part that comes after `https://doi.org`
            </div>
            <div className={styles.subTip}>
                ** To perform a search with any external id, only provide the ID and not the link to it.
            </div>
        </div>
    )
}

export default SearchTips;

SearchTips.propTypes = {
    setData: func.isRequired,
    recentQueries: arrayOf(string).isRequired
}
