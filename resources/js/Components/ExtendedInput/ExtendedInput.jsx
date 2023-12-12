import PropTypes, {func, node, number, oneOfType, string} from 'prop-types';
import React from 'react'
ExtendedInput.propTypes = {
    name:string.isRequired,
    label:string,
    placeholder:string,
    leadingElement:oneOfType([node, string]),
    value:oneOfType([string, number]).isRequired,
    onChange:func.isRequired,
    containerClassName:string,
    inputClassName:string
};

const defaultClassName = 'block rounded-md w-full border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 ' +
    'placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6';
function ExtendedInput({name ,leadingElement, value, onChange, label = '', placeholder = '', containerClassName = '',
                       inputClassName = '', leadingElementClassName = ''}) {
    return (
        <div className={containerClassName}>
            {label && <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">{label}</label>}
            <div className="relative mt-2 rounded-md shadow-sm">
                {leadingElement && <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className={`text-gray-500 sm:text-sm ${leadingElementClassName}`}>{leadingElement}</span>
                </div>}
                <input type="text" name={name} id={name} className={`${defaultClassName} ${inputClassName}`} placeholder={placeholder}
                value={value} onChange={onChange}/>
            </div>
        </div>
    );
}

export default ExtendedInput;
