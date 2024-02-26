import React, {useCallback, useRef, useState} from "react";
import {Spinner} from "flowbite-react";
import {arrayOf, object, oneOfType} from "prop-types";
import NewGroupModal from "@/Components/Modal/NewGroupModal.jsx";
import useAsync from "@/Hooks/useAsync/useAsync.js";
import GroupBadge from "@/Components/Assets/GroupItem/GroupBadge.jsx";
import {SelectedGroup} from "@/Pages/Routes/Groups/SelectedGroup.jsx";
import {useScrollIntoView} from "@/Hooks/useScrollIntoView/useScrollIntoView.js";
import {useGroupCreatedEventListener, useGroupDeletedEventListener, useGroupUpdatedEventListener} from "@/Events/GroupEvent/GroupEvent.js";
import {ToastTypes, useToast} from "@/Contexts/ToastContext.jsx";
import useAPI from "@/Hooks/useAPI/useAPI.js";

/**
 * @component
 * GroupsPage Component
 * A component for displaying and managing groups, including group details and members.
 *
 * @example
 * <GroupsPage groups={groups}/>
 *
 * @param {Array} groups - An array of group objects to be displayed and managed.
 * @returns The rendered GroupsPage component.
 */
const GroupsPage = ({groups}) => {
    const [groupToShow, setGroupToShow] = useState(null);
    const [groupsList, setGroupsList] = useState(groups);
    const [selectedGroup, setSelectedGroup] = useState(null);
    console.log(selectedGroup)
    const [worksPaginationInfo, setWorksPaginationInfo] = useState(null);
    const [worksShouldRefresh, setWorksShouldRefresh] = useState(false);
    const activeGroupBadgeRef = useRef(null);
    const api = useAPI();
    const {showToast} = useToast();
    useScrollIntoView(activeGroupBadgeRef);

    // Listen for Group Updated Events
    useGroupUpdatedEventListener((e) => {
        if (e.success) {
            showToast(e.data.action, e.data.toastType, e.success);
        } else if (e.error) {
            showToast(e.error, ToastTypes.ERROR, 'Error', 5000);
        }
        setWorksShouldRefresh(prev => !prev)
    });

    // Listen for Group Created Events
    useGroupCreatedEventListener((e) => {
        if (e.success) {
            showToast(e.data.action, e.data.toastType, e.success);
            setWorksShouldRefresh(prev => !prev)
            // * Add the new group to the list of groups.
            setGroupsList(prev => [...prev, e.data.group]);
            setSelectedGroup(e.data.group.id);
        } else if (e.error) {
            showToast(e.error, ToastTypes.ERROR, 'Error', 5000);
        }
    });

    // Listen for Group Deleted Events
    useGroupDeletedEventListener((e) => {
        if (e.success) {
            showToast(e.data.action, e.data.toastType, e.success);
            setWorksShouldRefresh(prev => !prev)
            // * Remove the group from the list of groups.
            setGroupsList(prev => prev.filter(group => group.id !== e.data.group.id))
            setGroupToShow(null)
        } else if (e.error) {
            showToast(e.error, ToastTypes.ERROR, 'Error', 5000);
        }
    });

    // Callback to fetch the group's data when a new group is selected.
    const handleFetchGroup = useCallback(() => {
        if (!selectedGroup)
            return;
        return api.groups.getGroup(selectedGroup).then(data => {
            setGroupToShow(data.data.group)
            setWorksPaginationInfo(data.data.works)
        })
    }, [selectedGroup]);

    const {loading} = useAsync(handleFetchGroup, !!selectedGroup, [worksShouldRefresh]);

    const showCurrentGroup = !loading && !!groupToShow && !!worksPaginationInfo;

    return (
        <>
            <div className={'flex flex-col gap-3 my-10'}>
                <span className={'mx-auto text-2xl text-accent'}>Groups</span>
                <div className={'flex gap-3 overflow-x-auto p-3 overflow-y-hidden border-b border-b-gray-200'}>
                    <NewGroupModal groups={groupsList}/>
                    {groupsList.map((group) => (
                        <GroupBadge key={group.id} group={group}
                                    onClick={() => setSelectedGroup(group.id)} isSelected={selectedGroup === group.id}/>
                    ))}
                </div>
            </div>

            {loading && <div className={'m-auto'}><Spinner size="xl"/></div>}
            {!loading && !selectedGroup && <h4 className={'m-auto text-2xl'}>Select a group to see more details</h4>}
            {showCurrentGroup && <SelectedGroup group={groupToShow} setSelectedGroup={setSelectedGroup} setGroupsList={setGroupsList}
                                                worksPaginationInfo={worksPaginationInfo} setWorksPaginationInfo={setWorksPaginationInfo}/>}
        </>
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
};
export default GroupsPage;
