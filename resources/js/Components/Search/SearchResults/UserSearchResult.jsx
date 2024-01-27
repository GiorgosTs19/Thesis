import React from "react";
import {instanceOf, string} from "prop-types";
import {highlightMatchingCharacters} from "@/Components/Search/Utils/Utils.jsx";
import {ChevronRightSVG} from "@/SVGS/ChevronRightSVG.jsx";
import {User} from "@/Models/User/User.js";

const styles = {
    li: 'flex-grow list-none flex justify-between hover:bg-gray-100 p-2 rounded-lg cursor-pointer',
    a: 'flex flex-col',
    properties: 'flex flex-wrap border-l-2 border-l-blue-700',
    property: 'text-gray-600 pl-3 text-xs lg:text-sm',
    name: 'pl-3 text-black font-bold truncate whitespace-pre-wrap hover:underline text-sm lg:text-lg'
}
export const UserSearchResult = ({user, query}) => {
    const {
        firstName,
        lastName,
        localUrl
    } = user;

    const name = `${firstName} ${lastName}`
    const extraProperties = user.getProperties();

    return <li
        className={styles.li}>
        <a className={styles.a} href={localUrl}>
            <div className={styles.properties}>
                {
                    extraProperties.map((property, index) =>
                        <div key={index} className={styles.property}>
                            {property.name} : {highlightMatchingCharacters(property.value, query)}
                        </div>
                    )
                }
            </div>
            <div
                className={styles.name}>
                {highlightMatchingCharacters(name, query)}
            </div>
        </a>
        <div>
            <ChevronRightSVG/>
        </div>
    </li>
}

UserSearchResult.propTypes = {
    user: instanceOf(User).isRequired,
    query: string.isRequired,
}
