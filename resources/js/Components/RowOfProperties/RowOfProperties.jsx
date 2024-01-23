import React from 'react';
import {arrayOf, number, oneOfType, shape, string} from "prop-types";

const styles = {
    title: 'text-3xl mb-2 p-1 text-center',
    propertiesWrapper: 'flex flex-wrap gap-8 p-6',
    propertyWrapper: 'mb-4 w-fit flex-grow',
    propertyValue: 'text-black border-l-2 border-l-blue-600 pl-3 text-lg font-bold',
    propertyName: 'text-gray-600 border-l-2 border-l-blue-600 pl-3'
}
const RowOfProperties = ({properties, title}) => {
    return <div className="">
        {title && <div className={styles.title}>
            {title}
        </div>}
        <div className={styles.propertiesWrapper}>
            {properties.map(({name, value}) => (
                <div key={name} className={styles.propertyWrapper}>
                    <p className={styles.propertyValue}>
                        {value}
                    </p>
                    <p className={styles.propertyName}>
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
