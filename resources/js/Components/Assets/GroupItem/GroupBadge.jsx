import {Badge} from "flowbite-react";
import clsx from "clsx";
import UtilityModal from "@/Components/Modal/UtilityModal.jsx";
import {AiOutlineDelete} from "react-icons/ai";
import {bool, func, object, string} from "prop-types";
import React, {forwardRef} from "react";
import useAPI from "@/Hooks/useAPI/useAPI.js";

const styles = {
    badge: 'rounded-md hover:scale-110 transition-transform duration-300 cursor-pointer',
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
 * @param {Object} group - The group object to be displayed.
 * @param {Function} onClick - The function to be called when the group is clicked.
 * @param {boolean} isSelected - Indicates whether the group is currently selected.
 * @param {Function} setGroups - The function to update the list of groups after a delete operation.
 * @returns The rendered Group component.
 */
const GroupBadge = forwardRef(({group, onClick, isSelected, className}, ref) => {
    const api = useAPI();
    const handleDelete = async () => api.groups.deleteGroup(group);

    return (
        <>
            <Badge key={group.id} onClick={onClick} className={clsx(styles.badge, className ?? 'w-full')} color={styles.color}>
                <div className={'flex'} ref={isSelected ? ref : null}>
                    <div className={clsx(styles.name, isSelected ? 'text-sky-400' : 'text-accent')}>{group.name}</div>
                    <div className={clsx(styles.deleteButton, `hover:bg-gray-300`)}>
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
    className: string
};

GroupBadge.displayName = 'GroupBadge';
export default GroupBadge;
