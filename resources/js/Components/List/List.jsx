import React from 'react';
import {array, arrayOf, func, node, oneOfType} from "prop-types";

/**
 * PaginatedList Component.
 * A component for rendering a paginated list with optional parsing of data items.
 *
 * @component
 * @param response - The paginated data response object.
 * @param children - Optional children to be rendered above the list.
 * @param renderFunc - A function to render each item in the list.
 * @param parser - Optional function to parse each item in the response data.
 * @returns The PaginatedList component.
 *
 * @example
 * With children:
 * <List data={data} renderFunc={()=>{}}>
 *     {children}
 * </List>
 *
 * Without children:
 * <List data={data} renderFunc={()=>{}}/>
 *
 * With Parser :
 * <List data={data} renderFunc={()=>{}} parser={()=>{}}/>
 */
const List = ({data, children, renderFn, parser}) => {
    const items = parser ? data.map(item => parser(item)) : data;

    return <div className="">
        <div className="rounded-lg bg-gray-200 p-4 flex flex-col">
            <div className={'grid grid-cols-1 sm:grid-cols-2 mb-6 md:mb-4'}>
                <div className={'col-span-1'}>
                    {children}
                </div>
            </div>
            <ul className="list-disc pl-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item, index) =>
                    renderFn(item, index)
                )}
            </ul>
        </div>
    </div>
}

List.propTypes = {
    children: oneOfType([arrayOf(node), node]),
    renderFn: func.isRequired,
    parser: func,
    data: array.isRequired
}
export default List;
