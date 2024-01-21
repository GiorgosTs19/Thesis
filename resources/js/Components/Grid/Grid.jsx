import React from 'react'
import {arrayOf, number, string} from "prop-types";
import GridCol from "@/Components/Grid/GridCol/GridCol.jsx";
import clsx from "clsx";

const Grid = ({cols, sm, md, lg, xl, xxl, className, children}) => {
    return <div
        className={clsx('grid', cols ? `grid-cols-${cols}` : '', sm ? `sm:grid-cols-${sm}` : '', md ? `md:grid-cols-${md}` : '',
            lg ? `lg:grid-cols-${lg}` : '', xl ? `xl:grid-cols-${xl}` : '', xxl ? `2xl:grid-cols-${xxl}` : '', className)}>
        {children}
    </div>
}

export default Grid;

Grid.propTypes = {
    cols: number,
    sm: number,
    md: number,
    lg: number,
    xl: number,
    xxl: number,
    className: string,
    children: arrayOf(GridCol)
}
