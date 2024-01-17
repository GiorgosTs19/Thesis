import React from 'react';
import {arrayOf, number, oneOfType, shape, string} from "prop-types";

const RowOfProperties = ({properties, title}) => {
    return <div className="">
        {title && <div className={'text-3xl mb-2 p-1 text-center'}>
            {title}
        </div>}
        <div className={'flex flex-wrap gap-8 p-6'}>
            {properties.map(({name, value}) => (
                <div key={name} className="mb-4 w-fit flex-grow">
                    <p className="text-black border-l-2 border-l-blue-600 pl-3 text-lg font-bold">
                        {value}
                    </p>
                    <p className="text-gray-600 border-l-2 border-l-blue-600 pl-3">
                        {name}
                    </p>
                </div>
            ))}
        </div>
    </div>
}

RowOfProperties.propTypes = {
    properties: arrayOf(shape({
        name: string.isRequired,
        value: oneOfType([string, number])
    })),
    title: string
}
export default RowOfProperties;
