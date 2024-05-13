import { useEffect } from 'react';
import { useDebounce, useLocalStorage } from '@uidotdev/usehooks';

const TIME_TO_SAVE_RECENT_QUERY = 2000;
const useRecentSearchQueries = (query) => {
    const [recentQueries, saveRecentQueries] = useLocalStorage('recentQueries', []);
    const debouncedSearchQuery = useDebounce(query, TIME_TO_SAVE_RECENT_QUERY);

    useEffect(() => {
        if (debouncedSearchQuery.trim() === '' || recentQueries.find((query) => query.toLowerCase() === debouncedSearchQuery.toLowerCase()) || debouncedSearchQuery.length < 3) return;
        const updatedQueries = [debouncedSearchQuery, ...recentQueries.slice(0, 2)];
        saveRecentQueries(updatedQueries);
    }, [debouncedSearchQuery]);

    return recentQueries;
};

export default useRecentSearchQueries;
