import React, {useState} from "react";
import ExtendedInput from "@/Components/ExtendedInput/ExtendedInput.jsx";
import {SearchSVG} from "@/SVGS/SearchSVG.jsx";
import {Modal} from "flowbite-react";
import SearchResultsList from "@/Components/Search/SearchResults/SearchResultsList.jsx";
import {Author} from "@/Models/Author/Author.js";
import {Work} from "@/Models/Work/Work.js";
import {bool} from "prop-types";
import SearchTips from "@/Components/Search/SearchTips.jsx";
import useSaveRecentSearchQueries from "@/Hooks/useSaveRecentSearchQueries/useSaveRecentSearchQueries.js";
import useSearch from "@/Hooks/useSearch/useSearch.js";
import {useClickAway} from "@uidotdev/usehooks";
import {User} from "@/Models/User/User.js";

const styles = {
    extendedHomeInputContainer: 'bg-white rounded-lg w-full lg:w-4/12 m-auto ',
    plainInput: 'p-2 border border-gray-300 rounded-3 rounded-l-3 text-center focus:outline-none focus-visible:outline-none text-xs lg:text-sm',
    extendedInput: 'p-4 m-auto w-full border-0 focus:border-0 focus-visible:border-0 focus:outline-none focus-visible:outline-none',
    noResults: 'text-sm font-semibold my-2 text-gray-500 text-center',
    content: 'space-y-6 flex flex-col',
    belowMinChars: 'mx-auto text-sm text-red-400 opacity-75 mt-2'
}
const Search = ({isHomeScreen, onlyWorks, onlyAuthors, onlyUsers}) => {
    const [openModal, setOpenModal] = useState(false);
    const modalRef = useClickAway(() => {
        setOpenModal(false);
    });

    const [query, setQuery, {works, authors, users}, noResultsFound] = useSearch({
        onlyWorks,
        onlyAuthors,
        onlyUsers
    });

    const recentQueries = useSaveRecentSearchQueries(query);

    const queryIsEmpty = query.length >= 0 && query.length <= 2;
    const handleQueryChange = (e) => {
        const query = e.target.value;
        setQuery(query);
    }

    const handleSearchModalClose = () => {
        setOpenModal(false)
        setQuery('')
    }

    const inputToReturn = isHomeScreen ?
        <ExtendedInput name={'Search'} onClick={() => setOpenModal(true)} onChange={() => setOpenModal(true)}
                       placeholder={'Explore the catalog of authors and their works'}
                       inputClassName={styles.plainInput}
                       containerClassName={styles.extendedHomeInputContainer} type={'search'} autoFocus
                       leadingElement={'children'}>
            <SearchSVG/>
        </ExtendedInput> :
        <ExtendedInput name={'Search'} onClick={() => setOpenModal(true)}
                       placeholder={'Search'}
                       inputClassName={styles.extendedInput}
                       containerClassName={'bg-white rounded-lg'} type={'search'} autoFocus
                       leadingElement={'children'}>
            <SearchSVG/>
        </ExtendedInput>

    const belowMinimumChars = query.length > 0 && query.length <= 2;

    const content = queryIsEmpty ? <SearchTips setData={setQuery} recentQueries={recentQueries}/> :
        noResultsFound && <h4 className={styles.noResults}>No results meet the specified criteria</h4>

    return (
        <>
            {inputToReturn}
            <Modal show={openModal} onClose={handleSearchModalClose} dismissible position={'top-center'}>
                <ExtendedInput onChange={handleQueryChange} name={'Search'}
                               value={query}
                               placeholder={'Search for authors and their works'}
                               inputClassName={styles.extendedInput}
                               containerClassName={'top-0 bg-white rounded-t-xl'} type={'search'} autoFocus
                               leadingElement={'children'}>
                    <SearchSVG className={'bg-transparent'}/>
                </ExtendedInput>
                <Modal.Body className={'p-3 bg-white rounded-b-2xl'}>
                    <div className={styles.content} ref={modalRef}>
                        {
                            belowMinimumChars &&
                            <h4 className={styles.belowMinChars}>Type at least {3 - query.length} more
                                characters</h4>
                        }
                        {
                            content
                        }
                        {
                            authors.length > 0 && !queryIsEmpty &&
                            <SearchResultsList data={authors} parser={Author.parseResponseAuthor}
                                               query={query} title={'Authors'}/>
                        }
                        {
                            works.length > 0 && !queryIsEmpty &&
                            <SearchResultsList data={works} parser={Work.parseResponseWork}
                                               query={query} title={'Works'}/>
                        }
                        {
                            users.length > 0 && !queryIsEmpty &&
                            <SearchResultsList data={users} parser={User.parseResponseAuthor}
                                               query={query} title={'Users'}/>
                        }
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

Search.propTypes = {
    isHomeScreen: bool,
    onlyWorks: bool,
    onlyAuthors: bool,
    onlyUsers: bool
}

export default Search;
