import { AuthorItem } from '@/Components/Assets/AuthorItem/AuthorItem.jsx';
import React from 'react';
import { arrayOf, instanceOf } from 'prop-types';
import { Author } from '@/Models/Author/Author.js';

const AuthorsList = ({ authors }) => {
    const handleOnClick = () => {};

    return (
        <>
            <div className={'bold text-center text-sm italic text-gray-400'}>If this is you, please select the author to proceed. In any other case, provide your correct identifiers.</div>
            {authors.map((author, index) => (
                <div key={index} className={`rounded-md p-3 pb-0 ${author.claimed ? 'cursor-not-allowed bg-red-200' : 'cursor-pointer bg-gray-100'}`}>
                    <AuthorItem index={index} author={author} hideProperties showClaimedStatus disableUrl hideIndex />
                </div>
            ))}
        </>
    );
};

AuthorsList.propTypes = {
    authors: arrayOf(instanceOf(Author)).isRequired,
};
export default AuthorsList;
