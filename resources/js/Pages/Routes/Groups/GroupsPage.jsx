import React, {useCallback, useEffect, useRef, useState} from "react";
import {Card, Spinner} from "flowbite-react";
import {arrayOf, object, oneOfType} from "prop-types";
import {API} from "@/API/API.js";
import NewGroupModal from "@/Components/Modal/NewGroupModal.jsx";
import useAsync from "@/Hooks/useAsync/useAsync.js";
import GroupBadge from "@/Components/Assets/GroupItem/GroupBadge.jsx";
import {SelectedGroup} from "@/Pages/Routes/Groups/SelectedGroup.jsx";
import {useScrollIntoView} from "@/Hooks/useScrollIntoView/useScrollIntoView.js";
import {useGroupUpdatedEventListener} from "@/Events/GroupUpdatedEvent/GroupUpdatedEvent.js";
import {ToastTypes, useToast} from "@/Contexts/ToastContext.jsx";

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
    const [worksPaginationInfo, setWorksPaginationInfo] = useState(null);
    const [worksShouldRefresh, setWorksShouldRefresh] = useState(false);
    const activeGroupBadgeRef = useRef(null);
    useScrollIntoView(activeGroupBadgeRef);
    const {
        showToast,
    } = useToast();
    useGroupUpdatedEventListener((e) => {
        console.log(e)
        if (e.success) {
            showToast(e.data.action, e.data.toastType);
        } else if (e.error) {
            showToast(e.error, ToastTypes.ERROR, 5000);
        }
        setWorksShouldRefresh(prev => !prev)
    })

    // * Every time a group changes, find the selected group inside the new array returned from the back-end and set it as the selected.
    useEffect(() => {
        const newCurrentGroup = groupsList.find(item => item.id === selectedGroup) ?? null;
        setSelectedGroup(newCurrentGroup?.id)
    }, [groupsList]);

    const handleNewGroupCreated = (newGroups, newGroup) => {
        setGroupsList(newGroups);
        setSelectedGroup(newGroup);
    }
    const handleFetchGroup = useCallback(() => {
        if (!selectedGroup)
            return;
        return API.instance.groups.getGroup(selectedGroup).then(data => {
            setGroupToShow(data.data.group)
            setWorksPaginationInfo(data.data.works)
        })
    }, [selectedGroup]);

    const {data, loading} = useAsync(handleFetchGroup, !!selectedGroup, [worksShouldRefresh]);

    useEffect(() => {
        if (!data) return;
        if (data.success) {
            setGroupToShow({group: data.data.group, works: data.data.works})
            setSelectedGroup(data.data.group.id)
        }
    }, [data])


    const showCurrentGroup = !loading && !!groupToShow && !!worksPaginationInfo;

    return (
        <>
            <div className={'flex flex-col gap-3 my-10'}>
                <span className={'mx-auto text-2xl text-accent'}>Groups</span>
                <div className={'flex gap-3 overflow-x-auto p-3 overflow-y-hidden border-b border-b-gray-400'}>
                    <NewGroupModal groups={groupsList} handleNewGroupCreated={handleNewGroupCreated}/>
                    {groupsList.map((group) => (
                        <GroupBadge key={group.id} group={group}
                                    depth={0} onClick={() => setSelectedGroup(group.id)} isSelected={selectedGroup === group.id} setGroups={setGroupsList}/>
                    ))}
                </div>
            </div>

            {loading && <div className={'m-auto'}><Spinner size="xl"/></div>}
            {!loading && !selectedGroup && <h4 className={'m-auto text-2xl'}>Select a group to see more details</h4>}
            {showCurrentGroup && <Card className={styles.selectedGroup}>
                <SelectedGroup group={groupToShow} setSelectedGroup={setSelectedGroup} setGroupsList={setGroupsList} selectedGroup={selectedGroup}
                               worksPaginationInfo={worksPaginationInfo} setWorksPaginationInfo={setWorksPaginationInfo} setGroupToShow={setGroupToShow}/>
            </Card>}
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
