import { Button, Spinner, Tabs } from 'flowbite-react';
import { HiUserCircle } from 'react-icons/hi';
import { MdDashboard } from 'react-icons/md';
import { VscGroupByRefType } from 'react-icons/vsc';
import List from '@/Components/List/List.jsx';
import { Author } from '@/Models/Author/Author.js';
import GroupItem from '@/Components/Assets/GroupItem/GroupItem.jsx';
import React, { useState } from 'react';
import { useClickAway, useWindowSize } from '@uidotdev/usehooks';
import { AiOutlineClose } from 'react-icons/ai';
import Drawer from '@mui/material/Drawer';
import { array, arrayOf, bool, func, number, object, oneOfType, shape, string } from 'prop-types';
import Filters from '@/Components/Filters/Filters.jsx';
import { CiFilter } from 'react-icons/ci';
import PaginatedList from '@/Components/PaginatedList/PaginatedList.jsx';
import { renderWorkItem } from '@/Models/Work/Utils.jsx';
import { Work } from '@/Models/Work/Work.js';

const CompactGroupInfo = ({ visibleWidth = 1100, group, groupWorks, charts, loading, setSelectedGroup, styles, handleLinkClick, dispatch, filtersHaveChanged, filters, members, renderAuthorItem }) => {
    const { width } = useWindowSize();
    const [canvasOpen, setCanvasOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [showFilters, setShowFilters] = useState(false);
    const handleShowFilters = () => setShowFilters(true);
    const handleHideFilters = () => setShowFilters(false);

    const handleOpenOffCanvas = () => {
        setCanvasOpen(true);
    };

    // Handles the closing of the off-canvas
    const handleOnClose = () => {
        setCanvasOpen(false);
    };

    const drawerRef = useClickAway(() => {
        handleOnClose();
    });

    const worksList =
        !loading && groupWorks ? (
            <>
                <Button className={'mx-auto my-3'} onClick={handleShowFilters} color={'gray'}>
                    <CiFilter className={'mx-auto'} />
                    Filters
                </Button>
                <PaginatedList
                    response={groupWorks}
                    title={`Group Works`}
                    renderFn={renderWorkItem}
                    emptyListPlaceholder={'This list is empty'}
                    parser={Work.parseResponseWork}
                    onLinkClick={handleLinkClick}
                    className={'mt-auto w-full'}
                >
                    <div className={styles.listTitle}>{`Group Works ( ${groupWorks?.meta?.total} )`}</div>
                </PaginatedList>
            </>
        ) : (
            <div className={'flex w-screen'}>
                <Spinner size="xl" className={'mx-auto'} />
            </div>
        );

    return (
        width <= visibleWidth && (
            <div className={'flex flex-col gap-5'}>
                <Button color="gray" onClick={handleOpenOffCanvas} className={'flex-grow text-nowrap'}>
                    {`Authors, Works${group.children.length ? ', Subgroups' : ''}`}
                </Button>
                {charts}
                <Drawer
                    ref={drawerRef}
                    hideBackdrop={true}
                    sx={{
                        width: '100%',
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: '100%',
                            boxSizing: 'border-box',
                            maxHeight: '75%',
                            borderRadius: '25px 25px 0 0',
                            zIndex: 9999,
                        },
                    }}
                    variant={'temporary'}
                    anchor={'bottom'}
                    open={canvasOpen}
                >
                    <div className={'align-items-center flex justify-between p-3'}>
                        <AiOutlineClose size={32} className={'m-auto rotate-90 cursor-pointer'} onClick={handleOnClose} />
                    </div>
                    <div className={'border-t border-t-gray-100 px-3'}>
                        <Tabs style={'fullWidth'} className={'w-full'} onActiveTabChange={(tab) => setActiveTab(tab)}>
                            <Tabs.Item title="Members" icon={HiUserCircle}>
                                <List
                                    data={group.members}
                                    renderFn={renderAuthorItem}
                                    wrapperClassName={'w-full'}
                                    vertical={width >= 1280}
                                    title={`Group Members ${group.members.length ? ` ( ${group.members.length} )` : 0}`}
                                    parser={Author.parseResponseAuthor}
                                    emptyListPlaceholder={'This group has no members'}
                                    listClassName={'pl-4'}
                                ></List>
                            </Tabs.Item>
                            <Tabs.Item title="Works" icon={MdDashboard}>
                                {showFilters ? (
                                    <>
                                        <Button className={'mx-auto my-3'} onClick={handleHideFilters} color={'gray'}>
                                            Apply
                                        </Button>
                                        <Filters dispatch={dispatch} filtersHaveChanged={filtersHaveChanged} filters={filters} authors={members} noModal />
                                    </>
                                ) : (
                                    worksList
                                )}
                            </Tabs.Item>
                            {group.children.length !== 0 && (
                                <Tabs.Item title="Sub-Groups" icon={VscGroupByRefType} disabled={activeTab === 2}>
                                    <div className={'w-full'}>
                                        {group.children.map((group) => (
                                            <GroupItem key={group.id} group={group} className={'mx-auto my-5 w-full'} onClick={() => setSelectedGroup(group.id)} isSelected={false} />
                                        ))}
                                    </div>
                                </Tabs.Item>
                            )}
                        </Tabs>
                    </div>
                </Drawer>
            </div>
        )
    );
};

CompactGroupInfo.propTypes = {
    visibleWidth: number,
    groupWorks: object,
    group: object,
    charts: object,
    loading: bool,
    styles: object,
    setSelectedGroup: func,
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
    members: array.isRequired,
    renderAuthorItem: func.isRequired,
};
export default CompactGroupInfo;
