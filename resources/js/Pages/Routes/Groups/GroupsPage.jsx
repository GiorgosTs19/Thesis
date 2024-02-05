import React, {useEffect, useState} from "react";
import {Badge, Card, ListGroup} from "flowbite-react";
import {arrayOf, bool, func, object, oneOfType} from "prop-types";
import List from "@/Components/List/List.jsx";
import {AuthorItem} from "@/Components/Assets/AuthorItem/AuthorItem.jsx";
import {Author} from "@/Models/Author/Author.js";
import {AiOutlineDelete} from "react-icons/ai";
import clsx from "clsx";
import {API} from "@/API/API.js";
import GroupUsersSearch from "@/Components/Search/AdminSearch/GroupUsersSearch.jsx";
import {ToastTypes, useToast} from "@/Contexts/ToastContext.jsx";
import NewGroupModal from "@/Components/Modal/NewGroupModal.jsx";
import UtilityModal from "@/Components/Modal/UtilityModal.jsx";


/**
 * Group Component
 * @component
 * A component representing a single group in the list of groups, providing the option to delete the group.
 *
 * @example
 * <Group onClick={onClick} isSelected={isSelected} setGroups={setGroups} group={group}/>;
 *
 * @param {Object} props - The component's properties.
 * @param {Object} group - The group object to be displayed.
 * @param {Function} onClick - The function to be called when the group is clicked.
 * @param {boolean} isSelected - Indicates whether the group is currently selected.
 * @param {Function} setGroups - The function to update the list of groups after a delete operation.
 * @returns The rendered Group component.
 */
const Group = ({group, onClick, isSelected, setGroups}) => {
    const handleDelete = async () => {
        API.instance.groups.deleteGroup(group.id).then(response => setGroups(response.data.groups));
    };

    return (
        <>
            <ListGroup.Item key={group.id} active={isSelected} className={styles.listGroupItem}
                            onClick={onClick}>
                <div className={"mr-5"}>{group.name}</div>
                <div className={clsx("ml-auto p-2 rounded-full  ", `hover:${isSelected ? "bg-gray-700" : "bg-gray-200"}`)}>
                    <UtilityModal acceptText={'Delete'} header={`Delete ${group.name}`} message={`Are you sure you want to permanently delete ${group.name}?`}
                                  declineText={'Cancel'} buttonClassName={'cursor-pointer'} onAccept={handleDelete}>
                        <AiOutlineDelete className={""}/>
                    </UtilityModal>
                </div>
            </ListGroup.Item>
        </>
    );
};

Group.propTypes = {
    group: object,
    onClick: func,
    isSelected: bool,
    setGroups: func
};

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
    const [selectedGroup, setSelectedGroup] = useState(groups[0]);
    const [currentGroups, setCurrentGroups] = useState(groups);
    const {
        showToast,
    } = useToast();

    const renderAuthorItem = (item, index) => {
        return (
            <AuthorItem author={item} index={index} key={index}>
                <UtilityModal acceptText={`Remove ${item.name}`} header={'Remove member'} onAccept={() => API.instance.groups.removeMember(selectedGroup.id, item.id).then((res) => {
                        showToast(`${item.name} has been removed from the group`, ToastTypes.WARNING);
                        setCurrentGroups(res.data.groups);
                    }
                )}
                              message={`Are you sure you want to remove ${item.name} from ${selectedGroup.name}?`} declineText={'Cancel'}>
                    <div className={styles.deleteIcon}>
                        <AiOutlineDelete/>
                    </div>
                </UtilityModal>
            </AuthorItem>
        );
    };

    useEffect(() => {
        const newCurrentGroup = currentGroups.find(item => item.id === selectedGroup.id) ?? null;
        setSelectedGroup(newCurrentGroup)
    }, [currentGroups]);

    return (
        <>
            <div className={styles.grid}>
                <div className={styles.listGroupCol}>
                    <ListGroup aria-label="Groups List" className={clsx(styles.listGroup, currentGroups.length < 2 ? '' : '')}>
                        <NewGroupModal setGroups={setCurrentGroups} groups={currentGroups}/>
                        {currentGroups.map((group) => (
                            <Group key={group.id} group={group}
                                   depth={0} onClick={() => setSelectedGroup(group)} isSelected={selectedGroup?.id === group.id} setGroups={setCurrentGroups}/>
                        ))}
                    </ListGroup>
                </div>
                <div className={styles.selectedGroupCol}>
                    {selectedGroup ? <Card className={styles.selectedGroup}>
                        <h5 className={styles.groupName}>
                            {selectedGroup.name}
                        </h5>
                        <p className={styles.selectedGroupDesc}>
                            {selectedGroup.description}
                        </p>
                        {selectedGroup.parent && (
                            <Badge className={styles.badge} onClick={() => setSelectedGroup(selectedGroup.parent)}>
                                Subgroup of : {selectedGroup.parent.name}
                            </Badge>
                        )}
                        <List data={selectedGroup.members} renderFn={renderAuthorItem} wrapperClassName={"w-full h-full"}
                              title={`Group Members ${selectedGroup.members.length ? ` ( ${selectedGroup.members.length} )` : ""}`}
                              parser={Author.parseResponseAuthor} emptyListPlaceholder={"This group has no members"}>
                            <GroupUsersSearch group={selectedGroup} setGroups={setCurrentGroups}/>
                        </List>
                    </Card> : <h4 className={'m-auto'}>Select a group to see more details</h4>}
                </div>
            </div>
        </>
    );
};

const styles = {
    listGroupItem: `w-full cursor-pointer text-lg justify-between`,
    deleteIcon: 'p-1 rounded-full hover:bg-gray-300 my-auto cursor-pointer',
    card: '',
    grid: 'grid grid-cols-3 lg:grid-cols-6 gap-5 h-full p-3',
    groupName: 'text-2xl font-bold tracking-tight text-gray-900 dark:text-white',
    selectedGroup: 'mx-auto w-full h-full',
    selectedGroupCol: 'col-span-3 lg:col-span-4 xl:col-span-5 flex h-full',
    selectedGroupDesc: 'font-normal text-gray-700 dark:text-gray-400',
    badge: 'text-lg cursor-pointer w-fit px-3 py-1 rounded-lg',
    listGroup: 'w-full lg:w-fit overflow-y-auto gap-3 m-auto h-full',
    listGroupCol: 'col-span-3 lg:col-span-2 xl:col-span-1 flex'
};

GroupsPage.propTypes = {
    groups: oneOfType([object, arrayOf(object)]),
};
export default GroupsPage;
