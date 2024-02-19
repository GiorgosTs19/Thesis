import React from 'react';
import PropTypes, {array, arrayOf, bool, func, node, number, oneOfType, shape, string} from "prop-types";
import {Pagination} from "@/Components/Pagination/Pagination.jsx";
import DropDownMenu from "@/Components/DropDownMenu/DropDownMenu.jsx";
import clsx from "clsx";

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
                           className, response, children, renderFn, parser, sortingOptions, currentSortOption, useInertia = false,
                           onLinkClick = () => {
                           }, emptyListPlaceholder = 'The list is empty'
                       }) => {

    const items = parser ? response.data.map(item => parser(item)) : response.data;

    return <div className={clsx("rounded-lg p-4 flex flex-col h-full", className)}>
        <div className={'grid grid-cols-1 sm:grid-cols-2 mb-6 md:mb-4'}>
            <div className={'col-span-1'}>
                {children}
            </div>
            {sortingOptions && <div className={'col-span-1 flex sm:mx-auto md:ml-auto md:mr-0'}>
                <DropDownMenu options={sortingOptions} renderLinks
                              className={'ms-auto relative'}
                              defaultOption={sortingOptions.find(option => option.value === currentSortOption)}/>
            </div>}
        </div>
        <ul className={`list-disc pl-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-full`}>
            {items.length ? items.map((item, index) =>
                renderFn(item, index + (response.meta.from ?? 0))
            ) : <h4 className={'text-xl text-center m-auto col-span-full'}>{emptyListPlaceholder}</h4>}
        </ul>
        <Pagination response={response} className={'mx-auto mt-2 text-sm'} useInertia={useInertia} onLinkClick={onLinkClick}/>
    </div>
}

const SortingOptionPropTypes = PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
    default: bool.isRequired
});

PaginatedList.propTypes = {
    children: oneOfType([arrayOf(node), node]),
    className: string,
    renderFn: func.isRequired,
    parser: func,
    sortingOptions: arrayOf(SortingOptionPropTypes),
    currentSortOption: number,
    useInertia: bool,
    onLinkClick: func,
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
