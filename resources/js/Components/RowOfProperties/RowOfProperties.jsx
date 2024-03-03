import React from 'react';
import { arrayOf, func, number, oneOfType, shape, string } from 'prop-types';
import { OpenAlexSVG } from '@/SVGS/OpenAlexSVG.jsx';
import { OrcidSVG } from '@/SVGS/OrcidSVG.jsx.jsx';
import { ScopusSVG } from '@/SVGS/ScopusSVG.jsx';
import clsx from 'clsx';

const styles = {
    title: 'text-xl lg:text-3xl mb-2 p-1 text-center',
    propertiesWrapper: 'flex flex-wrap gap-8 p-6 mb-4',
    propertyWrapper: 'mb-4 w-fit flex-grow flex',
    propertyValue: 'text-black border-l-2 border-l-blue-600 pl-3 font-bold text-sm',
    propertyName: 'text-gray-600 border-l-2 border-l-blue-600 pl-3 text-xs',
};
const RowOfProperties = ({ properties, title }) => {
    const filterProperties = properties.filter((prop) => !!prop);
    const getIcon = (propertyName) => {
        switch (propertyName) {
            case 'Open Alex':
                return <OpenAlexSVG height={22} width={22} />;
            case 'OrcId':
                return <OrcidSVG height={22} width={22} />;
            case 'Scopus':
                return <ScopusSVG height={22} width={22} />;
            default:
                return null;
        }
    };

    return (
        <div>
            {title && <div className={styles.title}>{title}</div>}
            <div className={styles.propertiesWrapper}>
                {filterProperties.map((property) => {
                    if (!property) return null;
                    return (
                        <div
                            key={property.name}
                            className={clsx(styles.propertyWrapper, property.onClick ? 'cursor-pointer' : '')}
                            onClick={() => {
                                property.onClick && property.onClick();
                            }}
                        >
                            <div>
                                <p className={styles.propertyValue}>{property.value}</p>
                                <p className={styles.propertyName}>{property.name}</p>
                            </div>
                            <span className={'mx-2 my-auto'}>{getIcon(property.name)}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

RowOfProperties.propTypes = {
    properties: arrayOf(
        shape({
            name: string.isRequired,
            value: oneOfType([string, number]),
            onClick: func,
        }),
    ),
    title: string,
};
export default RowOfProperties;
