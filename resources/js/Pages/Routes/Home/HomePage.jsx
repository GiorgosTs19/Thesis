import React, {useEffect, useState} from "react";
import {Author} from "@/Models/Author/Author.js";
import {array} from "prop-types";
import {renderAuthorItem} from "@/Models/Author/Utils.jsx";
import List from "@/Components/List/List.jsx";
import {renderWorkItem} from "@/Models/Work/Utils.jsx";
import {Work} from "@/Models/Work/Work.js";
import {useForm} from "@inertiajs/inertia-react";
import {Modal} from "flowbite-react";

const HomePage = ({mostWorksAuthors, mostWorksUsers, mostCitationsWorks}) => {
    const {data, setData, get, processing, errors} = useForm({
        query: ''
    });

    useEffect(() => {
        if (!data.query)
            return;
        // eslint-disable-next-line no-undef
        get(route('search'), {
            onStart: () => {
                console.log(encodeURIComponent(data.query))
            },
            onSuccess: res => {
                const props = res.props;
                console.log(props)
            },
            preserveState: true, preserveScroll: true
        });
    }, [data]);

    const [openModal, setOpenModal] = useState(false);

    return (
        <>
            <div className="bg-gray-100 flex items-center justify-self-end h-full ">
                <div className="bg-white w-full px-6 py-3 flex flex-col h-full rounded-lg">
                    <div className={'md:p-4 flex flex-col text-center mb-5'}>
                        <div className={'text-2xl text-gray-500 mb-4 italic'}>
                            Discover notable authors and their literary works
                        </div>
                        <Modal show={openModal} onClose={() => {
                            setOpenModal(false)
                        }} dismissible position={'top-center'}>
                            <div className={'top-0'}>
                                <input type={'search'}
                                       className={'p-2 m-auto w-full text-center '}
                                       placeholder={'Explore the catalog of renowned authors and their works'}
                                       value={data.query}
                                       onChange={(e) => setData({query: e.target.value})} autoFocus/>
                            </div>
                            <Modal.Body>
                                <div className="space-y-6 flex">
                                </div>
                            </Modal.Body>
                        </Modal>
                        <input type={'search'}
                               className={'p-2 m-auto border border-gray-600 rounded-xl w-full lg:w-7/12 text-center'}
                               placeholder={'Explore the catalog of renowned authors and their works'}
                               onClick={() => setOpenModal(true)}/>
                        <div className={'flex flex-col lg:flex-row mx-auto'}>
                            <h4 className="text-lg font-semibold my-2 text-gray-500 mx-2">Authors : Name, Scopus ID,
                                ORCID
                                ID, OpenAlex ID</h4>
                            <h4 className="text-lg font-semibold my-2 text-gray-500 mx-2">Works : DOI, Title, OpenAlex
                                ID</h4>
                        </div>
                    </div>
                    <div className={'gap-4 mb-4 grid grid-cols-1 xl:grid-cols-5'}>
                        <div className={'col-span-1 xl:col-span-2 flex flex-col gap-4'}>
                            <List data={mostWorksAuthors} renderFn={renderAuthorItem}
                                  title={'Top Authors by Prolificacy'} parser={Author.parseResponseAuthor}
                                  wrapperClassName={'w-fit mx-auto'}/>
                            <List data={mostWorksUsers} renderFn={renderAuthorItem}
                                  title={'Top Users by Prolificacy'} parser={Author.parseResponseAuthor}
                                  wrapperClassName={'w-fit mx-auto'}/>
                        </div>
                        <div className={'col-span-1 xl:col-span-3 flex'}>
                            <List data={mostCitationsWorks} renderFn={renderWorkItem}
                                  title={'Most Cited Works: A Citation Powerhouse'} parser={Work.parseResponseWork}
                                  wrapperClassName={'mx-auto'}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
HomePage.propTypes = {
    mostWorksAuthors: array,
    mostWorksUsers: array,
    mostCitationsWorks: array,
}
export default HomePage;
