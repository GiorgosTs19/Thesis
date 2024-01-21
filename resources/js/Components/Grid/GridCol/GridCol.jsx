import React from 'react'
import {arrayOf, node, number, oneOfType, string} from "prop-types";
import clsx from "clsx";

const GridCol = ({cols, sm, md, lg, xl, xxl, className, children}) => {
    return <div
        className={clsx(cols ? `col-span-${cols}` : '', sm ? `sm:col-span-${sm}` : '', md ? `md:col-span-${md}` : '', lg ? `lg:col-span-${lg}` : '', xl ? `xl:col-span-${xl}` : '', xxl ? `2xl:col-span-${xxl}` : '', className)}>
        {children}
    </div>
}

export default GridCol;

GridCol.propTypes = {
    cols: number,
    sm: number,
    md: number,
    lg: number,
    xl: number,
    xxl: number,
    className: string,
    children: oneOfType([arrayOf(node), node])
}
