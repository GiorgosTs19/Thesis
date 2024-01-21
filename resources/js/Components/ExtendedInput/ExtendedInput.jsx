import {arrayOf, bool, func, node, number, oneOfType, string} from 'prop-types';
import React from 'react'

const defaultClassName = 'block rounded-md w-full border-0 py-2 px-4 text-gray-900 ' +
    'placeholder:text-gray-400 sm:text-sm sm:leading-6';

const ExtendedInput = ({
                           name,
                           leadingElement = 'children',
                           value,
                           onChange,
                           label = '',
                           placeholder = '',
                           containerClassName = '',
                           inputClassName = '',
                           leadingElementClassName = '',
                           children,
                           type = 'text',
                           autoFocus = false
                       }) => {
    return (
        <div className={containerClassName}>
            {label && <label htmlFor={name}
                             className={`block text-sm font-medium leading-6 text-gray-900 ${leadingElementClassName}`}>{label}</label>}
            <div className="relative mt-2 rounded-md shadow-sm justify-between flex">
                {leadingElement &&
                    <div className="flex items-center pl-3 w-fit">
                        {leadingElement === 'children' ? children : leadingElement}
                    </div>}
                <input type={type} name={name} id={name} className={`${defaultClassName} ${inputClassName}`}
                       placeholder={placeholder}
                       value={value} onChange={onChange} autoFocus={autoFocus}/>
            </div>
        </div>
    );
}

ExtendedInput.propTypes = {
    name: string.isRequired,
    type: string,
    label: string,
    placeholder: string,
    autoFocus: bool,
    leadingElement: oneOfType([node, string]),
    value: oneOfType([string, number]).isRequired,
    onChange: func.isRequired,
    containerClassName: string,
    inputClassName: string,
    leadingElementClassName: string,
    children: oneOfType([node, arrayOf(node)])
};
export default ExtendedInput;
