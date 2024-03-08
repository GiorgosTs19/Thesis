import React, { useState } from 'react';
import { arrayOf, bool, func, number, oneOfType, shape, string } from 'prop-types';
import { Link } from '@inertiajs/inertia-react';
import { useClickAway } from '@uidotdev/usehooks';

const DropdownMenu = ({ options, onSelect=(value)=>{}, className, label, defaultOption = null, renderLinks = false }) => {
    const [selectedOption, setSelectedOption] = useState(defaultOption);
    const [menuOpen, setMenuOpen] = useState(false);
    const ref = useClickAway(() => {
        setMenuOpen(false);
    });
    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setMenuOpen(false);
        onSelect && onSelect(option.value);
    };
    const renderDropDownItem = (option, index) => {
        return renderLinks ? (
            <Link
                key={option.value}
                href={option.url}
                name={`MenuItem${index}`}
                onClick={() => handleOptionClick(option)}
                className="mx-auto block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
                preserveState={true}
                preserveScroll={true}
            >
                {option.name}
            </Link>
        ) : (
            <button
                key={option.value}
                name={`MenuItem${index}`}
                onClick={() => handleOptionClick(option)}
                className="mx-auto block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
            >
                {option.name}
            </button>
        );
    };

    return (
        <div className={`relative inline-block text-left ${className}`}>
            {label && <div className={'mb-2 text-lg'}>{label}</div>}
            <div>
                <button
                    type="button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="inline-flex w-full justify-between rounded-md bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                    id="options-menu"
                    aria-haspopup="true"
                    aria-expanded="true"
                >
                    {selectedOption ? selectedOption.name : 'Select an option'}
                    <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path
                            fillRule="evenodd"
                            d="M10 12a1 1 0 0 1-.707-.293l-4-4a1 1 0 1 1 1.414-1.414L10 9.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-.707.293z"
                        />
                    </svg>
                </button>
            </div>

            {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5" ref={ref}>
                    <div className="flex flex-col py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {options.map((option, index) => renderDropDownItem(option, index))}
                    </div>
                </div>
            )}
        </div>
    );
};

DropdownMenu.propTypes = {
    options: arrayOf(
        shape({
            name: string.isRequired,
            value: number.isRequired,
            default: bool.isRequired,
            url: string,
        }),
    ),
    renderLinks: bool,
    onSelect: func,
    className: string,
    label: string,
    defaultOption: shape({
        name: string.isRequired,
        value: oneOfType([string, number]).isRequired,
    }),
};
export default DropdownMenu;
