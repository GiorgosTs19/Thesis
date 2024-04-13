import NewGroupModal from '@/Components/Modal/NewGroupModal.jsx';
import React, { useCallback, useEffect, useState } from 'react';
import { RichTreeView, TreeItem2, useTreeItem2Utils } from '@mui/x-tree-view';
import useAPI from '@/Hooks/useAPI/useAPI.js';
import { Button, Spinner } from 'flowbite-react';
import { useGroupCreatedEventListener } from '@/Events/GroupEvent/GroupEvent.js';
import { MdOutlineExpandLess } from 'react-icons/md';
import { arrayOf, func, node, string } from 'prop-types';
import { TbUsersGroup } from 'react-icons/tb';
import './style.css';
import { BsArrowBarLeft } from 'react-icons/bs';
import { useWindowSize } from '@uidotdev/usehooks';
import OffCanvas from '@/Components/OffCanvas/OffCanvas.jsx';

const MINIMUM_WIDTH_FOR_CANVAS = 1100;

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
    const { width } = useWindowSize();
    const shouldRenderCanvas = width <= MINIMUM_WIDTH_FOR_CANVAS;
    const [groupsList, setGroupsList] = useState();
    const [open, setOpen] = useState(true);
    const [showContent, setShowContent] = useState(true);

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
        if (shouldRenderCanvas) setOpen(false);
        setSelectedGroup(id);
    };

    const getDynamicClass = () => {
        if (shouldRenderCanvas) return '';
        return open ? 'gap-4 overflow-x-auto pl-2 pr-5 md:w-2/12' : 'w-0 overflow-x-hidden pr-2 md:w-[4rem] ';
    };

    const handleCloseGroups = useCallback(() => {
        if (!shouldRenderCanvas) return;
        setOpen(false);
    }, [shouldRenderCanvas, setOpen]);

    const content = (
        <>
            <div
                className={`my-3 flex w-full flex-col ${shouldRenderCanvas ? 'py-2' : 'py-10'} ${getDynamicClass()} transition-all duration-500 ease-in-out md:gap-3 md:border-r md:border-r-gray-300`}
                onTransitionEnd={() => setShowContent(open)}
            >
                {open && !shouldRenderCanvas && <BsArrowBarLeft size={28} className={'mb-3 ml-auto flex'} onClick={() => setOpen(false)} />}
                {!showContent && !shouldRenderCanvas ? (
                    <div className={'my-auto flex'} onClick={() => setOpen(true)}>
                        <TbUsersGroup size={36} className={'my-auto'} />
                        <MdOutlineExpandLess size={40} className={'ml-2 rotate-90'} />
                    </div>
                ) : groupsList ? (
                    <>
                        <NewGroupModal groups={groupsList} onOpen={handleCloseGroups} />
                        <RichTreeView items={generateTreeViewItems(groupsList)} onSelectedItemsChange={(e, id) => handleSelectedItemChanged(id)} slots={{ item: CustomTreeItem }} />
                    </>
                ) : (
                    <div className={'m-auto'}>
                        <Spinner size="xl" />
                    </div>
                )}
            </div>
        </>
    );

    return shouldRenderCanvas ? (
        <>
            <Button color={'gray'} className={'mx-auto'} size={'sm'} onClick={() => setOpen(true)}>
                Groups
            </Button>
            <OffCanvas onClose={() => setOpen(false)} isOpen={open} position={'left'} header={'Groups'} width={300}>
                {content}
            </OffCanvas>
        </>
    ) : (
        content
    );
};

GroupsList.propTypes = {
    setSelectedGroup: func.isRequired,
};
export default GroupsList;
