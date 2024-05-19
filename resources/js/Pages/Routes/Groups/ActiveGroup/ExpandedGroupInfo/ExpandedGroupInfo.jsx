import { Button, Card } from 'flowbite-react';
import PaginatedList from '@/Components/PaginatedList/PaginatedList.jsx';
import { renderWorkItem } from '@/Models/Work/Utils.jsx';
import { Work } from '@/Models/Work/Work.js';
import React, { useState } from 'react';
import { useWindowSize } from '@uidotdev/usehooks';
import { array, arrayOf, bool, func, node, number, object, oneOfType, shape, string } from 'prop-types';
import Filters from '@/Components/Filters/Filters.jsx';
import List from '@/Components/List/List.jsx';
import { Author } from '@/Models/Author/Author.js';
import OffCanvas from '@/Components/OffCanvas/OffCanvas.jsx';
import AddGroupMembers from '@/Components/Search/AdminSearch/AddGroupMembers.jsx';
import { useAuth } from '@/Hooks/useAuth/useAuth.jsx';

const ExpandedGroupInfo = ({ visibleWidth = 1100, charts, loading, groupWorks, handleLinkClick, dispatch, filtersHaveChanged, filters, group, renderAuthorItem }) => {
    const { width } = useWindowSize();
    const [authorsOpen, setAuthorsOpen] = useState(false);
    const handleDrawerOpen = () => setAuthorsOpen(true);
    const handleDrawerClose = () => setAuthorsOpen(false);
    const { isAdmin } = useAuth();

    return (
        width > visibleWidth && (
            <>
                <div className={'mx-auto my-3 flex gap-5'}>
                    <Button onClick={handleDrawerOpen} size={'sm'} color={'gray'}>
                        Group Members
                    </Button>
                    {isAdmin && <AddGroupMembers group={group} />}
                </div>
                {charts}
                <OffCanvas isOpen={authorsOpen} position={'right'} onClose={handleDrawerClose} header={'Group Members'} clickAwayClosable canvasWidth={400}>
                    <List
                        data={group.members}
                        renderFn={renderAuthorItem}
                        wrapperClassName={'w-full'}
                        vertical={width >= 1280}
                        title={`Group Members ${group.members.length ? ` ( ${group.members.length} )` : 0}`}
                        parser={Author.parseResponseAuthor}
                        emptyListPlaceholder={'This group has no members'}
                    ></List>
                </OffCanvas>
                <div className={'flex min-h-96 flex-col gap-10 lg:flex-row'}>
                    <Card className={`flex w-full`}>
                        <Filters dispatch={dispatch} filtersHaveChanged={filtersHaveChanged} filters={filters} authors={group.members} />
                        <PaginatedList
                            response={groupWorks}
                            renderFn={renderWorkItem}
                            parser={Work.parseResponseWork}
                            emptyListPlaceholder={'This list is empty'}
                            onLinkClick={handleLinkClick}
                            title={`Group Works`}
                            gap={6}
                            loading={loading}
                            perPage={filters.per_page ?? 10}
                        ></PaginatedList>
                    </Card>
                </div>
            </>
        )
    );
};

ExpandedGroupInfo.propTypes = {
    visibleWidth: number,
    charts: node,
    loading: bool,
    groupWorks: object,
    handleLinkClick: func,
    dispatch: func.isRequired,
    filtersHaveChanged: bool.isRequired,
    filters: shape({
        author_ids: arrayOf(number),
        sources: arrayOf(string),
        type_filters: string,
        min_citations: oneOfType([string, number]),
        max_citations: oneOfType([string, number]),
        from_pub_year: oneOfType([string, number]),
        to_year_pub: oneOfType([string, number]),
    }).isRequired,
    group: shape({
        members: array.isRequired,
    }).isRequired,
    renderAuthorItem: func.isRequired,
};
export default ExpandedGroupInfo;
