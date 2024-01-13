import React, { useState } from 'react';
import {bool, func, string} from "prop-types";

const Switch = ({ checkedLabel, uncheckedLabel, onChange, checked, className }) => {
    const [isChecked, setIsChecked] = useState(checked);

    const toggleSwitch = () => {
        setIsChecked(!isChecked);
        onChange && onChange(isChecked);
    };

    return (
        <div className={className}>
            <label className="flex items-center cursor-pointer">
                {uncheckedLabel && <span className="mr-4">{uncheckedLabel}</span>}
                <div className="relative">
                    <input type="checkbox" className="hidden" checked={isChecked} onChange={toggleSwitch}/>
                    <div className="toggle__line w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                    <div
                        className={`toggle__dot absolute w-6 h-6 bg-white rounded-full shadow -translate-y-5 transition-transform ${isChecked ? 'transform translate-x-full' : ''}`}></div>
                </div>
                {checkedLabel && <span className="ml-4">{checkedLabel}</span>}
            </label>
        </div>
    );
};

Switch.propTypes = {
    checkedLabel: string.isRequired,
    uncheckedLabel: string.isRequired,
    onChange: func,
    checked: bool,
}
export default Switch;
