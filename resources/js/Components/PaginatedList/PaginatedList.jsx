import React from 'react';
import PropTypes, {array, arrayOf, bool, func, node, number, oneOfType, shape, string} from "prop-types";
import {Pagination} from "@/Components/Pagination/Pagination.jsx";
import DropDownMenu from "@/Components/DropDownMenu/DropDownMenu.jsx";

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
const PaginatedList = ({response, children, renderFn, parser, sortingOptions, currentSortOption}) => {
    const items = parser ? response.data.map(item => parser(item)) : response.data;

    return <div className="rounded-lg bg-gray-200 p-4 flex flex-col h-full">
        <div className={'grid grid-cols-1 sm:grid-cols-2 mb-6 md:mb-4'}>
            <div className={'col-span-1'}>
                {children}
            </div>
            <div className={'col-span-1 flex sm:mx-auto md:ml-auto md:mr-0'}>
                <DropDownMenu options={sortingOptions} renderLinks
                              className={'ms-auto'}
                              defaultOption={sortingOptions.find(option => option.value === currentSortOption)}/>
            </div>
        </div>
        <ul className="list-disc pl-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item, index) =>
                renderFn(item, index)
            )}
        </ul>
        <Pagination response={response} className={'mx-auto mt-2 text-sm'}/>
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
    renderFn: func.isRequired,
    parser: func,
    sortingOptions: arrayOf(SortingOptionPropTypes).isRequired,
    currentSortOption: number.isRequired,
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
            from: number.isRequired,
            last_page: number.isRequired,
            per_page: number.isRequired,
            path: string.isRequired,
            to: number.isRequired,
            total: number.isRequired,
            links: arrayOf(shape({
                url: string,
                label: string.isRequired,
                active: bool.isRequired
            })),
        })
    }).isRequired
}
export default PaginatedList;
