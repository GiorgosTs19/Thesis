import { Card, Spinner } from 'flowbite-react';
import PaginatedList from '@/Components/PaginatedList/PaginatedList.jsx';
import { renderWorkItem } from '@/Models/Work/Utils.jsx';
import { Work } from '@/Models/Work/Work.js';
import React from 'react';
import { useWindowSize } from '@uidotdev/usehooks';
import { bool, func, node, number, object } from 'prop-types';

const ExpandedGroupInfo = ({ visibleWidth = 1100, charts, button, loading, groupWorks, handleLinkClick }) => {
    const { width } = useWindowSize();
    return (
        width > visibleWidth && (
            <>
                {charts}
                <div className={'flex min-h-96 flex-col gap-10 lg:flex-row'}>
                    <Card className={`flex w-full`}>
                        {button}
                        {!loading ? (
                            <PaginatedList
                                response={groupWorks}
                                renderFn={renderWorkItem}
                                parser={Work.parseResponseWork}
                                emptyListPlaceholder={'This list is empty'}
                                onLinkClick={handleLinkClick}
                                title={`Group Works ( ${groupWorks?.meta?.total ?? 0} )`}
                                gap={6}
                                // sortingOptions={parsedCustomTypes}
                            ></PaginatedList>
                        ) : (
                            <div className={'m-auto'}>
                                <Spinner size="xl" />
                            </div>
                        )}
                    </Card>
                </div>
            </>
        )
    );
};

ExpandedGroupInfo.propTypes = {
    visibleWidth: number,
    charts: node,
    button: node,
    loading: bool,
    groupWorks: object,
    handleLinkClick: func,
};
export default ExpandedGroupInfo;
