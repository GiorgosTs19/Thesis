import React from 'react';
import {array, arrayOf, bool, func, node, oneOfType, string} from "prop-types";
import clsx from "clsx";
import {themeStyles} from "@/Theme/Theme.js";

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
 * @param children - Children items passed to the list component
 * @param scrollable - Whether the list can should be scrollable when the content overflows
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
                  data, title, renderFn, parser, vertical = false, wrapperClassName = '', listClassName = '', header, footer,
                  emptyListPlaceholder = 'The list is empty', children, scrollable = true
              }) => {
    const items = parser ? data.map(parser) : data;

    return <div className={clsx(wrapperClassName, styles.wrapper, scrollable ? (vertical ? 'overflow-y-auto' : 'overflow-x-auto') : '')}>
        <div className={clsx(header ? 'mb-2' : 'mb-6', styles.title)}>
            {title}
            {children}
        </div>
        {header && <div className={styles.header}>
            {header}
        </div>}
        {items.length ?
            <ul
                className={`list-disc pl-2 gap-8 ${listClassName} ${vertical ? styles.verticalList : styles.horizontalList}`}>
                {items.map((item, index) =>
                    renderFn(item, index)
                )}
            </ul>
            : <h4 className={'text-xl m-auto'}>{emptyListPlaceholder}</h4>}
        {footer && <div className={styles.footer}>
            {footer}
        </div>}
    </div>
}

const styles = {
    wrapper: 'rounded-lg p-4 flex flex-col ',
    title: themeStyles.listTitle,
    header: 'text-gray-500 text-sm 2xl:text-base mb-3',
    verticalList: 'md:grid-cols-2 lg:grid-cols-3',
    horizontalList: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    footer: 'text-gray-500 text-sm mt-2'
}
List.propTypes = {
    title: string,
    header: string,
    footer: string,
    renderFn: func.isRequired,
    parser: func,
    data: array.isRequired,
    vertical: bool,
    scrollable: bool,
    wrapperClassName: string,
    listClassName: string,
    emptyListPlaceholder: string,
    children: oneOfType([node, arrayOf(node)])
}
export default List;
