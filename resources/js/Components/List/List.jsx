import React from 'react';
import {array, bool, func, string} from "prop-types";

/**
 * PaginatedList Component.
 * A component for rendering a paginated list with optional parsing of data items.
 *
 * @component
 * @param data - The data to be displayed.
 * @param title - An optional title to display above the list.
 * @param renderFn - A function to render each item in the list.
 * @param parser - Optional function to parse each item in the response data.
 * @param vertical - Whether the list should be vertical or not.
 * @param wrapperClassName - Classes to apply to the list's wrapper element.
 * @param listClassName - Classes to apply to the list element.
 * @param header - An optional header to display above the list.
 * @param footer - An optional footer to display below the list.
 * @param emptyListPlaceholder - An optional placeholder to show if the list of items to render is empty.
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
const List = ({
                  data,
                  title,
                  renderFn,
                  parser,
                  vertical = false,
                  wrapperClassName = '',
                  listClassName = '',
                  header,
                  footer,
                  emptyListPlaceholder = 'The list is empty'
              }) => {
    const items = parser ? data.map(parser) : data;

    return <div className={`rounded-lg bg-gray-200 p-4 flex flex-col ${wrapperClassName}`}>
        <div className={`${header ? 'mb-2' : 'mb-6'} md:text-lg font-semibold text-yellow-800 w-fit`}>
            {title}
        </div>
        {header && <div className={'text-gray-500 text-sm mb-3'}>
            {header}
        </div>}
        {items.length ? <ul
            className={`list-disc pl-2 gap-8 ${listClassName} ${vertical ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 '}`}>
            {items.map((item, index) =>
                renderFn(item, index)
            )}
        </ul> : <h4 className={'text-xl m-auto'}>{emptyListPlaceholder}</h4>}
        {footer && <div className={'text-gray-500 text-sm mt-2'}>
            {footer}
        </div>}
    </div>
}

List.propTypes = {
    title: string,
    header: string,
    footer: string,
    renderFn: func.isRequired,
    parser: func,
    data: array.isRequired,
    vertical: bool,
    wrapperClassName: string,
    listClassName: string,
    emptyListPlaceholder: string,
}
export default List;
