import {Link} from "@inertiajs/inertia-react";
import React from "react";
import {usePagination} from "@/Hooks/usePagination/usePagination.js";
import {STYLES} from "@/Components/Pagination/Styles.js";
import {array, arrayOf, bool, number, shape, string} from "prop-types";

export function Pagination({response, className}) {
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
                        paginationRange.map((link, index) => <Link
                                className={[link === currentPage ? STYLES.CURRENT_BG : STYLES.DEFAULT_BG, (link === '...' ? `${STYLES.DISABLED} ${STYLES.DOTS}` : STYLES.BUTTON)].join(' ')}
                                key={link === '...' ? `dots${index}` : link} href={getUrl(link.toString())}
                                preserveState={true}>
                                {link}
                            </Link>
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
        links: shape({
            first: string.isRequired,
            last: string.isRequired,
            prev: string,
            next: string,
        }),
        meta: shape({
            current_page: number,
            from: number,
            last_page: number,
            per_page: number.isRequired,
            path: string.isRequired,
            to: number.isRequired,
            total: number.isRequired,
            links: arrayOf(shape({
                url: string,
                label: string.isRequired,
                active: bool.isRequired
            })),
        })
    }),
    className: string
}

