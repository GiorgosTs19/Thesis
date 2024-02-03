import React from "react";
import {DoiSVG} from "@/SVGS/DoiSVG.jsx";
import {OpenAlexSVG} from "@/SVGS/OpenAlexSVG.jsx";
import {OrcidSVG} from "@/SVGS/OrcidSVG.jsx.jsx";
import {ScopusSVG} from "@/SVGS/ScopusSVG.jsx";
import {bool} from "prop-types";

const styles = {
    wrapper: 'flex flex-col',
    tipsWrapper: 'flex flex-col mx-auto text-center mt-4',
    tipsHeader: 'text-lg font-semibold text-yellow-800 text-auto',
    tipsSubHeader: 'text-sm font-semibold my-2 text-gray-500 mx-2',
    list: 'flex gap-4 mx-auto',
    subTip: 'text-sm font-semibold my-2 text-gray-500 mx-auto mt-4 text-center'
}
const SearchTips = ({onlyWorks, onlyAuthors}) => {
    const shouldShowWorkTips = !onlyAuthors || onlyWorks;
    const shouldShowAuthorTips = onlyAuthors || !onlyWorks;
    return (
        <div className={styles.wrapper}>
            <div className={styles.tipsWrapper}>
                {shouldShowAuthorTips && <>
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
                </>}
                {shouldShowWorkTips && <>
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
                </>}
            </div>
            {shouldShowWorkTips && <div className={styles.subTip}>
                * To perform a search with DOI, only provide the part that comes after `https://doi.org`
            </div>}
            <div className={styles.subTip}>
                {(shouldShowAuthorTips || shouldShowWorkTips) ? '*' : '**'} To perform a search with any external id,
                only
                provide the ID and not the link to it.
            </div>
        </div>
    )
}
SearchTips.propTypes = {
    onlyWorks: bool,
    onlyAuthors: bool
}
export default SearchTips;
