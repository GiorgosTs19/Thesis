import React, { useState } from 'react';

const DropdownMenu = ({ options, onSelect, className, label}) => {
    const [selectedOption, setSelectedOption] = useState(options[0]);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setMenuOpen(false);
        onSelect(option.value);
    };

    return (
        <div className={`relative inline-block text-left ${className}`}>
            <div className={'mb-2 text-lg'}>
                {label}
            </div>

            <div>
                <button
                    type="button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="inline-flex justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-300 rounded-md focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                    id="options-menu"
                    aria-haspopup="true"
                    aria-expanded="true"
                >
                    {selectedOption ? selectedOption.name : 'Select an option'}
                    <svg
                        className="-mr-1 ml-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 12a1 1 0 0 1-.707-.293l-4-4a1 1 0 1 1 1.414-1.414L10 9.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-.707.293z"
                        />
                    </svg>
                </button>
            </div>

            {menuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleOptionClick(option)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                role="menuitem"
                            >
                                {option.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;
