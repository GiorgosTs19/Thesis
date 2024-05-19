import React, { useEffect, useState } from 'react';
import { RichTreeView, TreeItem2, useTreeItem2Utils } from '@mui/x-tree-view';
import useAPI from '@/Hooks/useAPI/useAPI.js';
import { Spinner } from 'flowbite-react';
import { useGroupCreatedEventListener } from '@/Events/GroupEvent/GroupEvent.js';
import { arrayOf, func, node, string } from 'prop-types';
import './style.css';
import OffCanvas from '@/Components/OffCanvas/OffCanvas.jsx';
import { RxHamburgerMenu } from 'react-icons/rx';
import { TbUsersGroup } from 'react-icons/tb';

const CustomTreeItem = React.forwardRef(function MyTreeItem(props, ref) {
    const { interactions } = useTreeItem2Utils({
        itemId: props.itemId,
        children: props.children,
    });

    const handleContentClick = (event) => {
        event.defaultMuiPrevented = true;
        interactions.handleSelection(event);
    };

    const handleIconContainerClick = (event) => {
        event.stopPropagation();
        interactions.handleExpansion(event);
    };

    return (
        <TreeItem2
            {...props}
            ref={ref}
            slotProps={{
                content: { onClick: handleContentClick },
                iconContainer: { onClick: handleIconContainerClick },
            }}
        />
    );
});

CustomTreeItem.propTypes = {
    itemId: string.isRequired,
    children: arrayOf(node),
    label: string.isRequired,
};
const GroupsList = ({ setSelectedGroup }) => {
    const [groupsList, setGroupsList] = useState();
    const [open, setOpen] = useState(true);

    const api = useAPI();
    useEffect(() => {
        api.groups.getAllGroups().then((res) => setGroupsList(res.data.groups));
    }, []);

    // Listen for Group Created Events
    useGroupCreatedEventListener(() => {
        api.groups.getAllGroups().then((res) => {
            setGroupsList(res.data.groups);
        });
    });

    const generateTreeViewItems = (groups) => {
        return groups.map((group) => ({
            id: `${group.id}`,
            label: `${group.name}  ${group.children.length ? `( ${group.children.length} ) ` : ''}`,
            children: group.children ? generateTreeViewItems(group.children) : [],
        }));
    };

    const handleSelectedItemChanged = (id) => {
        setOpen(false);
        setSelectedGroup(id);
    };

    return (
        <>
            <div className={''}>
                <RxHamburgerMenu className={'ml-4 mt-6 cursor-pointer hover:scale-110'} size={40} onClick={() => setOpen(true)} />
                <span className={'ml-3'}>Groups</span>
            </div>
            <OffCanvas onClose={() => setOpen(false)} isOpen={open} position={'left'} header={'Groups'} canvasWidth={300} clickAwayClosable>
                <div className={`my-3 flex w-full flex-col py-2 md:gap-3`}>
                    {groupsList ? (
                        <>
                            <TbUsersGroup size={42} className={'mx-auto mb-3'} />
                            <RichTreeView items={generateTreeViewItems(groupsList)} onSelectedItemsChange={(e, id) => handleSelectedItemChanged(id)} slots={{ item: CustomTreeItem }} />
                        </>
                    ) : (
                        <div className={'m-auto'}>
                            <Spinner size="xl" />
                        </div>
                    )}
                </div>
            </OffCanvas>
        </>
    );
};

GroupsList.propTypes = {
    setSelectedGroup: func.isRequired,
};
export default GroupsList;
