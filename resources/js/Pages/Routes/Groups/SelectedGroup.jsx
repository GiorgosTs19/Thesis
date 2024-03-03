import { Button, Card, Tabs } from 'flowbite-react';
import RowOfProperties from '@/Components/RowOfProperties/RowOfProperties.jsx';
import List from '@/Components/List/List.jsx';
import { Author } from '@/Models/Author/Author.js';
import GroupUsersSearch from '@/Components/Search/AdminSearch/GroupUsersSearch.jsx';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { arrayOf, func, object, shape, string } from 'prop-types';
import PaginatedList from '@/Components/PaginatedList/PaginatedList.jsx';
import { renderWorkItem } from '@/Models/Work/Utils.jsx';
import { Work } from '@/Models/Work/Work.js';
import { AuthorItem } from '@/Components/Assets/AuthorItem/AuthorItem.jsx';
import UtilityModal from '@/Components/Modal/UtilityModal.jsx';
import { AiOutlineDelete } from 'react-icons/ai';
import { useWindowSize } from '@uidotdev/usehooks';
import OffCanvas from '@/Components/OffCanvas/OffCanvas.jsx';
import { HiUserCircle } from 'react-icons/hi';
import { MdDashboard } from 'react-icons/md';
import useAPI from '@/Hooks/useAPI/useAPI.js';

const styles = {
    groupName: 'text-2xl font-bold tracking-tight text-gray-900 dark:text-white my-1',
    badge: 'text-lg cursor-pointer w-fit px-3 py-1 rounded-lg mb-2',
    groupDescription: 'font-normal text-gray-700 dark:text-gray-400 my-2',
    listTitle: 'md:text-lg 2xl:text-xl font-semibold text-yellow-800 w-fit flex',
    button: 'hover:scale-110 cursor-pointer',
    container: 'flex flex-col py-5 px-8',
};
export const SelectedGroup = ({ group, setSelectedGroup, worksPaginationInfo, setWorksPaginationInfo }) => {
    const { width } = useWindowSize();
    const [canvasOpen, setCanvasOpen] = useState(false);
    const tabsRef = useRef(0);
    const [activeTab, setActiveTab] = useState(0);
    const api = useAPI();
    const handleLinkClick = async (url) => {
        api.pagination.getPage(url).then((res) => {
            setWorksPaginationInfo(res.data.works);
        });
    };

    // * Renders the authors as list items for the selected group.
    const renderAuthorItem = useCallback(
        (item, index) => {
            return (
                <AuthorItem author={item} index={index} key={index}>
                    <UtilityModal
                        acceptText={`Remove ${item.name}`}
                        header={'Remove member'}
                        onAccept={() => api.groups.removeMember(group, item)}
                        buttonClassName={styles.button}
                        message={`Are you sure you want to remove ${item.name} from ${group.name}?`}
                        declineText={'Cancel'}
                    >
                        <div className={styles.deleteIcon}>
                            <AiOutlineDelete />
                        </div>
                    </UtilityModal>
                </AuthorItem>
            );
        },
        [group],
    );

    const properties = useMemo(
        () => [
            group.parent && { name: 'Parent Group', value: group.parent.name, onClick: () => setSelectedGroup(group.parent.id) },
            { name: 'Total Number of Authors', value: group?.members.length },
            { name: 'Total Number of Works', value: worksPaginationInfo?.meta.total },
            {
                name: 'Total Amount of Citations',
                value: group?.members.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue.citation_count;
                }, 0),
            },
        ],
        [group, worksPaginationInfo],
    );

    const handleOpenOffCanvas = (tab) => {
        setCanvasOpen(true);
        tabsRef.current.setActiveTab(tab);
    };

    // Handles the closing of the off-canvas
    const handleOnClose = () => {
        setCanvasOpen(false);
    };

    return (
        <div className={'w-full px-8 py-5'}>
            <h5 className={styles.groupName}>{group.name}</h5>
            <p className={styles.groupDescription}>{group.description}</p>
            <>
                <div>
                    <RowOfProperties properties={properties} title={'Group Properties'} />
                </div>
                {width <= 640 ? (
                    <div className={'flex flex-col gap-5'}>
                        <Button.Group className={'w-full'}>
                            <Button color="gray" onClick={() => handleOpenOffCanvas(0)} className={'flex-grow'} disabled={!group.members.length}>
                                <HiUserCircle />
                                <span className={'mx-3'}>{`Members ${group.members.length ? ` ( ${group.members.length} )` : `( 0 )`}`}</span>
                            </Button>
                            <Button
                                color="gray"
                                onClick={() => handleOpenOffCanvas(1)}
                                className={'flex-grow'}
                                disabled={!worksPaginationInfo.meta.total}
                            >
                                <MdDashboard />
                                <span className={'mx-3'}> {`Works ( ${worksPaginationInfo.meta.total} )`}</span>
                            </Button>
                        </Button.Group>
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
                                    <PaginatedList
                                        response={worksPaginationInfo}
                                        renderFn={renderWorkItem}
                                        emptyListPlaceholder={'This group has no works'}
                                        parser={Work.parseResponseWork}
                                        onLinkClick={handleLinkClick}
                                        className={'mt-auto w-full'}
                                    >
                                        <div className={styles.listTitle}>{`Group Works ( ${worksPaginationInfo.meta.total} )`}</div>
                                    </PaginatedList>
                                </Tabs.Item>
                            </Tabs>
                        </OffCanvas>
                    </div>
                ) : (
                    <div className={'flex min-h-96 flex-col gap-10 lg:flex-row'}>
                        <Card className={'w-full lg:max-w-fit '}>
                            <List
                                data={group.members}
                                renderFn={renderAuthorItem}
                                wrapperClassName={`mb-auto`}
                                vertical
                                title={`Group Members ${group.members.length ? ` ( ${group.members.length} )` : ''}`}
                                parser={Author.parseResponseAuthor}
                                emptyListPlaceholder={'This group has no members'}
                            >
                                <GroupUsersSearch group={group} />
                            </List>
                        </Card>
                        <Card className={`w-full`}>
                            <PaginatedList
                                response={worksPaginationInfo}
                                renderFn={renderWorkItem}
                                parser={Work.parseResponseWork}
                                emptyListPlaceholder={'This group has no works'}
                                onLinkClick={handleLinkClick}
                                title={`Group Works ( ${worksPaginationInfo.meta.total} )`}
                            ></PaginatedList>
                        </Card>
                    </div>
                )}
            </>
        </div>
    );
};

SelectedGroup.propTypes = {
    group: shape({
        name: string.isRequired,
        parent: object,
        description: string.isRequired,
        members: arrayOf(object),
    }),
    setSelectedGroup: func.isRequired,
    setGroupsList: func.isRequired,
    setWorksPaginationInfo: func.isRequired,
    worksPaginationInfo: object.isRequired,
};
