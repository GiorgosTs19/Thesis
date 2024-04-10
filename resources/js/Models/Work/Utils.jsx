import { WorkItem } from '@/Components/Assets/WorkItem/WorkItem.jsx';
import React from 'react';

export function renderWorkItem(work, index, hideProperties = {}, highlight = { authors: false }) {
    return work.title.length > 0 && <WorkItem work={work} key={work.id} index={index} hiddenProperties={hideProperties} highlightUserAuthors={highlight.authors} />;
}
