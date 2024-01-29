import React from "react";
import {Sidebar} from "flowbite-react";
import {arrayOf, object, oneOfType, string} from "prop-types";

const styles = {
    grid: 'grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4',
    gridCol: 'col-span-2 xl:col-span-1 flex flex-col',
    statusWrapper: 'rounded-lg bg-gray-100 px-6 py-4',
    statusHeader: 'font-semibold mb-2 text-sm lg:text-lg',
    status: 'text-gray-700 italic text-xs lg:text-sm',
    lastUpdated: 'mt-2 text-gray-500 opacity-80 text-xs lg:text-sm',
    chartsContainer: '2xl:col-span-3 flex flex-col h-full',
    chartContainer: 'flex flex-col h-full',
    chartDescription: 'text-gray-500 opacity-75 italic mx-auto mb-4',
    chart: 'md:px-4 mb-4 max-w-full',
    chartDisclaimer: 'text-gray-500 opacity-75 italic m-auto text-center',
    listsContainer: 'grid grid-cols-1 2xl:grid-cols-5 gap-4 mb-4',
    authorsListContainer: '2xl:col-span-1 flex flex-col',
    worksListContainer: '2xl:col-span-4 flex flex-col',
    listTitle: 'md:text-lg font-semibold mb-4 text-yellow-800',
    listText: 'mx-2 text-xs sm:text-sm text-gray-600 opacity-50'
}

const Group = ({group, className}) => (
    <>
        {group.children_recursive.length ? (
            <Sidebar.Collapse key={group.id} label={group.name}>
                {group.children_recursive.map((item) => (
                    <Group key={item.id} group={item} className={'ml-5'}/>
                ))}
            </Sidebar.Collapse>
        ) : (
            <Sidebar.Item key={group.id}><span className={className}>{group.name}</span></Sidebar.Item>
        )}
    </>
);
Group.propTypes = {
    group: object,
    className: string
}

const GroupsPage = ({groups}) => {
    console.log(groups)
    return (<>
        <div className={styles.grid}>
            <div className={styles.gridCol}>
                <Sidebar aria-label="Sidebar with multi-level dropdown example" className={'w-auto'}>
                    <Sidebar.Items>
                        <Sidebar.ItemGroup>
                            {
                                groups.map(group => group.children_recursive.length ? (
                                    <Sidebar.Collapse key={group.id} label={group.name}>
                                        {group.children_recursive.map((item) => (
                                            <Group key={item.id} group={item} className={'ml-5'}/>
                                        ))}
                                    </Sidebar.Collapse>
                                ) : (
                                    <Sidebar.Item key={group.id}>{group.name}</Sidebar.Item>
                                ))
                            }
                        </Sidebar.ItemGroup>
                    </Sidebar.Items>
                </Sidebar>
            </div>

            <div className={styles.gridCol}>
                2
            </div>
        </div>
    </>)
};

GroupsPage.propTypes = {
    groups: oneOfType([object, arrayOf(object)])
}
export default GroupsPage;
