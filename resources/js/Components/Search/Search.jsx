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

const styles = {
    plainInput: 'p-2 m-auto border border-gray-300 rounded-xl w-full lg:w-4/12 text-center focus:outline-none focus-visible:outline-none text-xs lg:text-sm',
    extendedInput: 'p-4 m-auto w-full border-0 focus:border-0 focus-visible:border-0 focus:outline-none focus-visible:outline-none',
    noResults: 'text-sm font-semibold my-2 text-gray-500 text-center',
    content: 'space-y-6 flex flex-col'
}
const Search = ({isHomeScreen}) => {
    const [openModal, setOpenModal] = useState(false);

    const [query, setQuery, searchWorksResult, searchAuthorsResult, noResultsFound] = useSearch();
    const recentQueries = useSaveRecentSearchQueries(query);


    const queryIsEmpty = query.length === 0;
    const handleQueryChange = (e) => {
        const query = e.target.value;
        setQuery(query);
    }

    const handleSearchModalClose = () => {
        setOpenModal(false)
        setQuery('')
    }

    const inputToReturn = isHomeScreen ? <input type={'search'}
                                                className={styles.plainInput}
                                                placeholder={'Explore the catalog of authors and their works'}
                                                onClick={() => setOpenModal(true)} autoFocus/> :
        <ExtendedInput name={'Search'} onClick={() => setOpenModal(true)}
                       placeholder={'Search'}
                       inputClassName={styles.extendedInput}
                       containerClassName={'bg-white rounded-lg'} type={'search'} autoFocus
                       leadingElement={'children'}>
            <SearchSVG/>
        </ExtendedInput>

    const content = queryIsEmpty ? <SearchTips setData={setQuery} recentQueries={recentQueries}/> :
        noResultsFound && <h4 className={styles.noResults}>No results meet the
            specified
            criteria</h4>

    return (
        <>
            {inputToReturn}
            <Modal show={openModal} onClose={handleSearchModalClose} dismissible position={'top-center'}>
                <ExtendedInput onChange={handleQueryChange} name={'Search'}
                               value={query}
                               placeholder={'Search for authors and their works'}
                               inputClassName={styles.extendedInput}
                               containerClassName={'top-0'} type={'search'} autoFocus
                               leadingElement={'children'}>
                    <SearchSVG/>
                </ExtendedInput>
                <Modal.Body className={'p-3'}>
                    <div className={styles.content}>
                        {
                            content
                        }
                        {
                            searchAuthorsResult.length > 0 && !queryIsEmpty &&
                            <SearchResultsList data={searchAuthorsResult} parser={Author.parseResponseAuthor}
                                               query={query} title={'Authors'}/>
                        }
                        {
                            searchWorksResult.length > 0 && !queryIsEmpty &&
                            <SearchResultsList data={searchWorksResult} parser={Work.parseResponseWork}
                                               query={query} title={'Works'}/>
                        }
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

Search.propTypes = {
    isHomeScreen: bool
}

export default Search;
