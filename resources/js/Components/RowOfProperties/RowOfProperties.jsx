import React from 'react';
import { arrayOf, bool, func, number, oneOfType, shape, string } from 'prop-types';
import { OpenAlexSVG } from '@/SVGS/OpenAlexSVG.jsx';
import { OrcidSVG } from '@/SVGS/OrcidSVG.jsx.jsx';
import { ScopusSVG } from '@/SVGS/ScopusSVG.jsx';
import clsx from 'clsx';

const styles = {
    title: 'text-xl lg:text-3xl mb-2 p-1 text-center',
    header: 'mb-2 p-1 text-left font-bold text-gray-700 flex gap-3',
    propertiesWrapper: 'flex flex-wrap gap-8 px-6 py-2',
    propertyWrapper: 'mb-4 w-fit flex',
    propertyValue: 'text-black border-l-2 border-l-blue-600 pl-3 font-bold text-sm',
    propertyName: 'text-gray-600 border-l-2 border-l-blue-600 pl-3 text-xs',
};
const RowOfProperties = ({ properties, title, vertical = false, header, grow = true, className }) => {
    const filterProperties = properties.filter((prop) => !!prop);
    const getIcon = (propertyName) => {
        switch (propertyName) {
            case 'Open Alex':
            case 'OpenAlex':
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
        <div className={className}>
            {title && <div className={clsx(styles.title)}>{title}</div>}
            {header && <div className={clsx(styles.header)}>{header}</div>}
            <div className={clsx(styles.propertiesWrapper, vertical ? 'flex-col' : 'flex-row')}>
                {filterProperties.map((property) => {
                    if (!property) return null;
                    return (
                        <div
                            key={property.name}
                            className={clsx(styles.propertyWrapper, property.onClick ? 'cursor-pointer' : '', grow ? 'flex-grow' : '')}
                            onClick={() => {
                                property.onClick && property.onClick();
                            }}
                        >
                            <div>
                                <div className={'flex'}>
                                    <p className={styles.propertyValue}>{property.value}</p>
                                    <span className={'mx-4 my-auto'}>{getIcon(property.name)}</span>
                                </div>
                                <p className={styles.propertyName}>{property.name}</p>
                            </div>
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
    vertical: bool,
    header: string,
    className: string,
    grow: bool,
};
export default RowOfProperties;
