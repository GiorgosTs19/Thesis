import React from "react";
import {number, string} from "prop-types";

export function BookmarkSVG({className, width = 24, height = 24}) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="-5 -5 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={{stroke: 'currentColor', strokeWidth: '0.2px'}}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19 20H17.1717L12.7072 15.5354C12.3166 15.1449 11.6835 15.1449 11.2929 15.5354L6.82843 20L5 20V7C5 5.34315 6.34315 4 8 4H16C17.6569 4 19 5.34314 19 7V20ZM17 7C17 6.44772 16.5523 6 16 6H8C7.44772 6 7 6.44772 7 7V17L9.87873 14.1212C11.0503 12.9497 12.9498 12.9497 14.1214 14.1212L17 16.9999V7Z"
                fill="currentColor"
            />
        </svg>
    )
}

BookmarkSVG.propTypes = {
    className: string,
    width: number,
    height: number,
}
