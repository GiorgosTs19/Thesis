import React from 'react';
import {Link} from "@inertiajs/inertia-react";
import {bool, func, number, oneOfType, string} from "prop-types";

const PaginationLink = ({useInertia = false, link, onClick, className, url}) => {
    return useInertia ? <Link
        className={className}
        href={url}
        preserveState preserveScroll>
        {link}
    </Link> : <button onClick={() => onClick(url)} className={className}>
        {link}
    </button>
};

PaginationLink.propTypes = {
    useInertia: bool,
    link: oneOfType([number, string]).isRequired,
    onClick: func,
    className: string,
    url: string
}
export default PaginationLink;