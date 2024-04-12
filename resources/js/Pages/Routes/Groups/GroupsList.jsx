import NewGroupModal from '@/Components/Modal/NewGroupModal.jsx';
import React, { useEffect, useState } from 'react';
import { RichTreeView } from '@mui/x-tree-view';
import useAPI from '@/Hooks/useAPI/useAPI.js';
import { Spinner } from 'flowbite-react';
import { useGroupCreatedEventListener } from '@/Events/GroupEvent/GroupEvent.js';
import { MdOutlineExpandLess } from 'react-icons/md';
import { func } from 'prop-types';

const GroupsList = ({ setSelectedGroup }) => {
    const [groupsList, setGroupsList] = useState();
    const [open, setOpen] = useState(true);

    const api = useAPI();
    useEffect(() => {
        api.groups.getAllGroups().then((res) => setGroupsList(res));
    }, []);

    // Listen for Group Created Events
    useGroupCreatedEventListener(() => {
        api.groups.getAllGroups().then((res) => setGroupsList(res));
    });

    const generateTreeViewItems = (groups) => {
        return groups.map((group) => ({
            id: `${group.id}`,
            label: group.name,
            children: group.children ? generateTreeViewItems(group.children) : [],
        }));
    };

    const handleSelectedItemChanged = (id) => {
        setOpen(true);
        setSelectedGroup(id);
    };

    return (
        <>
            <div
                className={`my-3 flex w-full flex-col py-10 ${open ? 'gap-4 overflow-x-auto pl-2 pr-5 md:w-3/12' : 'w-0 overflow-x-hidden pr-2 md:w-[10rem] '} transition-all duration-300 ease-in-out md:gap-3 md:border-r md:border-r-gray-300`}
            >
                {groupsList ? (
                    <>
                        <NewGroupModal groups={groupsList} />
                        <RichTreeView
                            items={generateTreeViewItems(groupsList)}
                            onSelectedItemsChange={(e, id) => {
                                handleSelectedItemChanged(id);
                            }}
                        />
                    </>
                ) : (
                    <div className={'m-auto'}>
                        <Spinner size="xl" />
                    </div>
                )}
            </div>
            <div className={'my-auto'} onClick={() => setOpen((prev) => !prev)}>
                <MdOutlineExpandLess size={40} className={`${open ? '-' : ''}rotate-90`} />
            </div>
        </>
    );
};

GroupsList.propTypes = {
    setSelectedGroup: func.isRequired,
};
export default GroupsList;
