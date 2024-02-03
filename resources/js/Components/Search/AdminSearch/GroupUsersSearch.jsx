import React, {useEffect, useState} from "react";
import ExtendedInput from "@/Components/ExtendedInput/ExtendedInput.jsx";
import {SearchSVG} from "@/SVGS/SearchSVG.jsx";
import {Badge, Modal} from "flowbite-react";
import SearchResultsList from "@/Components/Search/SearchResults/SearchResultsList.jsx";
import {Author} from "@/Models/Author/Author.js";
import {bool, func, node, number} from "prop-types";
import SearchTips from "@/Components/Search/SearchTips.jsx";
import useSearch from "@/Hooks/useSearch/useSearch.js";
import {useClickAway} from "@uidotdev/usehooks";
import {IoPersonAddOutline} from "react-icons/io5";
import {API} from "@/API/API.js";

const styles = {
    extendedHomeInputContainer: "bg-white rounded-lg w-full lg:w-4/12 m-auto ",
    plainInput:
        "p-2 border border-gray-300 rounded-3 rounded-l-3 text-center focus:outline-none focus-visible:outline-none text-xs lg:text-sm",
    extendedInput:
        "p-4 m-auto w-full border-0 focus:border-0 focus-visible:border-0 focus:outline-none focus-visible:outline-none",
    noResults: "text-sm font-semibold my-2 text-gray-500 text-center",
    hint: "text-lg font-semibold my-2 text-gray-500 text-center italic",
    content: "space-y-6 flex flex-col",
    belowMinChars: "mx-auto text-sm text-red-400 opacity-75 mt-2",
};
const GroupUsersSearch = ({group, setGroups}) => {
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

    const [query, setQuery, {authors}, noResultsFound] = useSearch({
        group: group,
        onlyUserAuthors: true,
    });
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const queryIsEmpty = query.length >= 0 && query.length <= 2;
    const handleQueryChange = (e) => {
        const query = e.target.value;
        setQuery(query);
    };

    const handleSearchModalClose = () => {
        setOpenModal(false);
        setQuery("");
    };

    const belowMinimumChars = query.length > 0 && query.length <= 2;

    const content = queryIsEmpty ? (
        <SearchTips onlyAuthors/>
    ) : (
        noResultsFound && (
            <h4 className={styles.noResults}>
                No results meet the specified criteria
            </h4>
        )
    );

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
            <div
                className={
                    "p-1 rounded-full hover:bg-gray-100 text-black cursor-pointer ml-4 my-auto"
                }
            >
                <IoPersonAddOutline onClick={() => setOpenModal(true)}/>
            </div>
            <Modal
                show={openModal}
                onClose={handleSearchModalClose}
                dismissible
                position={"top-center"}
            >
                <div ref={modalRef}>
                    <ExtendedInput
                        onChange={handleQueryChange}
                        name={"Search"}
                        value={query}
                        placeholder={"Search authors to add to this group"}
                        inputClassName={styles.extendedInput}
                        containerClassName={"top-0 bg-white rounded-t-xl"}
                        type={"search"}
                        autoFocus
                        leadingElement={"children"}
                    >
                        <SearchSVG className={"bg-transparent"}/>
                    </ExtendedInput>
                    <Modal.Body className={"p-3 bg-white rounded-b-2xl"}>
                        <div className={styles.content}>
                            <div className={"flex gap-5 flex-wrap"}>
                                {selectedAuthors.map((author) => (
                                    <Badge color="gray" key={author.id}>
                                        {author.name}
                                    </Badge>
                                ))}
                            </div>
                            {belowMinimumChars && (
                                <h4 className={styles.belowMinChars}>
                                    Type at least {3 - query.length} more
                                    characters
                                </h4>
                            )}
                            {content}
                            {authors.length > 0 && !queryIsEmpty && (
                                <SearchResultsList
                                    data={authors}
                                    parser={Author.parseResponseAuthor}
                                    query={query}
                                    title={"Authors"}
                                    selectable
                                    onSelect={handleSelectAuthor}
                                    selected={isAuthorSelected}
                                />
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        {authorsToAdd.length > 0 && (
                            <button
                                className={
                                    "border border-gray-800 rounded-full p-2 ml-auto"
                                }
                                onClick={() =>
                                    API.instance.groups
                                        .addMembers(group, authorsToAdd)
                                        .then((data) => {
                                                setGroups(data.data.groups);
                                                setOpenModal(false)
                                            }
                                        )
                                }
                            >
                                Add {authorsToAdd.length} authors
                            </button>
                        )}
                    </Modal.Footer>
                </div>
            </Modal>
        </>
    );
};

GroupUsersSearch.propTypes = {
    onlyWorks: bool,
    onlyAuthors: bool,
    onlyUsers: bool,
    onlyUserAuthors: bool,
    children: node,
    disableOtherChoices: bool,
    showTips: bool,
    selectable: bool,
    selectedRenderFn: func,
    onSelect: func,
    group: number.isRequired,
};

export default GroupUsersSearch;
