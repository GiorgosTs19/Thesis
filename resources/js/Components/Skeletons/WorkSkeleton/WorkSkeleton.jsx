import React from 'react';

const WorkSkeleton = () => {
    return (
        <div className={'mb-3 flex flex-col border-l border-l-blue-700 p-2'}>
            <div className=" mb-2.5 h-2.5 w-11/12 rounded-full bg-gray-300 dark:bg-gray-700" />
            <div className=" mb-2.5 mr-auto h-2.5 w-8/12 rounded-full bg-gray-300 dark:bg-gray-700" />
            <div className=" mb-2.5 mr-auto h-2.5 w-6/12 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>
    );
};

export default WorkSkeleton;
