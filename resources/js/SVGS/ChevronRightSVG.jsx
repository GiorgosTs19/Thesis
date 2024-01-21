import React from "react";
import {func, number, string} from "prop-types";

export function ChevronRightSVG({
                                    className, width = 24, height = 24, onClick = () => {
    }, rotate = ''
                                }) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{cursor: "pointer", rotate: rotate}}
            className={className}
            onClick={onClick}
        >
            <path
                d="M10.5858 6.34317L12 4.92896L19.0711 12L12 19.0711L10.5858 17.6569L16.2427 12L10.5858 6.34317Z"
                fill="currentColor"
            />
        </svg>
    )
}

ChevronRightSVG.propTypes = {
    className: string,
    width: number,
    height: number,
    onClick: func,
    rotate: string,
    cursor: string
}
