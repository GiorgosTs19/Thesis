import RowOfProperties from '@/Components/RowOfProperties/RowOfProperties.jsx';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { arrayOf, func, number, object, shape, string } from 'prop-types';
import { AuthorItem } from '@/Components/Assets/AuthorItem/AuthorItem.jsx';
import UtilityModal from '@/Components/Modal/UtilityModal.jsx';
import { AiOutlineDelete } from 'react-icons/ai';
import useAPI from '@/Hooks/useAPI/useAPI.js';
import SimpleDoughnutChart from '@/Charts/DoughnutChart/SimpleDoughnutChart.jsx';
import Switch from '@/Components/Switch/Switch.jsx';
import SimpleStatisticsChart from '@/Charts/SimpleStatisticsChart/SimpleBarChart.jsx';
import DropDownMenu from '@/Components/DropDownMenu/DropDownMenu.jsx';
import useAsync from '@/Hooks/useAsync/useAsync.js';
import CompactGroupInfo from '@/Pages/Routes/Groups/ActiveGroup/CompactGroupInfo/CompactGroupInfo.jsx';
import ExpandedGroupInfo from '@/Pages/Routes/Groups/ActiveGroup/ExpandedGroupInfo/ExpandedGroupInfo.jsx';
import NewEmptyGroup from '@/Pages/Routes/Groups/ActiveGroup/NewEmptyGroup/NewEmptyGroup.jsx';
import useWorkFilters from '@/Hooks/useWorkFilters/useWorkFilters.jsx';
import { Modal, Table, Tabs } from 'flowbite-react';
import { useClickAway } from '@uidotdev/usehooks';

const styles = {
    groupName: 'text-2xl font-bold tracking-tight text-gray-900 dark:text-white ',
    badge: 'text-lg cursor-pointer w-fit px-3 py-1 rounded-lg mb-2',
    groupDescription: 'font-normal text-gray-700 dark:text-gray-400 pb-3 mt-2 mb-4',
    listTitle: 'md:text-lg 2xl:text-xl font-semibold text-yellow-800 w-fit flex',
    button: 'hover:scale-110 cursor-pointer',
    container: 'flex flex-col py-5 px-8',
    chartContainer: 'flex flex-col',
    chartDescription: 'text-gray-500 opacity-75 italic mx-auto my-3 w-full lg:w-7/12 text-center',
    chart: 'md:px-4 mb-4 max-w-full',
    chartDisclaimer: 'text-gray-500 opacity-75 italic m-auto text-center',
    deleteButton: 'p-2 rounded-full w-fit',
};
export const ActiveGroup = ({ groupObject, setSelectedGroup }) => {
    const { group, countsPerAuthor, typeStatistics } = groupObject;
    const api = useAPI();
    const [groupWorks, setGroupWorks] = useState({ data: [] });
    const { filters, filtersHaveChanged, dispatch } = useWorkFilters({ authors: group.members });
    // Cache the total amount of works, so it doesn't change when we filter out works.
    const totalWorksRef = useRef(null);
    const [statisticsModalOpen, setStatisticsModalOpen] = useState(false);
    const statisticsModalRef = useClickAway(() => {
        setStatisticsModalOpen(false);
    });
    const handleFetchGroup = useCallback(() => {
        if (!group || !group.members.length) return;
        return api.works.filterWorks(filters).then((res) => {
            setGroupWorks(res.data);
            if (!totalWorksRef.current) totalWorksRef.current = res.data.meta.total;
        });
    }, [group, filters]);

    const { loading } = useAsync(handleFetchGroup, true);

    const handleLinkClick = async (url) => {
        api.pagination.getPage(`${url}`).then((res) => {
            setGroupWorks(res.data);
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
            { name: 'Number of Authors', value: group?.members.length },
            { name: 'Total Number of Works', value: totalWorksRef.current ?? 0 },
            {
                name: 'Total Amount of Citations',
                value: group?.members.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue.citation_count;
                }, 0),
            },
            { name: 'Click for more Statistics', value: 'OMEA, Authors', onClick: () => handleOpenStatisticsModal() },
        ],
        [groupObject, groupWorks],
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
    const doughnutProperties = [
        { name: 'OpenAlex Works', value: group.uniqueWorksCount.OpenAlex },
        { name: 'Crossref Works', value: group.uniqueWorksCount.Crossref },
        { name: 'ORCID Works', value: group.uniqueWorksCount.ORCID },
    ];

    const charts = group.members.length !== 0 && (
        <>
            <div className={'my-5 gap-10 border-t border-t-gray-300 pt-5'}>
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
            <div className={'mb-5 mt-10 flex gap-10 border-t border-t-gray-300 pt-5'}>
                <div className={'flex flex-grow flex-col'}>
                    <SimpleDoughnutChart dataSet={DOUGHNUT_CHART_DATA.dataSet} labels={DOUGHNUT_CHART_DATA.labels} title={DOUGHNUT_CHART_DATA.title} className={'mx-auto max-h-60'} />
                    <div className={styles.chartDescription}>{DOUGHNUT_CHART_DATA.description}</div>
                </div>
                <RowOfProperties properties={doughnutProperties} vertical />
            </div>
        </>
    );

    const handleDelete = async () => api.groups.deleteGroup(group);
    const handleOpenStatisticsModal = () => setStatisticsModalOpen(true);
    const handleCloseStatisticsModal = () => setStatisticsModalOpen(false);

    const dropDownOptions = [{ name: 'Delete Group', value: 0, onClick: deleteModalRef?.current?.open, default: false }];

    return (
        <div className={`w-full px-5 py-5 ${group.members.length ? '' : 'flex'}`}>
            {group.members.length ? (
                <>
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
                    <Modal onClose={handleCloseStatisticsModal} show={statisticsModalOpen}>
                        <Modal.Header>More Statistics</Modal.Header>
                        <Modal.Body>
                            <div ref={statisticsModalRef}>
                                <Tabs style={'fullWidth'} className={'max-h-96'}>
                                    <Tabs.Item active title="Works per Author">
                                        <div className={'overflow-x-auto'}>
                                            <Table>
                                                <Table.Head>
                                                    <Table.HeadCell>Author</Table.HeadCell>
                                                    <Table.HeadCell>OpenAlex</Table.HeadCell>
                                                    <Table.HeadCell>ORCID</Table.HeadCell>
                                                    <Table.HeadCell>Crossref</Table.HeadCell>
                                                </Table.Head>
                                                <Table.Body>
                                                    {countsPerAuthor.map((t) => (
                                                        <Table.Row key={t.name}>
                                                            <Table.Cell>{t.name}</Table.Cell>
                                                            <Table.Cell className={'text-center'}>{t.counts.OpenAlex ?? '-'}</Table.Cell>
                                                            <Table.Cell className={'text-center'}>{t.counts.ORCID ?? '-'}</Table.Cell>
                                                            <Table.Cell className={'text-center'}>{t.counts.Crossref ?? '-'}</Table.Cell>
                                                        </Table.Row>
                                                    ))}
                                                </Table.Body>
                                            </Table>
                                        </div>
                                    </Tabs.Item>
                                    <Tabs.Item active title="Works per OMEA Type">
                                        <div className={'overflow-x-auto'}>
                                            <Table>
                                                <Table.Head>
                                                    <Table.HeadCell>Type</Table.HeadCell>
                                                    <Table.HeadCell>Count</Table.HeadCell>
                                                </Table.Head>
                                                <Table.Body>
                                                    {Object.entries(typeStatistics).map(([type, count]) => (
                                                        <Table.Row key={type}>
                                                            <Table.Cell>{type}</Table.Cell>
                                                            <Table.Cell className={'text-center'}>{count}</Table.Cell>
                                                        </Table.Row>
                                                    ))}
                                                </Table.Body>
                                            </Table>
                                        </div>
                                    </Tabs.Item>
                                </Tabs>
                            </div>
                        </Modal.Body>
                    </Modal>
                    <div className={'flex w-full flex-col'}>
                        <div className={'mb-3 flex justify-center'}>
                            <RowOfProperties properties={properties} grow={false} />
                        </div>
                        <CompactGroupInfo
                            setSelectedGroup={setSelectedGroup}
                            group={group}
                            groupWorks={groupWorks}
                            charts={charts}
                            handleLinkClick={handleLinkClick}
                            loading={loading}
                            styles={styles}
                            visibleWidth={1100}
                            dispatch={dispatch}
                            filters={filters}
                            filtersHaveChanged={filtersHaveChanged}
                            members={group.members}
                            renderAuthorItem={renderAuthorItem}
                        />
                        <ExpandedGroupInfo
                            groupWorks={groupWorks}
                            charts={charts}
                            visibleWidth={1100}
                            loading={loading}
                            handleLinkClick={handleLinkClick}
                            dispatch={dispatch}
                            filters={filters}
                            filtersHaveChanged={filtersHaveChanged}
                            group={group}
                            renderAuthorItem={renderAuthorItem}
                        />
                    </div>
                </>
            ) : (
                <NewEmptyGroup group={group} />
            )}
        </div>
    );
};

ActiveGroup.propTypes = {
    groupObject: shape({
        group: shape({
            name: string.isRequired,
            parent: object,
            description: string.isRequired,
            members: arrayOf(object),
            children: arrayOf(object),
            uniqueWorksCount: shape({ OpenAlex: number, ORCID: number, Crossref: number }),
        }),
        countsPerAuthor: arrayOf(shape({ name: string, counts: shape({ OpenAlex: number, ORCID: number, Crossref: number }) })),
        typeStatistics: object,
    }),
    setSelectedGroup: func.isRequired,
};
