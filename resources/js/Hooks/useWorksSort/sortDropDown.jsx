import React, {useMemo, useState} from "react";
import DropDownMenu from "@/Components/DropDownMenu/DropDownMenu.jsx";


const SORTING_OPTIONS = {
    A_TO_Z:{name:'Alphabetically ( A to Z )',value:0},
    Z_TO_A:{name:'Alphabetically ( Z to A )', value:1},
    EARLIEST_PUBLISHED:{name:'Oldest', value:2},
    LATEST_PUBLISHED:{name:'Newest', value:3},
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

const useSortDropDown = (sortingOptions) => {


    const sortingDropDown =
    return sortingDropDown;
}
export default useSortDropDown;
