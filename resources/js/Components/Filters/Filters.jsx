import { Button, Checkbox, Label, Modal, Select, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useClickAway } from '@uidotdev/usehooks';
import { array, arrayOf, bool, func, number, oneOfType, shape, string } from 'prop-types';
import { ACTION_TYPES, WORK_SOURCES } from '@/Hooks/useWorkFilters/useWorkFilters.jsx';
import useAPI from '@/Hooks/useAPI/useAPI.js';

const Filters = ({ onOpen, filters, dispatch, authors, noModal = false }) => {
    const [openModal, setOpenModal] = useState(false);

    const api = useAPI();
    const [placeholders, setPlaceholders] = useState({ minCitations: 0, maxCitations: 10000, minYear: 1900, maxYear: new Date().getFullYear() });
    const [customTypes, setCustomTypes] = useState([]);
    const [workTypes, setWorkTypes] = useState([]);

    useEffect(() => {
        api.works.getMetadata().then((res) => {
            setPlaceholders({ minCitations: res.minCitations, maxCitations: res.maxCitations, minYear: res.minYear, maxYear: res.maxYear });
            setCustomTypes(res.customTypes);
            setWorkTypes(res.workTypes);
        });
    }, []);

    const onClose = () => setOpenModal(false);

    const handleOpenModal = () => {
        if (onOpen) {
            onOpen();
        }
        setOpenModal(true);
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
    const handleSelectSortBy = (e) => {
        dispatch({ type: ACTION_TYPES.UPDATE_SORT_BY, payload: e.target.value });
    };
    const handleSelectCustomType = (e) => {
        dispatch({ type: ACTION_TYPES.UPDATE_TYPE_FILTER, payload: e.target.value });
    };
    const handleChangeMinCitations = (e) => dispatch({ type: ACTION_TYPES.UPDATE_MIN_CITATIONS, payload: e.target.value });
    const handleChangeMaxCitations = (e) => dispatch({ type: ACTION_TYPES.UPDATE_MAX_CITATIONS, payload: e.target.value });
    const handleChangeFromPubYear = (e) => dispatch({ type: ACTION_TYPES.UPDATE_FROM_YEAR, payload: e.target.value });
    const handleChangeToPubYear = (e) => dispatch({ type: ACTION_TYPES.UPDATE_TO_YEAR, payload: e.target.value });
    const handleChangeSortDirection = (e) => dispatch({ type: ACTION_TYPES.UPDATE_SORT_DIRECTION, payload: e.target.value });
    const handleSetAllSources = () => dispatch({ type: ACTION_TYPES.SET_SOURCES });
    const handleSetNoneSources = () => dispatch({ type: ACTION_TYPES.UNSET_SOURCES });

    const handleSelectSource = (source) => {
        if (filters.sources.includes(source)) {
            return dispatch({ type: ACTION_TYPES.REMOVE_SOURCE, payload: source });
        }
        return dispatch({ type: ACTION_TYPES.ADD_SOURCE, payload: source });
    };

    const handleSelectWorkType = (id) => {
        dispatch({ type: ACTION_TYPES.UPDATE_WORK_TYPES, payload: id });
    };

    const content = (
        <>
            <div className={'p-3'}>
                <div className="mb-2 block">
                    <Label htmlFor="workTypes" value="Work Types" />
                </div>
                <div className={'max-h-52 overflow-y-scroll p-2'}>
                    {workTypes.map((workType) => (
                        <div className="flex items-center gap-2" key={workType} onClick={() => handleSelectWorkType(workType)}>
                            <Checkbox id="accept" checked={filters.work_types.includes(workType)} onChange={() => {}} />
                            <Label htmlFor="workType">{workType}</Label>
                        </div>
                    ))}
                </div>
            </div>
            <div className={'my-3 flex gap-2'}>
                <div className={'w-3/12'}>
                    <div className="mb-2 block">
                        <Label htmlFor="perPage" value="Per Page" />
                    </div>
                    <Select id="perPage" required onChange={handleSelectPerPage} value={filters.per_page ?? 10}>
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
                    <Select id="sortBy" required onChange={handleSelectSortBy} value={filters.sort_by ?? 'title'}>
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
                    <Select id="sortDirection" required onChange={handleChangeSortDirection} value={filters.sort_direction ?? 'asc'}>
                        <option value={'asc'}>Ascending</option>
                        <option value={'desc'}>Descending</option>
                    </Select>
                </div>
            </div>
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="customType" value="Type" />
                </div>
                <Select id="customType" required onChange={handleSelectCustomType} value={filters.filter_type ?? 'All'}>
                    <option value={'All'} key={'All'}>
                        All
                    </option>
                    {customTypes.map((customType) => (
                        <option value={customType.id} key={customType.id}>
                            {customType.name}
                        </option>
                    ))}
                </Select>
            </div>
            <div className={'mb-4 mt-2 border-b border-b-gray-200 pb-3'}>
                <div className={'mb-2 ml-3 flex gap-3 text-left'}>
                    <div>Works from Source</div>
                    <Button disabled={filters.sources.length === WORK_SOURCES.length} onClick={handleSetAllSources} size={'xs'} color={'gray'}>
                        All
                    </Button>
                    <Button disabled={!filters.sources.length} onClick={handleSetNoneSources} size={'xs'} color={'gray'}>
                        None
                    </Button>
                </div>
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
            {authors.length > 1 && (
                <div className={'flex flex-col border-b border-b-gray-300 p-1'}>
                    <div className={'mb-2 ml-3 flex gap-3 text-left'}>
                        <div>Authors</div>
                        <Button disabled={filters.author_ids.length === authors.length} onClick={handleSelectAll} size={'xs'} color={'gray'}>
                            All
                        </Button>
                        <Button disabled={!filters.author_ids.length || authors.length === 1} onClick={handleClearSelections} size={'xs'} color={'gray'}>
                            None
                        </Button>
                    </div>
                    <div className={'grid-col-1 grid max-h-52 gap-3 overflow-y-auto p-3 md:grid-cols-2'}>
                        {authors.map((author) => (
                            <div className="col-span-2 flex items-center gap-2 md:col-span-1" key={author.id}>
                                <Checkbox id={`Author${author.id}`} checked={filters.author_ids.includes(author.id)} onChange={() => handleSelectAuthor(author.id)} disabled={authors.length === 1} />
                                <Label htmlFor={`Author${author.id}`} className="flex">
                                    {author.name}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className={'my-5 flex gap-5'}>
                <div className={'mr-auto'}>
                    <div className={'mb-2 text-center'}>Publication Year</div>
                    <div className={'flex gap-3'}>
                        <div className={'flex-grow'}>
                            <div className="mb-2 block text-center">
                                <Label htmlFor="fromYear" value="From" />
                            </div>
                            <TextInput id={'fromYear'} onChange={handleChangeFromPubYear} value={filters.from_pub_year} placeholder={placeholders.minYear} />
                        </div>
                        <span className={'mt-9 text-xl'}>-</span>
                        <div className={'flex-grow'}>
                            <div className="mb-2 block text-center">
                                <Label htmlFor="toYear" value="To" />
                            </div>
                            <TextInput id={'toYear'} onChange={handleChangeToPubYear} value={filters.to_pub_year} placeholder={placeholders.maxYear} />
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
                            <TextInput id={'minCitations'} onChange={handleChangeMinCitations} value={filters.min_citations} placeholder={placeholders.minCitations} />
                        </div>
                        <span className={'mt-9 text-xl'}>-</span>
                        <div className={'flex-grow'}>
                            <div className="mb-2 block text-center">
                                <Label htmlFor="maxCitations" value="Max" className={'text-center'} />
                            </div>
                            <TextInput id={'maxCitations'} onChange={handleChangeMaxCitations} value={filters.max_citations} placeholder={placeholders.maxCitations} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            {noModal ? (
                content
            ) : (
                <>
                    <Button onClick={handleOpenModal} size={'xs'} color={'gray'} className={'mx-auto '}>
                        Filters
                    </Button>
                    <Modal show={openModal} onClose={onClose} dismissible position={'top-center'} style={{ zIndex: 9999 }}>
                        <div ref={modalRef} className={'overflow-y-auto'}>
                            <Modal.Header>Filters</Modal.Header>
                            <Modal.Body className={'flex flex-col rounded-b-2xl bg-white px-3 py-1'}>{content}</Modal.Body>
                        </div>
                    </Modal>
                </>
            )}
        </>
    );
};

export default Filters;

Filters.propTypes = {
    filters: shape({
        author_ids: arrayOf(number),
        sources: arrayOf(string),
        type_filters: string,
        min_citations: oneOfType([string, number]),
        max_citations: oneOfType([string, number]),
        from_pub_year: oneOfType([string, number]),
        to_year_pub: oneOfType([string, number]),
        work_types: arrayOf(string),
    }).isRequired,
    authors: array.isRequired,
    dispatch: func.isRequired,
    onOpen: func,
    noModal: bool,
};
