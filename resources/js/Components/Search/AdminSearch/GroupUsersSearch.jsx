import React, {useEffect, useState} from "react";
import ExtendedInput from "@/Components/ExtendedInput/ExtendedInput.jsx";
import {SearchSVG} from "@/SVGS/SearchSVG.jsx";
import {Badge, Modal, Spinner} from "flowbite-react";
import SearchResultsList from "@/Components/Search/SearchResults/SearchResultsList.jsx";
import {Author} from "@/Models/Author/Author.js";
import {func, object} from "prop-types";
import useSearch from "@/Hooks/useSearch/useSearch.js";
import {useClickAway} from "@uidotdev/usehooks";
import {API} from "@/API/API.js";
import {useToast} from "@/Contexts/ToastContext.jsx";
import {RiUserAddLine} from "react-icons/ri";

/**
 * GroupUsersSearch Component
 * @component
 * A component for searching and adding authors to a group, with a modal interface.
 * @example
 * <GroupUsersSearch group={group} setGroups={setGroups} />;
 *
 * @param {object} group - The group object to which authors will be added.
 * @param {Function} setGroups - The function to update the list of groups after adding authors.
 * @returns The rendered GroupUsersSearch component.
 */
const GroupUsersSearch = ({group, setGroup}) => {
    const [openModal, setOpenModal] = useState(false);
    const modalRef = useClickAway((e) => {
        if (e instanceof TouchEvent) {
            // * Prevent closing the modal if the user is just trying to navigate back
            // * or close the keyboard on mobile phones without buttons.
            if (e.type === "touchend") setOpenModal(false);
            return;
        }
        setOpenModal(false);
    });

    const [query, setQuery, {authors}, noResultsFound, loading] = useSearch({
        group: group.id,
        onlyUserAuthors: true,
        bypassLengthRestriction: openModal,
        dependencies: [openModal, group.id]
    });

    const [selectedAuthors, setSelectedAuthors] = useState([]);

    const handleQueryChange = (e) => {
        const query = e.target.value;
        setQuery(query);
    };

    const handleSearchModalClose = () => {
        setOpenModal(false);
        setQuery("");
    };

    const {
        showToast,
    } = useToast();


    const content = noResultsFound && (
            <h4 className={styles.noResults}>
                No results meet the specified criteria
            </h4>
        )
    ;

    const handleSelectAuthor = (author) => {
        const index = selectedAuthors.findIndex(
            (item) => item.id === author.id,
        );

        let newAuthorsList = [...selectedAuthors]; // Create a new array to avoid mutating the original array

        if (index === -1) {
            // Author not found, add it to the array
            newAuthorsList.push(author);
        } else {
            // Author with the same ID found, remove it
            newAuthorsList = newAuthorsList.filter(
                (item) => item.id !== author.id,
            );
        }
        setSelectedAuthors(newAuthorsList);
    };
    const authorsToAdd = selectedAuthors.map((author) => author.id);
    const isAuthorSelected = (author) =>
        selectedAuthors.findIndex((item) => item.id === author.id) !== -1;

    useEffect(() => {
        setQuery('');
        setSelectedAuthors([]);
    }, [openModal]);

    return (
        <>
            <div className={styles.addIcon} onClick={() => setOpenModal(true)}>
                <RiUserAddLine className={'text-lg m-auto'}/>
            </div>
            <Modal show={openModal} onClose={handleSearchModalClose} dismissible position={"top-center"}>
                <div ref={modalRef}>
                    <ExtendedInput
                        onChange={handleQueryChange}
                        name={"Search"}
                        value={query}
                        placeholder={`Search authors to add to ${group.name}`}
                        inputClassName={styles.extendedInput}
                        containerClassName={"top-0 bg-white rounded-t-xl"}
                        type={"search"}
                        autoFocus
                        leadingElement={"children"}
                    >
                        <SearchSVG className={"bg-transparent"}/>
                    </ExtendedInput>
                    <Modal.Body className={styles.modalBody}>
                        <div className={styles.content}>
                            <div className={"flex gap-5 flex-wrap border-b border-b-gray-200 pb-3"}>
                                {selectedAuthors.length ? selectedAuthors.map((author) => (
                                    <Badge color="gray" key={author.id}>
                                        {author.name}
                                    </Badge>
                                )) : <div className={'mx-auto mt-2 mb-4 opacity-90 text-gray-600'}>No authors selected</div>}
                            </div>
                            <div className={'text-sm opacity-80 text-gray-700 text-center'}>
                                Only showing registered authors who are not members of this group
                            </div>
                            {loading && <span className={'m-auto text-center'}><Spinner aria-label="Loading"/></span>}
                            {authors.length > 0 && !loading && (
                                <SearchResultsList
                                    listClassName={'max-h-96 overflow-y-auto'}
                                    data={authors}
                                    parser={Author.parseResponseAuthor}
                                    query={query}
                                    title={`Authors ( ${authors.length} )`}
                                    selectable
                                    onSelect={handleSelectAuthor}
                                    selected={isAuthorSelected}
                                />
                            )}
                            {content}
                        </div>
                    </Modal.Body>
                    <Modal.Footer className={authorsToAdd.length ? '' : 'border-0'}>
                        {authorsToAdd.length > 0 && (
                            <button className={styles.deleteIcon}
                                    onClick={() => API.instance.groups.addMembers(group, authorsToAdd).then((data) => {
                                            setGroup(data.data.group);
                                            setOpenModal(false)
                                        }
                                    )
                                    }>
                                Add {selectedAuthors.length} {selectedAuthors.length < 2 ? 'author' : 'authors'}
                            </button>
                        )}
                    </Modal.Footer>
                </div>
            </Modal>
        </>
    );
};

const styles = {
    extendedHomeInputContainer: "bg-white rounded-lg w-full lg:w-4/12 m-auto ",
    plainInput:
        "p-2 border border-gray-300 rounded-3 rounded-l-3 text-center focus:outline-none focus-visible:outline-none text-xs lg:text-sm",
    extendedInput:
        "p-4 m-auto w-full border-0 focus:border-0 focus-visible:border-0 focus:outline-none focus-visible:outline-none",
    noResults: "text-sm font-semibold my-2 text-gray-500 text-center",
    hint: "text-lg font-semibold my-2 text-gray-500 text-center italic",
    content: "space-y-3 flex flex-col",
    belowMinChars: "mx-auto text-sm text-red-400 opacity-75 mt-2",
    deleteIcon: 'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-3 border border-gray-400 rounded-full shadow ml-3 cursor-pointer',
    addIcon: 'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-3 border border-gray-400 rounded-full shadow ml-3 cursor-pointer flex',
    modalBody: 'p-3 bg-white rounded-b-2xl'
};

GroupUsersSearch.propTypes = {
    group: object.isRequired,
    setGroup: func.isRequired
};

export default GroupUsersSearch;
