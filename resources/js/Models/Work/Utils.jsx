import {WorkItem} from "@/Components/Assets/WorkItem/WorkItem.jsx";
import React from "react";

export function renderWorkItem(work, index, renderAuthors = true) {
    return work.title.length > 0 &&
        <WorkItem work={work} key={work.doi} index={index + 1} shouldShowAuthors={renderAuthors}/>
}
