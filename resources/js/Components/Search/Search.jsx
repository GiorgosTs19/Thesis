import React, {useEffect, useState} from "react";
import ExtendedInput from "@/Components/ExtendedInput/ExtendedInput.jsx";
import {SearchSVG} from "@/SVGS/SearchSVG.jsx";
import {Modal} from "flowbite-react";
import {useForm} from "@inertiajs/inertia-react";
import SearchResultsList from "@/Components/Search/SearchResults/SearchResultsList.jsx";
import {Author} from "@/Models/Author/Author.js";
import {Work} from "@/Models/Work/Work.js";

const Search = () => {
    const [openModal, setOpenModal] = useState(false);

    const {data, setData, get, processing, errors} = useForm({
        query: ''
    });

    const [searchWorksResult, setSearchWorksResult] = useState([]);
    const [searchAuthorsResult, setSearchAuthorsResult] = useState([]);


    const {query} = data;
    const queryIsEmpty = query.length === 0;
    const noResultsFound = !processing && !queryIsEmpty && searchWorksResult.length === 0 && searchAuthorsResult.length === 0;
    const handleQueryChange = (e) => {
        const query = e.target.value;
        setData({query: query});
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

    return (
        <>
            <input type={'search'}
                   className={'p-2 m-auto border border-gray-600 rounded-xl w-full lg:w-7/12 text-center'}
                   placeholder={'Explore the catalog of renowned authors and their works'}
                   onClick={() => setOpenModal(true)}/>
            <Modal show={openModal} onClose={() => {
                setOpenModal(false)
            }} dismissible position={'top-center'}>
                <ExtendedInput onChange={handleQueryChange} name={'Search'}
                               value={query}
                               placeholder={'Search for authors and their works'}
                               inputClassName={'p-4 m-auto w-full border-0 focus:border-0 focus-visible:border-0 focus:outline-none focus-visible:outline-none'}
                               containerClassName={'top-0'} type={'search'} autoFocus
                               leadingElement={'children'}>
                    <SearchSVG/>
                </ExtendedInput>
                <Modal.Body className={'p-3'}>
                    <div className="space-y-6 flex flex-col">
                        {
                            queryIsEmpty && <div>
                                <div className={'flex flex-col mx-auto text-center'}>
                                    <h6></h6>
                                    <div className={`text-lg font-semibold text-yellow-800 text-auto`}>
                                        Explore the catalog of renowned authors and their works
                                    </div>
                                    <h4 className="text-sm font-semibold my-2 text-gray-500 mx-2">Authors : Name, Scopus ID,
                                        ORCID
                                        ID, OpenAlex ID</h4>
                                    <h4 className="text-sm font-semibold my-2 text-gray-500 mx-2">Works : DOI, Title,
                                        OpenAlex
                                        ID</h4>
                                </div>
                            </div>
                        }
                        {
                            noResultsFound &&
                            <h4 className="text-sm font-semibold my-2 text-gray-500 text-center">No results meet the
                                specified
                                criteria</h4>
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

export default Search;
