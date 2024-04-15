import { Button, Modal } from 'flowbite-react';
import List from '@/Components/List/List.jsx';
import { Author } from '@/Models/Author/Author.js';
import AddGroupMembers from '@/Components/Search/AdminSearch/AddGroupMembers.jsx';
import React, { useState } from 'react';
import { renderAuthorItem } from '@/Models/Author/Utils.jsx';
import { arrayOf, number, object, shape, string } from 'prop-types';
import { useClickAway } from '@uidotdev/usehooks';

const GroupMembers = ({ group }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const modalRef = useClickAway((e) => {
        if (e instanceof TouchEvent) {
            // * Prevent closing the modal if the user is just trying to navigate back
            // * or close the keyboard on mobile phones without buttons.
            if (e.type === 'touchend') setModalOpen(false);
            return;
        }
        setModalOpen(false);
    });

    return (
        <>
            <Button onClick={() => setModalOpen(true)} size={'xs'} color={'gray'} className={'mx-auto '}>
                Members
            </Button>
            <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
                <Modal.Header>Group Members</Modal.Header>
                <div ref={modalRef}>
                    <Modal.Body className={'overflow-y-auto'}>
                        <List
                            data={group.members}
                            renderFn={renderAuthorItem}
                            wrapperClassName={`mb-auto`}
                            vertical
                            title={`Group Members ${group.members.length ? ` ( ${group.members.length} )` : ''}`}
                            parser={Author.parseResponseAuthor}
                            emptyListPlaceholder={'This group has no members'}
                        >
                            <AddGroupMembers group={group} />
                        </List>
                    </Modal.Body>
                </div>
            </Modal>
        </>
    );
};

GroupMembers.propTypes = {
    group: shape({
        name: string.isRequired,
        parent: object,
        description: string.isRequired,
        members: arrayOf(object),
        children: arrayOf(object),
        uniqueWorksCount: shape({ OpenAlex: number, ORCID: number, Crossref: number }),
    }),
};
