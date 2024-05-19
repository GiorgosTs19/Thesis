import { Button, Card } from 'flowbite-react';
import React, { useCallback, useRef, useState } from 'react';
import AddGroupMembers from '@/Components/Search/AdminSearch/AddGroupMembers.jsx';
import { object } from 'prop-types';
import { FaArrowRightLong } from 'react-icons/fa6';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import UtilityModal from '@/Components/Modal/UtilityModal.jsx';
import useAPI from '@/Hooks/useAPI/useAPI.js';

const NewEmptyGroup = ({ group }) => {
    const [open, setOpen] = useState(false);
    const api = useAPI();
    const deleteModalRef = useRef(null);

    const handleDelete = useCallback(async () => api.groups.deleteGroup(group), [group]);
    const handleOpenModal = () => deleteModalRef?.current?.open();
    return (
        <Card className={'m-auto flex'}>
            <Button onClick={handleOpenModal} className={'mx-auto'} color={'gray'} size={'sm'}>
                Delete Group
            </Button>
            <UtilityModal
                ref={deleteModalRef}
                acceptText={'Delete'}
                header={`Delete ${group.name}`}
                message={`Are you sure you want to permanently delete ${group.name}?`}
                declineText={'Cancel'}
                buttonClassName={'cursor-pointer'}
                onAccept={handleDelete}
            ></UtilityModal>
            <div className={'my-2 text-center text-lg font-bold'}> Get started with your new group</div>
            <div className={'my-2 text-center text-lg font-bold'}>{group.name}</div>
            <div className={'mx-auto w-8/12 text-wrap text-center text-lg'}>Add authors to your group to keep tabs on works, citation sources, and other key statistics</div>
            <AiOutlineUsergroupAdd className={'mx-auto my-2'} size={42} />
            {open ? (
                <div className={''}>
                    <AddGroupMembers group={group} noModal />
                </div>
            ) : (
                <Button color={'gray'} className={'m-auto'} onClick={() => setOpen(true)}>
                    Add Authors
                    <FaArrowRightLong size={16} className={'ml-3'} />
                </Button>
            )}
        </Card>
    );
};

NewEmptyGroup.propTypes = {
    group: object,
};

export default NewEmptyGroup;
