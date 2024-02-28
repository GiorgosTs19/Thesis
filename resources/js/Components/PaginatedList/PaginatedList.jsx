import React, {useEffect, useState} from 'react';
import PropTypes, {array, arrayOf, bool, func, number, shape, string} from "prop-types";
import {Pagination} from "@/Components/Pagination/Pagination.jsx";
import DropDownMenu from "@/Components/DropDownMenu/DropDownMenu.jsx";
import clsx from "clsx";
import {BsChevronDown, BsChevronRight} from "react-icons/bs";
import {themeStyles} from "@/Theme/Theme.js";

/**
 * PaginatedList Component.
 * A component for rendering a paginated list with optional parsing of data items.
 *
 * @component
 * @param response - The paginated data response object.
 * @param children - Optional children to be rendered above the list.
 * @param renderFunc - A function to render each item in the list.
 * @param parser - Optional function to parse each item in the response data.
 * @param sortingOptions - Options for sorting the list of items.
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
                           className, response, title, renderFn, parser, sortingOptions, currentSortOption, useInertia = false,
                           header, rounded = false, onLinkClick = () => {
    }, emptyListPlaceholder = 'The list is empty', collapsable = false, initiallyCollapsed = false
                       }) => {
    const items = parser ? response.data.map(item => parser(item)) : response.data;
    const [listCollapsed, setListCollapsed] = useState(collapsable && initiallyCollapsed);

    useEffect(() => {
        if (!collapsable)
            setListCollapsed(false);
    }, [collapsable]);

    return <div className={clsx(`${rounded ? 'rounded-lg' : ''} p-4 flex flex-col h-full`, className)}>
        <div className={'flex mb-3 justify-between'}>
            <div className={clsx(` ${collapsable ? 'cursor-pointer' : ''}`, styles.title)} onClick={() => collapsable && setListCollapsed(prev => !prev)}>
                {title}
                {
                    collapsable && <span className={'ml-3 mt-1.5 flex'}>{listCollapsed ? <BsChevronRight/>
                        : <BsChevronDown/>}</span>
                }
            </div>
            {!listCollapsed && sortingOptions && <div className={'col-span-1 flex sm:mx-auto md:ml-auto md:mr-0'}>
                <DropDownMenu options={sortingOptions} renderLinks
                              className={'ms-auto relative'}
                              defaultOption={sortingOptions.find(option => option.value === currentSortOption)}/>
            </div>}
        </div>
        {!listCollapsed ? <>
            {header && <div className={styles.header}>
                {header}
            </div>}
            {items.length ?
                <ul className={`list-disc gap-10 h-full flex flex-col`}>
                    {items.length ? items.map((item, index) =>
                        renderFn(item, index + (response.meta.from ?? 0))
                    ) : <h4 className={'text-xl text-center m-auto col-span-full'}>{emptyListPlaceholder}</h4>}
                </ul>
                : <h4 className={'text-xl m-auto'}>{emptyListPlaceholder}</h4>}
            <Pagination response={response} className={'mx-auto mt-2 text-sm'} useInertia={useInertia} onLinkClick={onLinkClick}/>
        </> : <span className={'text-base text-gray-500 opacity-85 m-auto'}>List Collapsed</span>}

    </div>
}

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
}

PaginatedList.propTypes = {
    title: string,
    className: string,
    renderFn: func.isRequired,
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
            first: string.isRequired,
            last: string.isRequired,
            prev: string,
            next: string,
        }),
        meta: shape({
            current_page: number.isRequired,
            from: number,
            last_page: number.isRequired,
            per_page: number.isRequired,
            path: string.isRequired,
            to: number,
            total: number.isRequired,
            links: arrayOf(shape({
                url: string,
                label: string.isRequired,
                active: bool.isRequired
            })),
        })
    }).isRequired,
    emptyListPlaceholder: string
}
export default PaginatedList;
