import React from "react";
import {UserItem} from "@/Components/Assets/UserItem/UserItem.jsx";

export function renderUserItem(author, index) {
    return <UserItem key={index} author={author} index={index}/>
}
