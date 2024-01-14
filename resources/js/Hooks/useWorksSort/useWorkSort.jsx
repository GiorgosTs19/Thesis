import React, {useMemo, useState} from "react";
import DropDownMenu from "@/Components/DropDownMenu/DropDownMenu.jsx";


const SORTING_OPTIONS = {
    A_TO_Z:{name:'Alphabetically ( A to Z )',value:0},
    Z_TO_A:{name:'Alphabetically ( Z to A )', value:1},
    EARLIEST_PUBLISHED:{name:'Earliest Published', value:2},
    LATEST_PUBLISHED:{name:'Latest Published', value:3},
    LOWEST_CITATIONS:{name:'Lowest Citations', value:4},
    HIGHEST_CITATIONS:{name:'Highest Citations', value:5},
    MOST_AUTHORS:{name:'Most Authors', value:6},
}

/**
 * A custom hook for sorting an array of works based on various criteria.
 *
 * @param {Array} works - An array of works to be sorted.
 * @returns {Array} An array containing the sorted works and a sorting dropdown JSX element.
 * @property {Array} [0] - The sorted array of works based on the selected sorting criteria.
 * @property {JSX.Element} [1] sortingDropDown - The sorting dropdown JSX element.
 * @property {function} [1] onSelect - Callback function to handle sorting criteria selection.
 * @property {string} [1] className - Additional class name for styling the sorting dropdown.
 * @property {string} [1] label - Label text for the sorting dropdown.
 * @property {Object} [1] defaultOption - Default sorting option for the dropdown.
 *
 * @example
 * const works = [...]; // array of works
 * const [sortedWorks, sortingDropDown] = useWorkSort(works);
 *
 * // In your JSX:
 * <div>
 *   {sortingDropDown}
 *   {Render your sorted works here using 'sortedWorks' }
 * </div>
 */

const useWorkSort = (works) => {
    const [sortingCriteria,setSortingCriteria] = useState(SORTING_OPTIONS.A_TO_Z.value);

    const sortedWorks = useMemo(() => {
        const titleSorting = (a, b) => {
            const titleA = a.title.toUpperCase();
            const titleB = b.title.toUpperCase();
            return titleA.localeCompare(titleB);
        };

        const publicationDateSorting = (a, b) => {
            const dateA = new Date(a.publishedAt.split("-").reverse().join("-"));
            const dateB = new Date(b.publishedAt.split("-").reverse().join("-"));
            return dateA - dateB;
        };

        const citedCountSorting = (a, b) => a.referencedWorksCount - b.referencedWorksCount;

        const authorsCountSorting = (a, b) => a.authors.length - b.authors.length;

        switch (sortingCriteria) {
            case 0:
                return [...works].sort(titleSorting);
            case 1:
                return [...works].sort((a, b) => -titleSorting(a, b));
            case 2:
                return [...works].sort(publicationDateSorting);
            case 3:
                return [...works].sort((a, b) => -publicationDateSorting(a, b));
            case 4:
                return [...works].sort(citedCountSorting);
            case 5:
                return [...works].sort((a, b) => -citedCountSorting(a, b));
            case 6:
                return [...works].sort((a, b) => -authorsCountSorting(a, b));
            default:
                return [...works];
        }
    }, [sortingCriteria, works]);

    const sortingDropDown = <DropDownMenu options={SORTING_OPTIONS} onSelect={(value)=>setSortingCriteria(value)}
                                          className={'ms-auto'} label={'Sort by'} defaultOption={SORTING_OPTIONS.A_TO_Z}/>
    return [sortedWorks, sortingDropDown];
}
export default useWorkSort;
