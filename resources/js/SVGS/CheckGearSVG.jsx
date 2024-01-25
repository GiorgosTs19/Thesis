import {func, number, string} from "prop-types";
import React from "react";

export const CheckGearSVG = ({
                                 className, width = 24, height = 24, onClick = () => {
    }, rotate = '', cursor = ''
                             }) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 64.000000 64.000000"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{cursor: cursor, rotate: rotate}}
            className={className}
            onClick={onClick}
        >
            <g transform="translate(0.000000,64.000000) scale(0.100000,-0.100000)"
               fill="#000000" stroke="none">
                <path d="M267 584 c-4 -4 -7 -17 -7 -30 0 -17 -7 -23 -33 -28 -43 -8 -82 -35
                    -69 -48 6 -6 22 -4 43 8 20 10 58 18 90 18 46 1 65 -5 104 -29 70 -43 98 -99
                    93 -187 -3 -56 -8 -73 -34 -105 -16 -21 -53 -49 -81 -63 -59 -28 -72 -56 -22
                    -45 23 5 34 3 43 -10 7 -10 21 -15 32 -13 15 3 18 11 16 39 -3 47 26 76 58 59
                    18 -10 25 -9 38 4 14 14 14 18 -7 39 -31 33 -21 73 21 81 24 5 29 10 26 28 -2
                    16 -11 24 -29 26 -37 4 -49 56 -18 81 31 25 16 55 -24 47 -44 -9 -69 17 -61
                    61 8 43 -20 58 -47 25 -25 -31 -77 -21 -81 17 -3 26 -35 41 -51 25z"/>
                <path d="M80 400 c-24 -47 -26 -70 -5 -70 8 0 15 6 15 13 0 7 8 29 19 49 18
                    36 18 48 0 48 -5 0 -18 -18 -29 -40z"/>
                <path d="M305 320 c-74 -75 -80 -79 -97 -63 -28 25 -34 6 -8 -22 l24 -26 88
                    88 c48 48 88 91 88 95 0 19 -20 3 -95 -72z"/>
                <path d="M60 258 c0 -7 9 -33 21 -57 14 -32 23 -41 31 -33 8 8 5 23 -8 56 -18
                    42 -44 63 -44 34z"/>
                <path d="M156 132 c-13 -13 -4 -24 37 -42 49 -23 67 -25 67 -7 0 13 -95 59
                    -104 49z"/>
            </g>
        </svg>
    )
}

CheckGearSVG.propTypes = {
    className: string,
    width: number,
    height: number,
    onClick: func,
    rotate: string,
    cursor: string
}
