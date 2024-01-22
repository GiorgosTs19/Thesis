import React from "react";
import {Author} from "@/Models/Author/Author.js";
import {array} from "prop-types";
import Search from "@/Components/Search/Search.jsx";

const HomePage = ({mostWorksAuthors, mostWorksUsers, mostCitationsWorks}) => {

    return (
        <>
            <div className="bg-white flex items-center h-full rounded-lg">
                <div className="bg-white w-full px-6 py-3 flex flex-col h-full rounded-lg">
                    <div className={'md:p-4 flex flex-col text-center mb-5'}>
                        <div className={'text-3xl text-gray-500 mb-4 italic focus:ring-0'}>
                            Discover notable authors and their literary works
                        </div>
                        <Search isHomeScreen/>
                    </div>
                    <div className={'grid grid-cols-3 gap-6 lg:gap-2 mb-12'}>
                        <div className={'col-span-3 lg:col-span-1 flex flex-col text-center'}>
                            <img src={'resources/Images/Author.png'} width={64} height={64} alt={'Author'}
                                 className={'mx-auto  mb-4'}/>
                            <div className={'text-gray-500  font-bold truncate whitespace-pre-wrap w-6/12 mx-auto'}>
                                Explore a vast collection of renowned authors. Uncover insights,
                                and statistical data for each literary figure
                            </div>
                        </div>
                        <div className={'col-span-3 lg:col-span-1 flex flex-col text-center'}>
                            <img src={'resources/Images/Works.png'} width={64} height={64} alt={'Works'}
                                 className={'mx-auto  mb-4'}/>
                            <div className={'text-gray-500  font-bold truncate whitespace-pre-wrap w-6/12 mx-auto'}>
                                Search through an extensive catalog of papers, discover details about each piece,
                                and explore statistical analyses. A comprehensive experience for
                                literature enthusiasts
                            </div>
                        </div>
                        <div className={'col-span-3 lg:col-span-1 flex flex-col text-center'}>
                            <img src={'resources/Images/User.png'} width={64} height={64} alt={'Works'}
                                 className={'mx-auto  mb-4'}/>
                            <div className={'text-gray-500 font-bold truncate whitespace-pre-wrap w-6/12 mx-auto'}>
                                Calling all authors! Elevate your presence by registering on our platform.
                                Provide your unique identifiers, and we will seamlessly fetch your data
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

{/*<List data={mostWorksAuthors} renderFn={renderAuthorItem}*/
}
{/*      title={'Top Authors by Prolificacy'} parser={Author.parseResponseAuthor}*/
}
{/*      wrapperClassName={'w-fit mx-auto'}/>*/
}
{/*<List data={mostWorksUsers} renderFn={renderAuthorItem}*/
}
{/*      title={'Top Users by Prolificacy'} parser={Author.parseResponseAuthor}*/
}
{/*      wrapperClassName={'w-fit mx-auto'}/>*/
}
// <List data={mostCitationsWorks} renderFn={renderWorkItem}
//       title={'Most Cited Works: A Citation Powerhouse'} parser={Work.parseResponseWork}
//       wrapperClassName={'mx-auto'}/>

HomePage.propTypes = {
    mostWorksAuthors: array,
    mostWorksUsers: array,
    mostCitationsWorks: array,
}
export default HomePage;
