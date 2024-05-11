import React, { useEffect, useState } from 'react';
import ExtendedInput from '@/Components/ExtendedInput/ExtendedInput.jsx';
import { SearchSVG } from '@/SVGS/SearchSVG.jsx';
import { Badge, Button, Modal, Spinner } from 'flowbite-react';
import SearchResultsList from '@/Components/Search/SearchResults/SearchResultsList.jsx';
import { Author } from '@/Models/Author/Author.js';
import { bool, object } from 'prop-types';
import useSearch from '@/Hooks/useSearch/useSearch.js';
import { useClickAway } from '@uidotdev/usehooks';
import { RiUserAddLine } from 'react-icons/ri';
import useAPI from '@/Hooks/useAPI/useAPI.js';

/**
 * GroupUsersSearch Component
 * @component
 * A component for searching and adding authors to a group, with a modal interface.
 * @example
 * <GroupUsersSearch group={group}/>;
 *
 * @param {object} group - The group object to which authors will be added.
 * @param {boolean} noModal - Whether the component should be rendered inside a modal.
 * @returns The rendered GroupUsersSearch component.
 */
const AddGroupMembers = ({ group, noModal }) => {
    const [openModal, setOpenModal] = useState(false);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const authorsToAdd = selectedAuthors.map((author) => author.id);
    const api = useAPI();
    const modalRef = useClickAway((e) => {
        if (e instanceof TouchEvent) {
            // * Prevent closing the modal if the user is just trying to navigate back
            // * or close the keyboard on mobile phones without buttons.
            if (e.type === 'touchend') setOpenModal(false);
            return;
        }
        setOpenModal(false);
    });

    const [query, setQuery, { authors }, noResultsFound, loading] = useSearch({
        group: group.id,
        onlyUserAuthors: true,
        bypassLengthRestriction: openModal || noModal,
        dependencies: [openModal, group.id],
    });

    useEffect(() => {
        setQuery('');
        setSelectedAuthors([]);
    }, [openModal]);

    // Handles the change of the search query
    const handleQueryChange = (e) => {
        const query = e.target.value;
        setQuery(query);
    };

    // Handles the closing of the search modal.
    const handleSearchModalClose = () => {
        setOpenModal(false);
        setQuery('');
    };

    // Handles the selection of an author ( adds / remove them from the selectedAuthors list ).
    const handleSelectAuthor = (author) => {
        const index = selectedAuthors.findIndex((item) => item.id === author.id);

        let newAuthorsList = [...selectedAuthors]; // Create a new array to avoid mutating the original array

        if (index === -1) {
            // Author not found, add it to the array
            newAuthorsList.push(author);
        } else {
            // Author with the same ID found, remove it
            newAuthorsList = newAuthorsList.filter((item) => item.id !== author.id);
        }
        setSelectedAuthors(newAuthorsList);
    };

    const isAuthorSelected = (author) => selectedAuthors.findIndex((item) => item.id === author.id) !== -1;

    const content = () => {
        let message = '';
        switch (true) {
            case noResultsFound:
                message = 'No results meet the specified criteria';
                break;
            case query === '' && !authors.length:
                message = 'No available authors to add to this group';
                break;
            default:
                message = 'No available authors to add to this group';
        }
        return <h4 className={styles.noResults}>{message}</h4>;
    };

    const handleClearSelections = () => {
        if (!selectedAuthors.length) return;
        setSelectedAuthors([]);
    };

    const handleSelectAll = () => {
        if (selectedAuthors.length === authors.length) return;
        setSelectedAuthors(authors);
    };

    const searchBody = (
        <div>
            <ExtendedInput
                onChange={handleQueryChange}
                name={'Search'}
                value={query}
                placeholder={`Search authors to add to ${group.name}`}
                inputClassName={styles.extendedInput}
                containerClassName={'top-0 bg-white rounded-t-xl'}
                type={'search'}
                autoFocus
                leadingElement={'children'}
            >
                <SearchSVG className={'bg-transparent'} />
            </ExtendedInput>
            <div className={styles.content}>
                <div className={styles.selectedAuthorBadges}>
                    {selectedAuthors.length ? (
                        selectedAuthors.map((author) => (
                            <Badge color="gray" key={author.id}>
                                {author.name}
                            </Badge>
                        ))
                    ) : (
                        <div className={styles.noAuthorsSelected}>No authors selected</div>
                    )}
                </div>
                <div className={styles.authorSearchTip}>Only showing registered authors who are not members of this group</div>
                <div className={'mb-5 flex justify-center gap-5'}>
                    <Button disabled={selectedAuthors.length === authors.length} onClick={handleSelectAll} size={'xs'} color={'gray'}>
                        Select All
                    </Button>
                    <Button disabled={!selectedAuthors.length} onClick={handleClearSelections} size={'xs'} color={'gray'}>
                        Clear Selections
                    </Button>
                </div>
                {authorsToAdd.length > 0 && (
                    <button
                        className={styles.saveChangesIcon}
                        onClick={() =>
                            api.groups.addMembers(group, authorsToAdd).then(() => {
                                setOpenModal(false);
                            })
                        }
                    >
                        Add {selectedAuthors.length} {selectedAuthors.length < 2 ? 'author' : 'authors'}
                    </button>
                )}
                {loading && (
                    <span className={'m-auto text-center'}>
                        <Spinner aria-label="Loading" />
                    </span>
                )}
                {authors.length > 0 && !loading && (
                    <SearchResultsList
                        listClassName={styles.searchResultList}
                        data={authors}
                        parser={Author.parseResponseAuthor}
                        query={query}
                        title={`Authors ( ${authors.length} )`}
                        selectable
                        onSelect={handleSelectAuthor}
                        selected={isAuthorSelected}
                    />
                )}
                {content()}
            </div>
        </div>
    );

    if (noModal) {
        return searchBody;
    }

    return (
        <>
            <div className={styles.addIcon} onClick={() => setOpenModal(true)}>
                <RiUserAddLine className={'m-auto text-lg'} />
                <span className={'hidden md:block'}>Add Members</span>
            </div>
            <Modal show={openModal} onClose={handleSearchModalClose} dismissible position={'top-center'}>
                <div ref={modalRef}>
                    <Modal.Body className={styles.modalBody}>{searchBody}</Modal.Body>
                </div>
            </Modal>
        </>
    );
};

const styles = {
    extendedHomeInputContainer: 'bg-white rounded-lg w-full lg:w-4/12 m-auto ',
    plainInput: 'p-2 border border-gray-300 rounded-3 rounded-l-3 text-center focus:outline-none focus-visible:outline-none text-xs lg:text-sm',
    extendedInput: 'p-4 m-auto w-full border-0 focus:border-0 focus-visible:border-0 focus:outline-none focus-visible:outline-none',
    noResults: 'text-sm font-semibold my-2 text-gray-500 text-center',
    hint: 'text-lg font-semibold my-2 text-gray-500 text-center italic',
    content: 'space-y-3 flex flex-col',
    belowMinChars: 'mx-auto text-sm text-red-400 opacity-75 mt-2',
    deleteIcon: 'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-3 border border-gray-400 rounded-full shadow ml-3 cursor-pointer',
    saveChangesIcon: 'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-3 border border-gray-400 rounded-full shadow  mx-auto cursor-pointer',
    addIcon: 'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-4 border border-gray-400 rounded-full shadow cursor-pointer flex w-fit gap-3 mx-auto',
    modalBody: 'p-3 bg-white rounded-b-2xl',
    searchResultList: 'max-h-[22rem] overflow-y-auto',
    selectedAuthorBadges: 'flex gap-5 flex-wrap border-b border-b-gray-200 p-3 max-h-32 overflow-y-auto',
    noAuthorsSelected: 'mx-auto mt-2 mb-4 opacity-90 text-gray-600',
    authorSearchTip: 'text-sm opacity-80 text-gray-700 text-center',
};

AddGroupMembers.propTypes = {
    group: object.isRequired,
    noModal: bool,
};

export default AddGroupMembers;
