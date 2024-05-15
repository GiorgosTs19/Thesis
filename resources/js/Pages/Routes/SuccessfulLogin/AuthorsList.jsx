import { AuthorItem } from '@/Components/Assets/AuthorItem/AuthorItem.jsx';
import React, {useState} from 'react';
import { arrayOf, instanceOf } from 'prop-types';
import { Author } from '@/Models/Author/Author.js';
import useAPI from "@/Hooks/useAPI/useAPI.js";
import {Button, Modal, TextInput} from "flowbite-react";
import {OrcidSVG} from "@/SVGS/OrcidSVG.jsx.jsx";
import {OpenAlexSVG} from "@/SVGS/OpenAlexSVG.jsx";
import {ScopusSVG} from "@/SVGS/ScopusSVG.jsx";

const AuthorsList = ({ authors }) => {
    const api = useAPI();
    const [openModal, setOpenModal] = useState(false);
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const handleOnAuthorClick = (author) => {
        setSelectedAuthor(author);
        setOpenModal(true);
    }

    const handleClaimAuthor = () => {
        if(selectedAuthor.claimed) return;
        api.auth.claimAuthor(selectedAuthor.id).then(()=>setOpenModal(false));
    }

    return (
        <>
            <Modal show={openModal} size={'md'} onClose={() => setOpenModal(false)} dismissible>
                <Modal.Header>Claim Author</Modal.Header>
                <Modal.Body>
                    <div className="space-y-4 text-center">
                        <div>
                            Are you sure this is you?
                        </div>
                        <div className={'space-y-2'}>
                            <div className={'bold text-gray-600'}>{selectedAuthor?.name}</div>
                            <TextInput
                                icon={OrcidSVG}
                                id="ORCID"
                                value={selectedAuthor?.orcId ?? '-'}
                                disabled
                            />
                            <TextInput
                                icon={OpenAlexSVG}
                                id="ORCID"
                                value={selectedAuthor?.openAlexId ?? '-'}
                                placeholder="ORCID"
                                disabled
                            />
                            <TextInput
                                icon={ScopusSVG}
                                id="ORCID"
                                value={selectedAuthor?.scopusId ?? '-'}
                                disabled
                            />
                        </div>
                        <div>
                            By claiming this author profile, you acknowledge that you are the rightful owner of this identity.
                            Please ensure all the identifiers match your information accurately.
                        </div>

                        <div className={'text-red-400'}>
                            Important: This action is irreversible. Once you claim this author profile, it cannot be undone.
                        </div>
                        <div>
                            If you are certain that this is you, please proceed. Otherwise, you may cancel and verify your details.
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className={'flex justify-center'}>
                    <Button onClick={handleClaimAuthor}>Accept</Button>
                    <Button color="gray" onClick={() => setOpenModal(false)}>
                        Decline
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className={'bold text-center text-sm italic text-gray-400'}>If this is you, please select the author to proceed. In any other case, provide your correct identifiers.</div>
            {authors.map((author, index) => (
                <div key={index} className={`rounded-md p-3 pb-0 ${author.claimed ? 'cursor-not-allowed bg-red-200' : 'cursor-pointer bg-gray-100'}`}
                     onClick={()=>handleOnAuthorClick(author)}>
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
