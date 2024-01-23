import React from "react";
import {func, number, string} from "prop-types";

export const NewUserSVG = ({className,width=24,height=24,onClick=()=>{},rotate='', cursor='default'}) => {
    return (
        <svg height={height} viewBox="0 0 64.000000 64.000000" width={width}
             xmlns="http://www.w3.org/2000/svg"
             style={{cursor,rotate}}
             className={className}
             onClick={onClick} preserveAspectRatio="xMidYMid meet">
            <g transform="translate(0.000000,64.000000) scale(0.100000,-0.100000)"
               fill="#000000" stroke="none">
                <path d="M200 568 c-66 -34 -93 -79 -88 -149 7 -94 66 -149 161 -149 89 0 167
                    93 152 181 -12 72 -91 139 -165 139 -9 0 -36 -10 -60 -22z m141 -67 c49 -50
                    36 -133 -26 -166 -63 -35 -140 4 -152 78 -15 97 108 158 178 88z"/>
                <path d="M521 316 c-29 -30 -36 -33 -48 -21 -17 17 -43 9 -43 -14 0 -10 13
                    -30 30 -46 29 -28 30 -28 51 -9 12 10 35 36 51 57 25 31 28 40 18 52 -17 21
                    -22 19 -59 -19z"/>
                <path d="M101 184 c-39 -33 -60 -100 -37 -122 12 -13 18 -13 30 -2 9 7 16 22
                    16 34 0 13 10 32 23 44 21 20 34 22 135 22 123 0 144 -9 158 -67 8 -32 21 -43
                    41 -36 31 12 5 94 -43 132 -24 19 -40 21 -160 21 -128 0 -134 -1 -163 -26z"/>
            </g>
        </svg>
    )
}

NewUserSVG.propTypes = {
    className: string,
    width: number,
    height: number,
    onClick: func,
    rotate: string,
    cursor: string
}
