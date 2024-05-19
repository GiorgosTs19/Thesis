import { Button, Card } from 'flowbite-react';
import React, { useState } from 'react';
import AddGroupMembers from '@/Components/Search/AdminSearch/AddGroupMembers.jsx';
import { object } from 'prop-types';
import { FaArrowRightLong } from 'react-icons/fa6';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';

const NewEmptyGroup = ({ group }) => {
    const [open, setOpen] = useState(false);

    return (
        <Card className={'m-auto flex'}>
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
