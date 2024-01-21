import {WorkItem} from "@/Components/Assets/WorkItem/WorkItem.jsx";
import React from "react";

export function renderWorkItem(work, index) {
    return work.title.length > 0 &&
        <WorkItem work={work} key={work.doi} index={index + 1}/>
}
