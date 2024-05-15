import React, { useEffect, useState } from 'react';
import PropTypes, { array, arrayOf, bool, func, number, shape, string } from 'prop-types';
import { Pagination } from '@/Components/Pagination/Pagination.jsx';
import DropDownMenu from '@/Components/DropDownMenu/DropDownMenu.jsx';
import clsx from 'clsx';
import { BsChevronDown, BsChevronRight } from 'react-icons/bs';
import { themeStyles } from '@/Theme/Theme.js';
import WorkSkeleton from '@/Components/Skeletons/WorkSkeleton/WorkSkeleton.jsx';

/**
 * PaginatedList Component.
 * A component for rendering a paginated list with optional parsing of data items.
 *
 * @component
 * @param response - The paginated data response object.
 * @param children - Optional children to be rendered above the list.
 * @param renderFn - A function to render each item in the list.
 * @param parser - Optional function to parse each item in the response data.
 * @param sortingOptions - Options for sorting the list of items.
 * @param title - An optional title for the list.
 * @param className - Optional classname for the wrapper of the list.
 * @param rounded - Whether the list's wrapper should be rounded or not.
 * @param header - An optional header for the list.
 * @param emptyListPlaceholder - An placeholder to show if the list is empty ( defaults to 'This list is empty' ).
 * @param collapsable - A boolean to indicate whether the list should be collapsable or not.
 * @param initiallyCollapsed - A boolean to indicate whether the list ( if collapsable is set to true ) should be initially rendered collapsed.
 * @returns The PaginatedList component.
 *
 * @example
 * With children:
 * <PaginatedList response={response} renderFunc={()=>{}}>
 *     {children}
 * </PaginatedList>
 *
 * Without children:
 * <PaginatedList response={response} renderFunc={()=>{}}/>
 *
 * With Parser :
 * <PaginatedList response={response} renderFunc={()=>{}} parser={()=>{}}/>
 */
const PaginatedList = ({
    className,
    response,
    title,
    renderFn,
    filterFn,
    parser,
    sortingOptions,
    currentSortOption,
    useInertia = false,
    header,
    rounded = false,
    onLinkClick = () => {},
    emptyListPlaceholder = 'This list is empty',
    collapsable = false,
    initiallyCollapsed = false,
    gap = 6,
    loading,
    perPage,
}) => {
    const items = (parser ? response.data.map((item) => parser(item)) : response.data).filter(filterFn ? (item) => filterFn(item) : () => true);
    const [listCollapsed, setListCollapsed] = useState(collapsable && initiallyCollapsed);
    const skeletonsArray = new Array(perPage).fill(null);

    useEffect(() => {
        if (!collapsable) setListCollapsed(false);
    }, [collapsable]);

    return (
        <div className={clsx(`${rounded ? 'rounded-lg' : ''} flex h-full flex-col p-2`, className)}>
            <div className={'mb-3 flex justify-between'}>
                <div className={clsx(` ${collapsable ? 'cursor-pointer' : ''}`, styles.title)} onClick={() => collapsable && setListCollapsed((prev) => !prev)}>
                    {title} {response?.meta?.total && `(${response?.meta?.total})`}
                    {collapsable && <span className={'ml-3 mt-1.5 flex'}>{listCollapsed ? <BsChevronRight /> : <BsChevronDown />}</span>}
                </div>
                {!listCollapsed && sortingOptions && (
                    <div className={'col-span-1 flex sm:mx-auto md:ml-auto md:mr-0'}>
                        <DropDownMenu options={sortingOptions} renderLinks className={'relative ms-auto'} defaultOption={sortingOptions.find((option) => option.value === currentSortOption)} />
                    </div>
                )}
            </div>
            {!listCollapsed ? (
                <>
                    {header && <div className={styles.header}>{header}</div>}
                    {items?.length ? (
                        <ul className={`flex h-full list-disc flex-col gap-${gap}`}>
                            {items?.length ? (
                                items?.map((item, index) => (loading ? <WorkSkeleton key={index} /> : renderFn(item, index + (response.meta.from ?? 0))))
                            ) : (
                                <h4 className={'col-span-full m-auto text-center text-xl'}>{emptyListPlaceholder}</h4>
                            )}
                        </ul>
                    ) : loading ? (
                        skeletonsArray.map((t, i) => <WorkSkeleton key={i} />)
                    ) : (
                        <h4 className={'m-auto text-xl'}>{emptyListPlaceholder}</h4>
                    )}
                    {response.meta && <Pagination meta={response.meta} className={'mx-auto mt-2 text-sm'} useInertia={useInertia} onLinkClick={onLinkClick} />}
                </>
            ) : (
                <span className={'m-auto text-base text-gray-500 opacity-85'}>List Collapsed</span>
            )}
        </div>
    );
};

const SortingOptionPropTypes = PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
    default: bool.isRequired,
});

const styles = {
    wrapper: `p-4 flex flex-col`,
    title: themeStyles.listTitle,
    header: 'text-gray-500 text-sm 2xl:text-base mb-6',
};

PaginatedList.propTypes = {
    loading: bool,
    title: string,
    perPage: number,
    className: string,
    renderFn: func.isRequired,
    filterFn: func,
    header: string,
    parser: func,
    rounded: bool,
    sortingOptions: arrayOf(SortingOptionPropTypes),
    currentSortOption: number,
    useInertia: bool,
    onLinkClick: func,
    collapsable: bool,
    initiallyCollapsed: bool,
    response: shape({
        data: array.isRequired,
        links: shape({
            first: string,
            last: string,
            prev: string,
            next: string,
        }),
        meta: shape({
            current_page: number,
            from: number,
            last_page: number,
            per_page: number,
            path: string,
            to: number,
            total: number,
            links: arrayOf(
                shape({
                    url: string,
                    label: string,
                    active: bool,
                }),
            ),
        }),
    }).isRequired,
    emptyListPlaceholder: string,
    gap: function (props, propName, componentName) {
        if (props.gap < 0 || props.gap > 10) {
            return new Error('Invalid prop `' + propName + '` supplied to' + ' `' + componentName + '`. Validation failed. gap has to be a number between 0 and 10');
        }
    },
};
export default PaginatedList;
