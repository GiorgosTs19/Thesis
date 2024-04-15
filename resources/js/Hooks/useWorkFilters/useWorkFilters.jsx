import { useEffect, useReducer, useState } from 'react';

const InitialState = {
    author_ids: [],
    sources: [],
    work_types: [],
    type_filter: '',
    min_citations: '',
    max_citations: '',
    from_pub_year: '',
    to_year_pub: '',
};

export const ACTION_TYPES = {
    UPDATE_PER_PAGE: 'UPDATE_PER_PAGE',
    ADD_AUTHOR: 'ADD_AUTHOR',
    REMOVE_AUTHOR: 'REMOVE_AUTHOR',
    ADD_SOURCE: 'ADD_SOURCE',
    REMOVE_SOURCE: 'REMOVE_SOURCE',
    SET_SOURCES: 'SET_SOURCES',
    UNSET_SOURCES: 'UNSET_SOURCES',
    SET_AUTHORS: 'SET_AUTHORS',
    UNSET_AUTHORS: 'UNSET_AUTHORS',
    UPDATE_FROM_YEAR: 'UPDATE_FROM_YEAR',
    UPDATE_TO_YEAR: 'UPDATE_TO_YEAR',
    UPDATE_MAX_CITATIONS: 'UPDATE_MAX_CITATIONS',
    UPDATE_MIN_CITATIONS: 'UPDATE_MIN_CITATIONS',
    UPDATE_TYPE_FILTER: 'UPDATE_TYPE_FILTER',
    UPDATE_WITH: 'UPDATE_WITH',
    UPDATE_SORT_BY: 'UPDATE_SORT_BY',
    UPDATE_SORT_DIRECTION: 'UPDATE_SORT_DIRECTION',
    UPDATE_WORK_TYPES: 'UPDATE_WORK_TYPES',
    CLEAR_WORK_TYPES: 'CLEAR_WORK_TYPES',
};

export const WORK_SOURCES = [
    { name: 'ORCID', value: 'ORCID' },
    { name: 'Open Alex', value: 'OpenAlex' },
    { name: 'Crossref', value: 'Crossref' },
];

const useWorkFilters = ({ authors }) => {
    const [filtersHaveChanged, setFiltersHaveChanged] = useState(false);

    const reducer = (state, action) => {
        setFiltersHaveChanged(true);
        switch (action.type) {
            case ACTION_TYPES.UPDATE_PER_PAGE: {
                return { ...state, per_page: action.payload };
            }
            case ACTION_TYPES.ADD_AUTHOR: {
                return { ...state, author_ids: [...state.author_ids, action.payload] };
            }
            case ACTION_TYPES.REMOVE_AUTHOR: {
                return { ...state, author_ids: state.author_ids.filter((id) => id !== action.payload) };
            }
            case ACTION_TYPES.SET_AUTHORS: {
                return { ...state, author_ids: authors.map((author) => author.id) };
            }
            case ACTION_TYPES.UNSET_AUTHORS: {
                return { ...state, author_ids: [] };
            }
            case ACTION_TYPES.ADD_SOURCE: {
                return { ...state, sources: [...state.sources, action.payload] };
            }
            case ACTION_TYPES.REMOVE_SOURCE: {
                return { ...state, sources: state.sources.filter((source) => source !== action.payload) };
            }
            case ACTION_TYPES.SET_SOURCES: {
                return { ...state, sources: WORK_SOURCES.map((source) => source.value) };
            }
            case ACTION_TYPES.UNSET_SOURCES: {
                return { ...state, sources: [] };
            }
            case ACTION_TYPES.UPDATE_FROM_YEAR: {
                return { ...state, from_pub_year: action.payload };
            }
            case ACTION_TYPES.UPDATE_TO_YEAR: {
                return { ...state, to_pub_year: action.payload };
            }
            case ACTION_TYPES.UPDATE_MAX_CITATIONS: {
                return { ...state, max_citations: action.payload };
            }
            case ACTION_TYPES.UPDATE_MIN_CITATIONS: {
                return { ...state, min_citations: action.payload };
            }
            case ACTION_TYPES.UPDATE_TYPE_FILTER: {
                return { ...state, type_filter: action.payload };
            }
            case ACTION_TYPES.UPDATE_WITH: {
                return { ...state, with: action.payload };
            }
            case ACTION_TYPES.UPDATE_SORT_BY: {
                return { ...state, sort_by: action.payload };
            }
            case ACTION_TYPES.UPDATE_SORT_DIRECTION: {
                return { ...state, sort_direction: action.payload };
            }
            case ACTION_TYPES.UPDATE_WORK_TYPES: {
                if (state.work_types.includes(action.payload)) return { ...state, work_types: state.work_types.filter((i) => i !== action.payload) };
                return { ...state, work_types: [...state.work_types, action.payload] };
            }
            case ACTION_TYPES.CLEAR_WORK_TYPES: {
                return { ...state, work_types: [] };
            }
            default: {
                return state;
            }
        }
    };

    const [filters, dispatch] = useReducer(reducer, InitialState, () => ({
        ...InitialState,
        author_ids: authors.map((t) => t.id),
    }));

    useEffect(() => {
        dispatch({ type: ACTION_TYPES.SET_AUTHORS });
    }, [authors]);

    return { filters, filtersHaveChanged, dispatch };
};

export default useWorkFilters;
