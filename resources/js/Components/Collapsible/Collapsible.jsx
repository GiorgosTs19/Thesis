import { BsChevronDown, BsChevronRight } from 'react-icons/bs';
import React, { useState } from 'react';
import { arrayOf, bool, node, oneOfType, string } from 'prop-types';
import { Button } from 'flowbite-react';

/**
 * Collapsible component that displays a button which can toggle
 * the visibility of its children content.
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode|React.ReactNode[]} props.children - The content to be toggled.
 * @param {boolean} [props.initiallyCollapsed=true] - Determines if the content is initially collapsed.
 * @param {string} props.title - The title displayed on the button.
 * @returns {JSX.Element} The rendered Collapsible component.
 */
const Collapsible = ({ children, initiallyCollapsed = true, title }) => {
    const [listCollapsed, setListCollapsed] = useState(initiallyCollapsed);

    const handleCollapse = () => {
        setListCollapsed((prev) => !prev);
    };

    return (
        <div className={'w-100 flex flex-col'}>
            <Button className={'mx-auto my-5 flex cursor-pointer'} onClick={handleCollapse} color={'light'}>
                <div className={'text-center text-lg text-gray-600 xl:text-xl'}>{title} (Click to expand)</div>
                <span className={'ml-3 mt-1.5 flex'}>{listCollapsed ? <BsChevronRight /> : <BsChevronDown />}</span>
            </Button>
            {!listCollapsed && children}
        </div>
    );
};

Collapsible.propTypes = {
    children: oneOfType([node, arrayOf(node)]).isRequired,
    initiallyCollapsed: bool,
    title: string.isRequired,
};

export default Collapsible;
