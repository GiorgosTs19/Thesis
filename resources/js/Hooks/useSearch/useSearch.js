import {useEffect, useState} from "react";
import {useForm} from "@inertiajs/inertia-react";

const useSearch = () => {
    const {data, setData, get, processing, errors} = useForm({
        query: ''
    });
    
    const {query} = data;
    const queryIsEmpty = query.length === 0;
    const [searchWorksResult, setSearchWorksResult] = useState([]);
    const [searchAuthorsResult, setSearchAuthorsResult] = useState([]);
    const noResultsFound = !processing && !queryIsEmpty && searchWorksResult.length === 0 && searchAuthorsResult.length === 0;

    const setQuery = (query) => {
        setData({query});
    }

    useEffect(() => {
        if (queryIsEmpty) {
            setSearchWorksResult([]);
            setSearchAuthorsResult([]);
        }
    }, [queryIsEmpty]);

    useEffect(() => {
        if (queryIsEmpty)
            return;
        // eslint-disable-next-line no-undef
        get(route('search'), {
            onStart: () => {
            },
            onSuccess: res => {
                const searchResults = res.props.searchResults;
                if (!queryIsEmpty) {
                    setSearchWorksResult(searchResults.works);
                    setSearchAuthorsResult(searchResults.authors);
                }
            },
            preserveState: true, preserveScroll: true
        });
    }, [queryIsEmpty, query]);

    return [query, setQuery, searchWorksResult, searchAuthorsResult, noResultsFound];
}

export default useSearch;
