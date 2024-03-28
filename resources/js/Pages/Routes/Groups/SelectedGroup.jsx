import { Button, Card, Tabs } from 'flowbite-react';
import RowOfProperties from '@/Components/RowOfProperties/RowOfProperties.jsx';
import List from '@/Components/List/List.jsx';
import { Author } from '@/Models/Author/Author.js';
import GroupUsersSearch from '@/Components/Search/AdminSearch/GroupUsersSearch.jsx';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { arrayOf, func, number, object, shape, string } from 'prop-types';
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
import SimpleDoughnutChart from '@/Charts/DoughnutChart/SimpleDoughnutChart.jsx';
import Switch from '@/Components/Switch/Switch.jsx';
import SimpleStatisticsChart from '@/Charts/SimpleStatisticsChart/SimpleBarChart.jsx';
import DropDownMenu from '@/Components/DropDownMenu/DropDownMenu.jsx';
import GroupItem from '@/Components/Assets/GroupItem/GroupItem.jsx';
import { VscGroupByRefType } from 'react-icons/vsc';

const styles = {
    groupName: 'text-2xl font-bold tracking-tight text-gray-900 dark:text-white my-1',
    badge: 'text-lg cursor-pointer w-fit px-3 py-1 rounded-lg mb-2',
    groupDescription: 'font-normal text-gray-700 dark:text-gray-400 pb-3 mt-2 mb-4',
    listTitle: 'md:text-lg 2xl:text-xl font-semibold text-yellow-800 w-fit flex',
    button: 'hover:scale-110 cursor-pointer',
    container: 'flex flex-col py-5 px-8',
    chartContainer: 'flex flex-col',
    chartDescription: 'text-gray-500 opacity-75 italic mx-auto mb-4',
    chart: 'md:px-4 mb-4 max-w-full',
    chartDisclaimer: 'text-gray-500 opacity-75 italic m-auto text-center',
    deleteButton: 'p-2 rounded-full w-fit',
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
    const deleteModalRef = useRef(null);

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
            { name: 'OpenAlex Works', value: group.uniqueWorksCount.OpenAlex },
            { name: 'Crossref Works', value: group.uniqueWorksCount.Crossref },
            { name: 'ORCID Works', value: group.uniqueWorksCount.ORCID },
        ],
        [group, worksPaginationInfo],
    );

    const DOUGHNUT_CHART_DATA = {
        dataSet: [group.uniqueWorksCount.OpenAlex, group.uniqueWorksCount.ORCID, group.uniqueWorksCount.Crossref],
        title: 'Works from Source',
        labels: ['Open Alex', 'ORCID', 'Crossref'],
        description:
            'Visualization of the distribution of works sourced from different platforms, including OpenAlex, ORCID and Crossref. ' +
            "It offers insights into the relative contribution of each platform to the overall collection of group's works.",
        disclaimer: '',
    };
    const statistics = useMemo(() => group.members?.map((member) => member.statistics), [group]);

    const yearlyCounts = useMemo(
        () =>
            group.members.length
                ? statistics.reduce((accumulator, array) => {
                      // Iterate over each object in the array
                      array.forEach((item) => {
                          const { year, cited_count, works_count } = item;
                          // Check if the year exists in the accumulator object
                          if (!accumulator[year]) {
                              // If not, initialize counts for that year
                              accumulator[year] = { cited_count: 0, works_count: 0 };
                          }
                          // Add up counts for the current year
                          accumulator[year].cited_count += cited_count;
                          accumulator[year].works_count += works_count;
                      });
                      return accumulator;
                  }, {})
                : {},
        [statistics],
    );

    const yearsArray = Object.keys(yearlyCounts)
        .map((year) => parseInt(year))
        .sort((a, b) => {
            if (a === b) {
                return 0; // Leave them unchanged relative to each other
            } else if (a < b) {
                return -1; // a comes before b
            } else {
                return 1; // b comes before a
            }
        });

    const CHART_DATA = useMemo(
        () => ({
            CITATIONS: {
                dataSet: Object.values(yearlyCounts).map((statistic) => statistic?.cited_count),
                title: 'Citations',
                labels: yearsArray,
                description: 'Citation trends per year.',
                disclaimer:
                    'The data presented in this chart may not capture the complete set of citations for' +
                    ' this group. The statistics gathered might not cover every year, potentially leading' +
                    ' to gaps in the information.',
            },
            WORKS: {
                dataSet: Object.values(yearlyCounts).map((statistic) => statistic?.works_count),
                title: 'Works',
                labels: yearsArray,
                description: 'Distribution of works authored per year.',
                disclaimer:
                    'The data presented in this chart may not capture the complete set of works for' +
                    ' this group. The statistics gathered might not cover every year, potentially leading' +
                    ' to gaps in the information.',
            },
        }),
        [],
    );

    const [activeChart, setActiveChart] = useState(CHART_DATA.CITATIONS);

    const handleOpenOffCanvas = (tab) => {
        setCanvasOpen(true);
        tabsRef.current.setActiveTab(tab);
    };

    // Handles the closing of the off-canvas
    const handleOnClose = () => {
        setCanvasOpen(false);
    };

    const charts = group.members.length !== 0 && (
        <>
            <div className={styles.chartsContainer}>
                <Switch
                    checkedLabel={CHART_DATA.WORKS.title}
                    uncheckedLabel={CHART_DATA.CITATIONS.title}
                    checked={activeChart.title !== CHART_DATA.CITATIONS.title}
                    className={'mx-auto my-4 w-fit'}
                    onChange={(checked) => setActiveChart(checked ? CHART_DATA.CITATIONS : CHART_DATA.WORKS)}
                />
                <div className={styles.chartContainer}>
                    <div className={styles.chartDescription}>{activeChart.description}</div>
                    <div className={styles.chart}>
                        <SimpleStatisticsChart title={activeChart.title} dataSet={activeChart.dataSet} labels={activeChart.labels} />
                    </div>
                    <div className={styles.chartDisclaimer}>{activeChart.disclaimer}</div>
                </div>
            </div>
            <div className={'mb-5 mt-10 flex flex-col gap-10 border-t border-t-gray-300 pt-5'}>
                <SimpleDoughnutChart
                    dataSet={DOUGHNUT_CHART_DATA.dataSet}
                    labels={DOUGHNUT_CHART_DATA.labels}
                    title={DOUGHNUT_CHART_DATA.title}
                    className={'mx-auto max-h-60'}
                />
                <div className={styles.chartDescription}>{DOUGHNUT_CHART_DATA.description}</div>
            </div>
        </>
    );

    const handleDelete = async () => api.groups.deleteGroup(group);

    const dropDownOptions = [{ name: 'Delete Group', value: 0, onClick: deleteModalRef?.current?.open, default: false }];

    return (
        <div className={`w-full px-8 py-5`}>
            <UtilityModal
                ref={deleteModalRef}
                acceptText={'Delete'}
                header={`Delete ${group.name}`}
                message={`Are you sure you want to permanently delete ${group.name}?`}
                declineText={'Cancel'}
                buttonClassName={'cursor-pointer'}
                onAccept={handleDelete}
            ></UtilityModal>
            <div className={'flex w-full justify-between gap-5'}>
                <h5 className={styles.groupName}>{group.name}</h5>
                <DropDownMenu dotsButton options={dropDownOptions} position={'right'} />
            </div>
            <p className={styles.groupDescription}>{group.description}</p>
            <div className={'flex w-full'}>
                <div className={'w-full'}>
                    <div>
                        <RowOfProperties properties={properties} />
                    </div>
                    {width <= 1100 ? (
                        <div className={'flex flex-col gap-5'}>
                            <Button.Group className={'w-full'}>
                                <Button color="gray" onClick={() => handleOpenOffCanvas(0)} className={'flex-grow text-nowrap'}>
                                    <HiUserCircle />
                                    <span className={'mx-3'}>{`Members ${group.members.length ? ` ( ${group.members.length} )` : `( 0 )`}`}</span>
                                </Button>
                                <Button
                                    color="gray"
                                    onClick={() => handleOpenOffCanvas(1)}
                                    className={'flex-grow text-nowrap'}
                                    disabled={!worksPaginationInfo.meta.total}
                                >
                                    <MdDashboard />
                                    <span className={'mx-3'}> {`Works ( ${worksPaginationInfo.meta.total} )`}</span>
                                </Button>
                            </Button.Group>
                            <Button
                                color="gray"
                                onClick={() => handleOpenOffCanvas(2)}
                                className={'flex-grow text-nowrap'}
                                disabled={!group.members.length}
                            >
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
                                    {group.children.length !== 0 && (
                                        <Tabs.Item title="Sub-Groups" icon={VscGroupByRefType} disabled={activeTab === 2}>
                                            <div className={'w-full'}>
                                                {group.children.map((group) => (
                                                    <GroupItem
                                                        key={group.id}
                                                        group={group}
                                                        className={'mx-auto my-5 w-full text-center underline'}
                                                        onClick={() => setSelectedGroup(group.id)}
                                                        isSelected={false}
                                                    />
                                                ))}
                                            </div>
                                        </Tabs.Item>
                                    )}
                                </Tabs>
                            </OffCanvas>
                        </div>
                    ) : (
                        <>
                            {group.children.length > 0 && (
                                <div className={'flex w-full flex-col border-b border-b-gray-200 px-2'}>
                                    <div className={'mb-2 text-left text-xl font-bold'}>Sub-groups</div>
                                    <div className={'flex gap-10'}>
                                        {group.children.map((group) => (
                                            <GroupItem
                                                key={group.id}
                                                group={group}
                                                className={'rounded-none px-2 py-1 underline'}
                                                onClick={() => setSelectedGroup(group.id)}
                                                isSelected={false}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {charts}
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
                                        gap={6}
                                    ></PaginatedList>
                                </Card>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

SelectedGroup.propTypes = {
    group: shape({
        name: string.isRequired,
        parent: object,
        description: string.isRequired,
        members: arrayOf(object),
        children: arrayOf(object),
        uniqueWorksCount: shape({ OpenAlex: number, ORCID: number, Crossref: number }),
    }),
    setSelectedGroup: func.isRequired,
    setGroupsList: func.isRequired,
    setWorksPaginationInfo: func.isRequired,
    worksPaginationInfo: object.isRequired,
};
