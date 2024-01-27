import React from "react";
import {arrayOf, instanceOf, number, oneOfType, shape, string} from "prop-types";
import {User} from "@/Models/User/User.js";

export const UserItem = ({user, index}) => {
    const {
        firstName,
        lastName,
        localUrl
    } = user;

    const name = `${firstName} ${lastName}`
    const extraProperties = user.getProperties();

    return <li className="mb-4 flex-grow list-none flex">
        <div className="top-0 left-0 text-black text-sm text-center mr-2">
            {index + 1}
        </div>
        <div className={'flex flex-col'}>
            <div className={'flex flex-wrap border-l-2 border-l-blue-700'}>
                <div className="text-gray-600 pl-3 text-xs lg:text-sm">
                    Registered User
                </div>
                {
                    extraProperties.map((property, index) =>
                        <div key={index} className="text-gray-600 pl-3 text-xs lg:text-sm">
                            {property.name} : {property.value}
                        </div>
                    )
                }
            </div>
            <div className={'pl-3'}>
                <a href={localUrl} className="text-black text-sm
                    font-bold truncate whitespace-pre-wrap hover:underline">
                    {name}
                </a>
            </div>
        </div>
    </li>
}

UserItem.propTypes = {
    user: instanceOf(User),
    index: number.isRequired,
    extraProperties: arrayOf(shape({
        name: string,
        value: oneOfType([number, string])
    }))
}
