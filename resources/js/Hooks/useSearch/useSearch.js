import {useEffect, useState} from "react";
import {useForm} from "@inertiajs/inertia-react";

const useSearch = (params = {}) => {
    const {data, setData, get, processing, errors} = useForm({
        query: '',
        group: params.group
    });

    const {query} = data;
    const queryIsEmpty = query.length <= 2;
    const [searchWorksResult, setSearchWorksResult] = useState([]);
    const [searchAuthorsResult, setSearchAuthorsResult] = useState([]);
    const [searchUsersResult, setSearchUsersResult] = useState([]);
    const noResultsFound = !processing && !queryIsEmpty && searchWorksResult.length === 0 && searchAuthorsResult.length === 0 && searchUsersResult.length === 0;

    const setQuery = (query) => {
        setData({...data, query});
    }

    useEffect(() => {
        if (queryIsEmpty) {
            setSearchWorksResult([]);
            setSearchAuthorsResult([]);
            setSearchUsersResult([]);
        }
    }, [queryIsEmpty]);

    useEffect(() => {
        if (queryIsEmpty)
            return;

        const {onlyWorks, onlyAuthors, onlyUsers, onlyUserAuthors} = params;

        let url = route('Search');

        // TODO: Uncomment when THESIS-7 is done
        // if (onlyWorks) {
        //     url = route('Search.Users');
        // }
        if (onlyUserAuthors) {
            url = route('Search.Authors.Users.Group');
        }

        // if (onlyUsers) {
        //     url = route('Search.Users');
        // }

        // eslint-disable-next-line no-undef
        get(url, {
            onStart: () => {
            },
            onSuccess: res => {
                const searchResults = res.props.searchResults;
                console.log(searchResults)
                if (!queryIsEmpty) {
                    setSearchWorksResult(searchResults.works);
                    setSearchAuthorsResult(searchResults.authors);
                    setSearchUsersResult(searchResults.users)
                }
            },
            preserveState: true, preserveScroll: true
        });
    }, [queryIsEmpty, query]);

    return [query, setQuery, {
        works: searchWorksResult,
        authors: searchAuthorsResult,
        users: searchUsersResult
    }, noResultsFound];
}

export default useSearch;
