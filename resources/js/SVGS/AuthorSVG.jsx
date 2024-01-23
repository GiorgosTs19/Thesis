import React from "react";
import {func, number, string} from "prop-types";

export const AuthorSVG = ({className,width=24,height=24,onClick=()=>{},rotate='', cursor='default'}) => {
    return (
        <svg height={height}  viewBox="0 0 64.000000 64.000000" width={width}
             xmlns="http://www.w3.org/2000/svg"
             style={{cursor,rotate}}
             className={className}
             onClick={onClick}  preserveAspectRatio="xMidYMid meet">
            <g transform="translate(0.000000,64.000000) scale(0.100000,-0.100000)"
               fill="#000000" stroke="none">
                <path d="M614 609 c-11 -18 -87 -49 -122 -49 -19 0 -39 -8 -49 -19 -16 -19
                    -39 -19 -28 0 4 5 -9 10 -27 10 -57 2 -73 -2 -87 -22 -18 -25 -34 -24 -26 2 6
                    18 4 20 -17 14 -60 -18 -72 -30 -89 -84 -17 -57 -36 -56 -23 2 6 28 5 30 -10
                    18 -8 -7 -25 -29 -37 -47 -17 -28 -19 -39 -10 -64 10 -31 4 -39 -17 -18 -13
                    13 -17 -14 -12 -82 4 -63 14 -63 44 1 44 91 95 130 229 175 62 20 129 45 149
                    55 43 22 48 23 48 8 0 -13 -78 -47 -204 -89 -85 -28 -107 -40 -147 -80 -30
                    -30 -54 -66 -65 -99 -12 -31 -24 -50 -32 -48 -19 3 -69 -88 -78 -140 l-7 -43
                    67 0 c37 0 66 4 66 10 0 6 -21 10 -47 10 l-46 0 21 23 c12 13 22 36 22 53 0
                    64 6 69 68 66 45 -2 64 2 92 20 l35 22 -39 6 c-57 7 -59 29 -2 23 38 -5 48 -2
                    70 20 32 32 33 45 4 49 -35 5 -24 23 11 20 42 -5 153 61 144 85 -5 13 -2 15
                    17 10 47 -12 128 78 145 161 7 32 2 42 -11 21z m-564 -529 c-18 -33 -25 -15
                    -9 22 9 23 15 28 17 16 2 -9 -2 -27 -8 -38z"/>
                <path d="M155 20 c8 -14 365 -14 365 0 0 6 -69 10 -186 10 -121 0 -183 -3
-179 -10z"/>
            </g>
        </svg>
    )
}

AuthorSVG.propTypes = {
    className: string,
    width: number,
    height: number,
    onClick: func,
    rotate: string,
    cursor: string
}
