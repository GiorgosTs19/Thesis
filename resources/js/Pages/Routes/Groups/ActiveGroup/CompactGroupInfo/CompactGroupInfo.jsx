import { Button, Spinner, Tabs } from 'flowbite-react';
import { HiUserCircle } from 'react-icons/hi';
import { MdDashboard } from 'react-icons/md';
import { VscGroupByRefType } from 'react-icons/vsc';
import OffCanvas from '@/Components/OffCanvas/OffCanvas.jsx';
import List from '@/Components/List/List.jsx';
import { Author } from '@/Models/Author/Author.js';
import GroupUsersSearch from '@/Components/Search/AdminSearch/GroupUsersSearch.jsx';
import PaginatedList from '@/Components/PaginatedList/PaginatedList.jsx';
import { renderWorkItem } from '@/Models/Work/Utils.jsx';
import { Work } from '@/Models/Work/Work.js';
import GroupItem from '@/Components/Assets/GroupItem/GroupItem.jsx';
import React, { useRef, useState } from 'react';
import { renderAuthorItem } from '@/Models/Author/Utils.jsx';
import { useWindowSize } from '@uidotdev/usehooks';

const CompactGroupInfo = ({ visibleWidth = 1100, group, groupWorks, charts, loading, button, setSelectedGroup, styles, handleLinkClick }) => {
    const { width } = useWindowSize();
    const [canvasOpen, setCanvasOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const tabsRef = useRef(0);
    const handleOpenOffCanvas = (tab) => {
        setCanvasOpen(true);
        console.log('🚀 ~ CompactGroupInfo.jsx 24', tabsRef);
        tabsRef.current = tab;
    };

    // Handles the closing of the off-canvas
    const handleOnClose = () => {
        setCanvasOpen(false);
    };

    return (
        width <= visibleWidth && (
            <div className={'flex flex-col gap-5'}>
                <Button.Group className={'w-full'}>
                    <Button color="gray" onClick={() => handleOpenOffCanvas(0)} className={'flex-grow text-nowrap'}>
                        <HiUserCircle />
                        <span className={'mx-3'}>{`Members ${group.members.length ? ` ( ${group.members.length} )` : `( 0 )`}`}</span>
                    </Button>
                    <Button color="gray" onClick={() => handleOpenOffCanvas(1)} className={'flex-grow text-nowrap'} disabled={!groupWorks?.meta?.total}>
                        <MdDashboard />
                        <span className={'mx-3'}> {`Works ( ${groupWorks?.meta?.total ?? 0} )`}</span>
                    </Button>
                </Button.Group>
                <Button color="gray" onClick={() => handleOpenOffCanvas(2)} className={'flex-grow text-nowrap'} disabled={!group.members.length}>
                    <VscGroupByRefType />
                    <span className={'mx-3'}> {`Sub-Groups`}</span>
                </Button>
                {charts}
                <OffCanvas isOpen={canvasOpen} position={'bottom'} onClose={handleOnClose}>
                    <Tabs style={'fullWidth'} className={'w-full'} ref={tabsRef} onActiveTabChange={(tab) => setActiveTab(tab)}>
                        <Tabs.Item title="Members" icon={HiUserCircle} disabled={activeTab === 0}>
                            <List
                                data={group.members}
                                renderFn={renderAuthorItem}
                                wrapperClassName={'w-full'}
                                vertical={width >= 1280}
                                title={`Group Members ${group.members.length ? ` ( ${group.members.length} )` : 0}`}
                                parser={Author.parseResponseAuthor}
                                emptyListPlaceholder={'This group has no members'}
                            >
                                <GroupUsersSearch group={group} />
                            </List>
                        </Tabs.Item>
                        <Tabs.Item title="Works" icon={MdDashboard} disabled={activeTab === 1}>
                            {button}
                            {!loading && groupWorks ? (
                                <PaginatedList
                                    response={groupWorks}
                                    title={`Group Works ( ${groupWorks?.meta?.total ?? 0} )`}
                                    renderFn={renderWorkItem}
                                    emptyListPlaceholder={'This list is empty'}
                                    parser={Work.parseResponseWork}
                                    onLinkClick={handleLinkClick}
                                    className={'mt-auto w-full'}
                                    // sortingOptions={parsedCustomTypes}
                                >
                                    <div className={styles.listTitle}>{`Group Works ( ${groupWorks?.meta?.total} )`}</div>
                                </PaginatedList>
                            ) : (
                                <div className={'m-auto'}>
                                    <Spinner size="xl" />
                                </div>
                            )}
                        </Tabs.Item>
                        {group.children.length !== 0 && (
                            <Tabs.Item title="Sub-Groups" icon={VscGroupByRefType} disabled={activeTab === 2}>
                                <div className={'w-full'}>
                                    {group.children.map((group) => (
                                        <GroupItem key={group.id} group={group} className={'mx-auto my-5 w-full text-center underline'} onClick={() => setSelectedGroup(group.id)} isSelected={false} />
                                    ))}
                                </div>
                            </Tabs.Item>
                        )}
                    </Tabs>
                </OffCanvas>
            </div>
        )
    );
};

export default CompactGroupInfo;
