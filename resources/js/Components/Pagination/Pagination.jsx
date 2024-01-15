import {Link} from "@inertiajs/inertia-react";
import React from "react";
import {usePagination} from "@/Hooks/usePagination/usePagination.js";
import {STYLES} from "@/Hooks/usePagination/Styles.js";

export function Pagination({ response, className }) {
    const OrderLinks = response.links,
        Meta = response.meta;
    // console.log("Links",Meta)
    const totalCount = Meta.total,
        pageSize = Meta.per_page,
        siblingCount = 1,
        currentPage = Meta.current_page,
        paginationRange = usePagination({totalCount,pageSize,
            siblingCount,currentPage});


    // If there are less than 2 times in pagination range we shall not render the component
    if (currentPage === 0 || paginationRange.length < 1) {
        return null;
    }

    function getUrl(label) {
        let returnlink = "";
        Meta.links.forEach((link)=> {
            if(link.label === label){
                returnlink = link.url;
            }
        })
        return returnlink;
    }
    return (
        response.meta.links.length > 3 && (
            <nav aria-label="Page navigation" className={className}>
                <div className={"flex"}>
                    {
                        paginationRange.map((link, index) => <Link className={[link === currentPage  ? STYLES.CURRENT_BG : STYLES.DEFAULT_BG, (link === '...' ? `${STYLES.DISABLED} ${STYLES.DOTS}` : STYLES.BUTTON)].join(' ')}
                            key={link === '...' ? `dots${index}` : link} href={getUrl(link.toString())} preserveState={true}>
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
{/*<li key={'first'} className={"page-item w-auto " + (currentPage === 1 ? ' disabled' : '')}>*/}
{/*    <Link className={'page-link '} href={Meta.links[0].url} preserveState={true}>*/}
{/*         &laquo;*/}
{/*        /!*Prev*!/*/}
{/*    </Link>*/}
{/*</li>*/}

{/*<li key={'next'} className={"page-item " + (currentPage === Meta.last_page ? ' disabled' : '')}>*/}
{/*    <Link className={'page-link'} href={ Meta.links[Meta.links.length-1].url} preserveState={true}>*/}
{/*       /!*Next*!/*/}
{/*        &raquo;*/}
{/*    </Link>*/}
{/*</li>*/}
