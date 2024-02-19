import {API} from "@/API/API.js";
import {Badge} from "flowbite-react";
import clsx from "clsx";
import UtilityModal from "@/Components/Modal/UtilityModal.jsx";
import {AiOutlineDelete} from "react-icons/ai";
import {bool, func, object} from "prop-types";
import React, {forwardRef} from "react";

const styles = {
    badge: 'w-fit rounded-md my-auto hover:scale-110 transition-transform duration-300 cursor-pointer',
    color: 'gray',
    name: 'my-auto px-2 text-lg',
    deleteButton: 'ml-auto p-2 rounded-full'
}

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
const GroupBadge = forwardRef(({group, onClick, isSelected, setGroups}, ref) => {
    const handleDelete = async () => {
        API.instance.groups.deleteGroup(group.id).then(response => setGroups(response.data.groups));
    };

    return (
        <>
            <Badge key={group.id} onClick={onClick} className={clsx(styles.badge)} color={styles.color}>
                <div className={'flex'} ref={isSelected ? ref : null}>
                    <div className={clsx(styles.name, isSelected ? 'text-sky-400' : 'text-accent')}>{group.name}</div>
                    <div className={clsx(styles.deleteButton, `hover:${isSelected ? "bg-gray-700" : "bg-gray-200"}`)}>
                        <UtilityModal acceptText={'Delete'} header={`Delete ${group.name}`} message={`Are you sure you want to permanently delete ${group.name}?`}
                                      declineText={'Cancel'} buttonClassName={'cursor-pointer'} onAccept={handleDelete}>
                            <AiOutlineDelete className={""}/>
                        </UtilityModal>
                    </div>
                </div>
            </Badge>
        </>
    );
});

GroupBadge.propTypes = {
    group: object,
    onClick: func,
    isSelected: bool,
    setGroups: func
};

GroupBadge.displayName = 'GroupBadge';
export default GroupBadge;
