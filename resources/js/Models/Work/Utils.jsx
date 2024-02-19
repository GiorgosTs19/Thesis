import {WorkItem} from "@/Components/Assets/WorkItem/WorkItem.jsx";
import React from "react";

export function renderWorkItem(work, index, hideProperties = {authors: false, publicationDate: false, oa: false, type: false, citations: false, language: false}, highlight = {authors: false}) {
    return work.title.length > 0 &&
        <WorkItem work={work} key={work.doi} index={index} hideAuthors={hideProperties.authors} hideOA={hideProperties.oa} hideCitations={hideProperties.citations}
                  hideLanguage={hideProperties.language} hideType={hideProperties.type} hidePublicationDate={hideProperties.publicationDate} highlightUserAuthors={highlight.authors}/>
}
