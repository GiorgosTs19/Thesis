import React, {useState} from "react";
import {Badge, Card, ListGroup} from "flowbite-react";
import {arrayOf, bool, func, object, oneOfType} from "prop-types";
import List from "@/Components/List/List.jsx";
import {AuthorItem} from "@/Components/Assets/AuthorItem/AuthorItem.jsx";
import {Author} from "@/Models/Author/Author.js";

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

const Group = ({group, onClick, isSelected}) => {
    return (
        <>
            <ListGroup.Item key={group.id} active={isSelected}
                            className={`w-full cursor-pointer text-lg`}
                            onClick={onClick}>{group.name}</ListGroup.Item>
        </>
    );
};

Group.propTypes = {
    group: object,
    onClick: func,
    isSelected: bool
}

const GroupsPage = ({groups}) => {
    const [selectedGroup, setSelectedGroup] = useState(groups[0]);

    const renderAuthorItem = (item, index) => {
        return <AuthorItem author={item} index={index} key={index}/>
    }

    return (<>
        <Card className={'h-full w-full'}>
            <div className={'grid grid-cols-3 lg:grid-cols-6 gap-5'}>
                <div className={'col-span-3 lg:col-span-2'}>
                    <ListGroup aria-label="Groups List" className={'w-full lg:w-fit overflow-y-auto gap-3'}>
                        {
                            groups.map((group, index) => <Group key={group.id} group={group} depth={0}
                                                                onClick={() => setSelectedGroup(group)}
                                                                isSelected={selectedGroup.id === group.id}/>)
                        }
                    </ListGroup>
                </div>
                <div className={'col-span-3 lg:col-span-4 flex'}>
                    <Card className={'m-auto w-full lg:w-9/12 xl:6/12 h-full'}>
                        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {selectedGroup.name}
                        </h5>
                        <p className="font-normal text-gray-700 dark:text-gray-400">
                            {selectedGroup.description}
                        </p>
                        {selectedGroup.parent &&
                            <Badge className={'text-lg cursor-pointer w-fit px-3 py-1 rounded-lg'}
                                   onClick={() => setSelectedGroup(selectedGroup.parent)}>Subgroup of
                                : {selectedGroup.parent.name}</Badge>}
                        <List data={selectedGroup.members} renderFn={renderAuthorItem}
                              wrapperClassName={'w-full h-full'}
                              title={`Group Members ${selectedGroup.members.length ? ` ( ${selectedGroup.members.length} )` : ''}`}
                              parser={Author.parseResponseAuthor} emptyListPlaceholder={'This group has no members'}/>
                    </Card>
                </div>
            </div>
        </Card>
    </>)
};

GroupsPage.propTypes = {
    groups: oneOfType([object, arrayOf(object)])
}
export default GroupsPage;
