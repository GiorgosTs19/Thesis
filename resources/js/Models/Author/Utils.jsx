import React from "react";
import {AuthorItem} from "@/Components/Assets/AuthorItem/AuthorItem.jsx";

export function renderAuthorItem(author, index, highlightProperties = {citations: false, works: false}) {
    return <AuthorItem key={index} author={author} index={index} highlightWorks={highlightProperties.works} highlightCitations={highlightProperties.citations}/>
}
