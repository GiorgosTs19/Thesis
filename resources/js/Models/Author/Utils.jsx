import React from "react";
import {AuthorItem} from "@/Components/Assets/AuthorItem/AuthorItem.jsx";

export function renderAuthorItem(author, index) {
    return <AuthorItem key={index} author={author} index={index}/>
}
