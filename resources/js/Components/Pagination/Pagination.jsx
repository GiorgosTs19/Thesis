import React from "react";
import {usePagination} from "@/Hooks/usePagination/usePagination.js";
import {array, arrayOf, bool, func, number, shape, string} from "prop-types";
import PaginationLink from "@/Components/Pagination/PaginationLink.jsx";

const STYLES = {
    BUTTON: 'text-white w-fit h-fit p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:shadow-outline-gray active:bg-gray-800 mx-1',
    CURRENT_BG: 'bg-gray-700',
    DEFAULT_BG: 'bg-gray-500',
    DISABLED: 'cursor-not-allowed opacity-50',
    DOTS: 'text-black px-2 py-2 md:px-4 md:py-3 rounded-md mx-2 md:mx-4 bg-transparent'
}

export function Pagination({response, className, useInertia = false, onLinkClick}) {
    const Meta = response.meta;
    const totalCount = Meta.total,
        pageSize = Meta.per_page,
        siblingCount = 1,
        currentPage = Meta.current_page,
        paginationRange = usePagination({
            totalCount, pageSize,
            siblingCount, currentPage
        });

    // If there are less than 2 times in pagination range we shall not render the component
    if (currentPage === 0 || paginationRange.length < 1) {
        return null;
    }

    function getUrl(label) {
        let returnLink = "";
        Meta.links.forEach((link) => {
            if (link.label === label) {
                returnLink = link.url;
            }
        })
        return returnLink;
    }

    return (
        response.meta.links.length > 3 && (
            <nav aria-label="Page navigation" className={className}>
                <div className={"flex"}>
                    {
                        paginationRange.map((link, index) => <PaginationLink key={link === '...' ? `dots${index}` : link} index={index} link={link} url={getUrl(link.toString())}
                                                                             className={[link === currentPage ? STYLES.CURRENT_BG : STYLES.DEFAULT_BG, (link === '...' ? `${STYLES.DISABLED} ${STYLES.DOTS}` : STYLES.BUTTON)].join(' ')} useInertia={useInertia}
                                                                             onClick={onLinkClick}/>
                        )
                    }
                </div>
                <h6 className={'text-center mt-4'}>Showing {Meta.from} - {Meta.to} of {Meta.total}</h6>
            </nav>
        )
    );
}

Pagination.propTypes = {
    response: shape({
        data: array.isRequired,
        meta: shape({
            current_page: number,
            from: number,
            last_page: number,
            per_page: number.isRequired,
            path: string.isRequired,
            to: number,
            total: number.isRequired,
            links: arrayOf(shape({
                url: string,
                label: string.isRequired,
                active: bool.isRequired
            })),
        })
    }),
    className: string,
    useInertia: bool,
    onLinkClick: func
}

