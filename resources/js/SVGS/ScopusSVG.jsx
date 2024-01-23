import React from "react";
import {func, number, string} from "prop-types";

export const ScopusSVG = ({className,width=24,height=24,onClick=()=>{},rotate='', cursor='default'}) => {
    return (
        <svg height={height} viewBox="0 0 24 24" width={width}
             xmlns="http://www.w3.org/2000/svg"
             style={{cursor,rotate}}
             className={className}
             onClick={onClick}>
            <path
                d="m24 19.059-.14-1.777c-1.426.772-2.945 1.076-4.465 1.076-3.319 0-5.96-2.782-5.96-6.475 0-3.903 2.595-6.31 5.633-6.31 1.917 0 3.39.303 4.792 1.075l.14-1.753c-1.286-.608-2.337-.889-4.698-.889-4.534 0-7.97 3.53-7.97 8.017 0 5.12 4.09 7.924 7.9 7.924 1.916 0 3.506-.257 4.768-.888zm-14.954-3.46c0-2.22-1.964-3.225-3.857-4.347-1.473-.888-3.039-1.496-3.039-3.132 0-1.215.889-2.548 2.642-2.548 1.519 0 2.57.234 3.903 1.029l.117-1.847c-1.239-.514-2.127-.748-4.137-.748-2.875 0-4.628 1.87-4.628 4.254s2.103 3.413 4.02 4.581c1.426.865 2.922 1.45 2.922 2.992 0 1.496-1.333 2.571-2.922 2.571-1.566 0-2.594-.35-3.786-1.075l-.281 1.847c1.215.56 2.454.818 4.16.818 2.385 0 4.885-1.473 4.885-4.395z"/>
        </svg>
    )
}

ScopusSVG.propTypes = {
    className: string,
    width: number,
    height: number,
    onClick: func,
    rotate: string,
    cursor: string
}
