import React, { useCallback, useRef, useState } from 'react';
import { Spinner } from 'flowbite-react';
import { arrayOf, number, object, oneOfType, shape, string } from 'prop-types';
import useAsync from '@/Hooks/useAsync/useAsync.js';
import { ActiveGroup } from '@/Pages/Routes/Groups/ActiveGroup/ActiveGroup.jsx';
import { useScrollIntoView } from '@/Hooks/useScrollIntoView/useScrollIntoView.js';
import { useGroupCreatedEventListener, useGroupDeletedEventListener, useGroupUpdatedEventListener } from '@/Events/GroupEvent/GroupEvent.js';
import { ToastTypes, useToast } from '@/Contexts/ToastContext.jsx';
import useAPI from '@/Hooks/useAPI/useAPI.js';
import GroupsList from '@/Pages/Routes/Groups/GroupsList/GroupsList.jsx';
import NewGroupModal from '@/Components/Modal/NewGroupModal.jsx';

/**
 * @component
 * GroupsPage Component
 * A component for displaying and managing groups, including group details and members.
 *
 * @example
 * <GroupsPage/>
 *
 * @returns The rendered GroupsPage component.
 */
const GroupsPage = () => {
    const [groupObject, setGroupObject] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [worksShouldRefresh, setWorksShouldRefresh] = useState(false);
    const activeGroupBadgeRef = useRef(null);
    const api = useAPI();
    const { showToast } = useToast();
    useScrollIntoView(activeGroupBadgeRef);

    // Listen for Group Updated Events
    useGroupUpdatedEventListener((e) => {
        if (e.success) {
            showToast(e.data.action, e.data.toastType, e.success);
        } else if (e.error) {
            showToast(e.error, ToastTypes.ERROR, 'Error', 5000);
        }
        setWorksShouldRefresh((prev) => !prev);
    });

    // Listen for Group Created Events
    useGroupCreatedEventListener((e) => {
        if (e.success) {
            showToast(e.data.action, e.data.toastType, e.success);
            setWorksShouldRefresh((prev) => !prev);
            // * Add the new group to the list of groups.
            setSelectedGroup(e.data.group.id);
        } else if (e.error) {
            showToast(e.error, ToastTypes.ERROR, 'Error', 5000);
        }
    });

    // Listen for Group Deleted Events
    useGroupDeletedEventListener((e) => {
        if (e.success) {
            showToast(e.data.action, e.data.toastType, e.success);
            setWorksShouldRefresh((prev) => !prev);
            // * Remove the group from the list of groups.
            setGroupObject(null);
        } else if (e.error) {
            showToast(e.error, ToastTypes.ERROR, 'Error', 5000);
        }
    });

    // Callback to fetch the group's data when a new group is selected.
    const handleFetchGroup = useCallback(() => {
        if (!selectedGroup) return;
        return api.groups.getGroup(selectedGroup).then((data) => {
            setGroupObject(data.data);
        });
    }, [selectedGroup]);

    const { loading } = useAsync(handleFetchGroup, !!selectedGroup, [worksShouldRefresh]);

    const showCurrentGroup = !loading && !!groupObject;

    return (
        <div className={'flex min-h-[calc(100vh-4rem)] flex-col'}>
            <div className={'flex w-full justify-between'}>
                <GroupsList setSelectedGroup={setSelectedGroup} />
                <NewGroupModal />
            </div>
            {loading && (
                <div className={'m-auto'}>
                    <Spinner size="xl" />
                </div>
            )}
            {!loading && !groupObject && <h4 className={'m-auto text-center  text-2xl'}>Select a group to see more details</h4>}
            {showCurrentGroup && <ActiveGroup groupObject={groupObject} setSelectedGroup={setSelectedGroup} />}
        </div>
    );
};

const styles = {
    listGroupItem: `w-full cursor-pointer text-lg justify-between`,
    deleteIcon: 'p-1 rounded-full hover:bg-gray-300 my-auto cursor-pointer',
    wrapper: 'flex flex-col gap-5 p-3',
    selectedGroup: 'my-auto',
    listGroup: 'w-full overflow-y-auto gap-3 m-auto',
    listGroupCol: 'flex min-w-60',
    selectedGroupCol: 'w-full flex',
};

GroupsPage.propTypes = {
    groups: oneOfType([object, arrayOf(object)]),
    customTypes: arrayOf(shape({ id: number.isRequired, name: string.isRequired })).isRequired,
};
export default GroupsPage;
