import React from "react";
import {Author} from "@/Models/Author/Author.js";
import {array} from "prop-types";
import {renderAuthorItem} from "@/Models/Author/Utils.jsx";
import List from "@/Components/List/List.jsx";
import {renderWorkItem} from "@/Models/Work/Utils.jsx";
import {Work} from "@/Models/Work/Work.js";
import Search from "@/Components/Search/Search.jsx";

const HomePage = ({mostWorksAuthors, mostWorksUsers, mostCitationsWorks}) => {

    return (
        <>
            <div className="bg-gray-100 flex items-center justify-self-end h-full ">
                <div className="bg-white w-full px-6 py-3 flex flex-col h-full rounded-lg">
                    <div className={'md:p-4 flex flex-col text-center mb-5'}>
                        <div className={'text-2xl text-gray-500 mb-4 italic focus:ring-0'}>
                            Discover notable authors and their literary works
                        </div>
                        <Search/>
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
