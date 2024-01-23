import React from "react";
import {func, number, string} from "prop-types";

export const OrcidSVG = ({className,width=24,height=24,onClick=()=>{},rotate='', cursor='default'}) => {
    return (
        <svg height={height} viewBox="0 0 512 512" width={width}
             xmlns="http://www.w3.org/2000/svg"
             style={{cursor,rotate}}
             className={className}
             onClick={onClick}>
            <rect fill="#fff" height="512" rx="15%" width="512"/>
            <circle cx="256" cy="256" fill="#a6ce39" r="256"/>
            <path
                d="m173 372h-31v-214h31zm45-214h83c79 0 114 57 114 107 0 55-43 107-114 107h-84zm31 187h49c70 0 86-53 86-79 0-43-27-79-87-79h-47zm-71-231c0 11-9 20-20 20s-20-9-20-20a20 20 0 0 1 20-20c11 0 20 9 20 20z"
                fill="#fff"/>
        </svg>
    )
}

OrcidSVG.propTypes = {
    className: string,
    width: number,
    height: number,
    onClick: func,
    rotate: string,
    cursor: string
}
