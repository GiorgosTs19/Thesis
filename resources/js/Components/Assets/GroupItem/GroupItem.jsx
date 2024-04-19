import { bool, func, object, string } from 'prop-types';
import React, { forwardRef } from 'react';
import clsx from 'clsx';

const styles = {
    badge: 'cursor-pointer text-center py-2 hover:bg-gray-100 px-3 py-1 ',
    color: 'gray',
};

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
const GroupItem = forwardRef(({ group, onClick, isSelected, className }, ref) => {
    return (
        <>
            <div key={group.id} onClick={onClick} className={clsx(styles.badge, className ?? 'w-full', isSelected ? 'text-sky-400' : 'text-accent')} ref={isSelected ? ref : null}>
                <div className={'text-left text-lg'}>{group.name}</div>
                <div className={'text-left text-sm text-gray-400'}>{group.description}</div>
            </div>
        </>
    );
});

GroupItem.propTypes = {
    group: object,
    onClick: func,
    isSelected: bool,
    className: string,
};

GroupItem.displayName = 'GroupBadge';
export default GroupItem;
