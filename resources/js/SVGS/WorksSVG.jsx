import React from "react";
import {func, number, string} from "prop-types";

export const WorksSVG = ({className,width=24,height=24,onClick=()=>{},rotate='', cursor='default'}) => {
    return (
        <svg height={height}  viewBox="0 0 64.000000 64.000000" width={width}
             xmlns="http://www.w3.org/2000/svg"
             style={{cursor,rotate}}
             className={className}
             onClick={onClick}  preserveAspectRatio="xMidYMid meet">
            <g transform="translate(0.000000,64.000000) scale(0.100000,-0.100000)"
               fill="#000000" stroke="none">
                <path d="M150 625 c0 -12 30 -15 188 -17 l187 -3 0 -25 0 -25 -187 -3 c-158
                    -2 -188 -5 -188 -17 0 -13 28 -15 185 -15 172 0 186 1 205 20 11 11 20 29 20
                    40 0 11 -9 29 -20 40 -19 19 -33 20 -205 20 -157 0 -185 -2 -185 -15z"/>
                <path d="M170 580 c0 -6 63 -10 170 -10 107 0 170 4 170 10 0 6 -63 10 -170
                    10 -107 0 -170 -4 -170 -10z"/>
                <path d="M95 475 c-33 -32 -33 -78 0 -110 24 -25 26 -25 215 -25 183 0 190 1
                    190 20 0 19 -8 20 -186 22 -165 3 -188 5 -198 21 -8 12 -8 22 0 35 10 15 33
                    17 198 20 178 2 186 3 186 22 0 19 -7 20 -190 20 -189 0 -191 0 -215 -25z"/>
                <path d="M135 430 c-15 -25 13 -30 171 -30 157 0 164 1 164 20 0 19 -7 20
                    -164 20 -99 0 -167 -4 -171 -10z"/>
                <path d="M150 300 c0 -19 8 -20 188 -22 l187 -3 0 -25 c0 -24 -3 -25 -62 -28
                    -55 -3 -63 -6 -63 -22 0 -18 7 -20 63 -20 53 0 67 4 85 23 28 30 28 68 -1 95
                    -22 21 -32 22 -210 22 -180 0 -187 -1 -187 -20z"/>
                <path d="M170 250 c0 -5 20 -10 45 -10 25 0 45 5 45 10 0 6 -20 10 -45 10 -25
                    0 -45 -4 -45 -10z"/>
                <path d="M280 210 c0 -55 1 -56 30 -38 16 10 24 10 40 0 29 -18 30 -17 30 38
                    l0 50 -50 0 -50 0 0 -50z"/>
                <path d="M400 250 c0 -5 25 -10 55 -10 30 0 55 5 55 10 0 6 -25 10 -55 10 -30
                    0 -55 -4 -55 -10z"/>
                <path d="M150 200 c0 -18 7 -20 55 -20 48 0 55 2 55 20 0 18 -7 20 -55 20 -48
                    0 -55 -2 -55 -20z"/>
                <path d="M95 135 c-33 -32 -33 -78 0 -110 24 -25 26 -25 215 -25 183 0 190 1
                    190 20 0 19 -8 20 -186 22 -165 3 -188 5 -198 21 -8 12 -8 22 0 35 10 15 33
                    17 198 20 178 2 186 3 186 22 0 17 -7 20 -45 20 -25 0 -54 -6 -65 -12 -16 -10
                    -24 -10 -40 0 -16 10 -24 10 -40 0 -16 -10 -24 -10 -40 0 -11 6 -49 12 -85 12
                    -57 0 -69 -3 -90 -25z"/>
                <path d="M135 90 c-15 -25 13 -30 171 -30 157 0 164 1 164 20 0 19 -7 20 -164
                    20 -99 0 -167 -4 -171 -10z"/>
            </g>
        </svg>
    )
}

WorksSVG.propTypes = {
    className: string,
    width: number,
    height: number,
    onClick: func,
    rotate: string,
    cursor: string
}
