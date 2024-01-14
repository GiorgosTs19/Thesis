import React from 'react';
const RowOfProperties = ({properties}) => {
    return <div className="rounded-lg p-6 flex flex-wrap gap-8">
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
}

export default RowOfProperties;
