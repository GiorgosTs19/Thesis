import React, { useReducer, useState } from 'react';
import { Button, Checkbox, Label, Modal, Select, TextInput } from 'flowbite-react';
import { useClickAway } from '@uidotdev/usehooks';

const styles = {};

const InitialState = {
    per_page: null,
    author_ids: [],
    sources: [],
    from_pub_year: null,
    to_pub_year: null,
    min_citations: null,
    max_citations: null,
    type_filters: [],
    with: null,
    sort_by: null,
    sort_direction: 'asc',
};
const ACTION_TYPES = {
    UPDATE_PER_PAGE: 'UPDATE_PER_PAGE',
    ADD_AUTHOR: 'ADD_AUTHOR',
    REMOVE_AUTHOR: 'REMOVE_AUTHOR',
    ADD_SOURCE: 'ADD_SOURCE',
    REMOVE_SOURCE: 'REMOVE_SOURCE',
    SET_AUTHORS: 'SET_AUTHORS',
    UNSET_AUTHORS: 'UNSET_AUTHORS',
    UPDATE_FROM_YEAR: 'UPDATE_FROM_YEAR',
    UPDATE_TO_YEAR: 'UPDATE_TO_YEAR',
    UPDATE_MAX_CITATIONS: 'UPDATE_MAX_CITATIONS',
    UPDATE_MIN_CITATIONS: 'UPDATE_MIN_CITATIONS',
    UPDATE_TYPE_FILTERS: 'UPDATE_TYPE_FILTERS',
    UPDATE_WITH: 'UPDATE_WITH',
    UPDATE_SORT_BY: 'UPDATE_SORT_BY',
    UPDATE_SORT_DIRECTION: 'UPDATE_SORT_DIRECTION',
};

const WORK_SOURCES = [
    { name: 'ORCID', value: 'ORCID' },
    { name: 'Open Alex', value: 'OpenAlex' },
    { name: 'Crossref', value: 'Crossref' },
];
const useWorkFilters = ({ authors }) => {
    const [openModal, setOpenModal] = useState(false);
    const reducer = (state, action) => {
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
            case ACTION_TYPES.UPDATE_TYPE_FILTERS: {
                return { ...state, type_filters: action.payload };
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
            default: {
                return state;
            }
        }
    };

    const [filters, dispatch] = useReducer(reducer, InitialState, () => InitialState);
    const [sanitizedFilters, setSanitizedFilters] = useState(filters);

    const onClose = () => {
        const sanitizedKeys = Object.keys(filters).filter((t) => filters[t] !== null);
        const newFilters = {};
        sanitizedKeys.forEach((key) => {
            newFilters[key] = filters[key];
        });
        setSanitizedFilters(newFilters);
    };

    const modalRef = useClickAway((e) => {
        if (e instanceof TouchEvent) {
            // * Prevent closing the modal if the user is just trying to navigate back
            // * or close the keyboard on mobile phones without buttons.
            if (e.type === 'touchend') setOpenModal(false);
            return;
        }
        setOpenModal(false);
    });

    const handleClearSelections = () => {
        if (!filters.author_ids.length) return;
        return dispatch({ type: ACTION_TYPES.UNSET_AUTHORS });
    };

    const handleSelectAll = () => {
        if (filters.author_ids.length === authors.length) return;
        return dispatch({ type: ACTION_TYPES.SET_AUTHORS });
    };

    const handleSelectAuthor = (id) => {
        if (filters.author_ids.includes(id)) return dispatch({ type: ACTION_TYPES.REMOVE_AUTHOR, payload: id });
        return dispatch({ type: ACTION_TYPES.ADD_AUTHOR, payload: id });
    };

    const handleSelectPerPage = (e) => dispatch({ type: ACTION_TYPES.UPDATE_PER_PAGE, payload: e.target.value });
    const handleSelectSortBy = (e) => dispatch({ type: ACTION_TYPES.UPDATE_SORT_BY, payload: e.target.value });
    const handleChangeMinCitations = (e) => dispatch({ type: ACTION_TYPES.UPDATE_MIN_CITATIONS, payload: e.target.value });
    const handleChangeMaxCitations = (e) => dispatch({ type: ACTION_TYPES.UPDATE_MAX_CITATIONS, payload: e.target.value });
    const handleChangeFromPubYear = (e) => dispatch({ type: ACTION_TYPES.UPDATE_FROM_YEAR, payload: e.target.value });
    const handleChangeToPubYear = (e) => dispatch({ type: ACTION_TYPES.UPDATE_TO_YEAR, payload: e.target.value });
    const handleChangeSortDirection = (e) => dispatch({ type: ACTION_TYPES.UPDATE_SORT_DIRECTION, payload: e.target.value });

    const handleSelectSource = (source) => {
        if (filters.sources.includes(source)) {
            return dispatch({ type: ACTION_TYPES.REMOVE_SOURCE, payload: source });
        }
        return dispatch({ type: ACTION_TYPES.ADD_SOURCE, payload: source });
    };

    const jsx = (
        <>
            <Button onClick={() => setOpenModal(true)} size={'xs'} color={'gray'} className={'mx-auto '}>
                Filters
            </Button>
            <Modal show={openModal} onClose={onClose} dismissible position={'top-center'}>
                <div ref={modalRef}>
                    <Modal.Header>Filters</Modal.Header>
                    <Modal.Body className={'flex flex-col rounded-b-2xl bg-white p-3'}>
                        <div className={'my-5 flex gap-2'}>
                            <div className={'w-3/12'}>
                                <div className="mb-2 block">
                                    <Label htmlFor="perPage" value="Per Page" />
                                </div>
                                <Select id="perPage" required onChange={handleSelectPerPage}>
                                    <option value={10}>10</option>
                                    <option value={15}>15</option>
                                    <option value={20}>20</option>
                                    <option value={25}>25</option>
                                </Select>
                            </div>
                            <div className={'w-4/12'}>
                                <div className="mb-2 block">
                                    <Label htmlFor="sortBy" value="Sort By" />
                                </div>
                                <Select id="sortBy" required onChange={handleSelectSortBy}>
                                    <option value={'id'}>ID</option>
                                    <option value={'doi'}>DOI</option>
                                    <option value={'title'}>Title</option>
                                    <option value={'publication_year'}>Publication Year</option>
                                    <option value={'language'}>Language</option>
                                    <option value={'is_referenced_by_count'}>Citations Count</option>
                                    <option value={'type'}>Type</option>
                                </Select>
                            </div>
                            <div className={'flex-grow'}>
                                <div className="mb-2 block">
                                    <Label htmlFor="sortDirection" value="Sorting Direction" />
                                </div>
                                <Select id="sortDirection" required onChange={handleChangeSortDirection}>
                                    <option value={'asc'}>Ascending</option>
                                    <option value={'desc'}>Descending</option>
                                </Select>
                            </div>
                        </div>
                        <div className={'mb-4 mt-2 border-b border-b-gray-200 pb-3'}>
                            <div className={'mb-3 text-left font-semibold'}>Works From Source</div>
                            <div className={'flex'}>
                                {WORK_SOURCES.map((source) => (
                                    <div className="mx-auto flex items-center gap-2" key={source.name}>
                                        <Checkbox id={`Source${source.name}`} checked={filters.sources.includes(source.value)} onChange={() => handleSelectSource(source.value)} />
                                        <Label htmlFor={`Source${source.name}`} className="flex">
                                            {source.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={'flex flex-col border-b border-b-gray-300 p-1'}>
                            <div className={'mb-2 ml-3 flex gap-3 text-left'}>
                                <div>Authors</div>
                                <Button disabled={filters.author_ids.length === authors.length} onClick={handleSelectAll} size={'xs'} color={'gray'}>
                                    All
                                </Button>
                                <Button disabled={!filters.author_ids.length} onClick={handleClearSelections} size={'xs'} color={'gray'}>
                                    None
                                </Button>
                            </div>
                            <div className={'grid-col-1 grid max-h-52 gap-3 overflow-y-auto p-3 md:grid-cols-2'}>
                                {authors.map((author) => (
                                    <div className="col-span-2 flex items-center gap-2 md:col-span-1" key={author.id}>
                                        <Checkbox id={`Author${author.id}`} checked={filters.author_ids.includes(author.id)} onChange={() => handleSelectAuthor(author.id)} />
                                        <Label htmlFor={`Author${author.id}`} className="flex">
                                            {author.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={'my-5 flex gap-5'}>
                            <div className={'mr-auto'}>
                                <div className={'mb-2 text-center'}>Publication Year</div>
                                <div className={'flex gap-3'}>
                                    <div className={'flex-grow'}>
                                        <div className="mb-2 block text-center">
                                            <Label htmlFor="fromYear" value="From" />
                                        </div>
                                        <TextInput id={'fromYear'} onChange={handleChangeFromPubYear} />
                                    </div>
                                    <span className={'mt-9 text-xl'}>-</span>
                                    <div className={'flex-grow'}>
                                        <div className="mb-2 block text-center">
                                            <Label htmlFor="toYear" value="To" />
                                        </div>
                                        <TextInput id={'toYear'} onChange={handleChangeToPubYear} />
                                    </div>
                                </div>
                            </div>
                            <div className={'mr-auto'}>
                                <div className={'mb-2 text-center'}>Citations</div>
                                <div className={'flex gap-3'}>
                                    <div className={'flex-grow'}>
                                        <div className="mb-2 block text-center">
                                            <Label htmlFor="minCitations" value="Min" className={'text-center'} />
                                        </div>
                                        <TextInput id={'minCitations'} onChange={handleChangeMinCitations} />
                                    </div>
                                    <span className={'mt-9 text-xl'}>-</span>
                                    <div className={'flex-grow'}>
                                        <div className="mb-2 block text-center">
                                            <Label htmlFor="maxCitations" value="Max" className={'text-center'} />
                                        </div>
                                        <TextInput id={'maxCitations'} onChange={handleChangeMaxCitations} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </div>
            </Modal>
        </>
    );

    return jsx;
};

export default useWorkFilters;
