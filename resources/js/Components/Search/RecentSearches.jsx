import { ChevronRightSVG } from '@/SVGS/ChevronRightSVG.jsx';
import React from 'react';
import useRecentSearchQueries from '@/Hooks/useSaveRecentSearchQueries/useRecentSearchQueries.js';
import { bool, func, string } from 'prop-types';

const styles = {
    recentWrapper: 'flex flex-col border-b border-b-gray-200 py-2',
    recentHeader: 'text-sm font-semibold my-2 text-gray-500 mx-2',
    recentQuery: 'flex-grow list-none flex justify-between hover:bg-gray-100 p-2 rounded-lg cursor-pointer text-xs lg:text-sm',
};
const RecentSearches = ({ query, setData, visible = true }) => {
    const recentQueries = useRecentSearchQueries(query);

    return (
        recentQueries.length > 0 &&
        visible && (
            <div className={styles.recentWrapper}>
                <h4 className={styles.recentHeader}>Recently Searched</h4>
                <ul className={'gap-2'}>
                    {recentQueries.map((query, index) => (
                        <li key={index} onClick={() => setData(query)} className={styles.recentQuery}>
                            <div>{query}</div>
                            <div>
                                <ChevronRightSVG />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        )
    );
};

export default RecentSearches;

RecentSearches.propTypes = {
    setData: func.isRequired,
    query: string,
    visible: bool,
};
