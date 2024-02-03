import React, {useEffect, useState} from "react";
import {Badge, Card, ListGroup} from "flowbite-react";
import {arrayOf, bool, func, object, oneOfType} from "prop-types";
import List from "@/Components/List/List.jsx";
import {AuthorItem} from "@/Components/Assets/AuthorItem/AuthorItem.jsx";
import {Author} from "@/Models/Author/Author.js";
import {AiOutlineDelete} from "react-icons/ai";
import clsx from "clsx";
import {API} from "@/API/API.js";
import {IoAdd} from "react-icons/io5";
import GroupUsersSearch from "@/Components/Search/AdminSearch/GroupUsersSearch.jsx";

const styles = {};

const Group = ({group, onClick, isSelected}) => {
    const handleDelete = async () => {
        const response = await API.instance.groups.deleteGroup(group.id);
        console.log(response);
        return response;
    };

    return (
        <>
            <ListGroup.Item
                key={group.id}
                active={isSelected}
                className={`w-full cursor-pointer text-lg justify-between`}
                onClick={onClick}
            >
                <div className={"mr-5"}>{group.name}</div>
                <div
                    className={clsx(
                        "ml-auto p-2 rounded-full  ",
                        `hover:${isSelected ? "bg-gray-700" : "bg-gray-200"}`,
                    )}
                >
                    <AiOutlineDelete
                        onClick={handleDelete}
                        className={"cursor-pointer"}
                    />
                </div>
            </ListGroup.Item>
        </>
    );
};

Group.propTypes = {
    group: object,
    onClick: func,
    isSelected: bool,
};

const GroupsPage = ({groups}) => {
    const [selectedGroup, setSelectedGroup] = useState(groups[0]);
    const [currentGroups, setCurrentGroups] = useState(groups);
    console.log(currentGroups[0].members.length)
    const renderAuthorItem = (item, index) => {
        return (
            <AuthorItem author={item} index={index} key={index}>
                <div className={"p-1 rounded-full hover:bg-gray-100 my-auto"}>
                    <AiOutlineDelete onClick={() => API.instance.groups.removeMember(selectedGroup.id, item.id).then((data) =>
                        setCurrentGroups(data.data.groups),
                    )}/>
                </div>
            </AuthorItem>
        );
    };

    useEffect(() => {
        const newCurrentGroup = currentGroups.find(item => item.id === selectedGroup.id) ?? null;
        setSelectedGroup(newCurrentGroup)
    }, [currentGroups]);

    return (
        <>
            <Card className={"h-full w-full"}>
                <div className={"grid grid-cols-3 lg:grid-cols-6 gap-5"}>
                    <div className={"col-span-3 lg:col-span-2"}>
                        <ListGroup
                            aria-label="Groups List"
                            className={"w-full lg:w-fit overflow-y-auto gap-3"}>
                            {currentGroups.map((group) => (
                                <Group
                                    key={group.id}
                                    group={group}
                                    depth={0}
                                    onClick={() => setSelectedGroup(group)}
                                    isSelected={selectedGroup.id === group.id}
                                />
                            ))}
                            <ListGroup.Item
                                key={"createNewGroup"}
                                className={`cursor-pointer`}>
                                <div className={"w-full text-lg justify-between text-center flex"}>
                                    New Group
                                    <IoAdd className={"my-auto"}/>
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                    </div>
                    <div className={"col-span-3 lg:col-span-4 flex"}>
                        {selectedGroup ? <Card
                            className={"m-auto w-full lg:w-9/12 xl:6/12 h-full"}>
                            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {selectedGroup.name}
                            </h5>
                            <p className="font-normal text-gray-700 dark:text-gray-400">
                                {selectedGroup.description}
                            </p>
                            {selectedGroup.parent && (
                                <Badge className={"text-lg cursor-pointer w-fit px-3 py-1 rounded-lg"} onClick={() => setSelectedGroup(selectedGroup.parent)}>
                                    Subgroup of : {selectedGroup.parent.name}
                                </Badge>
                            )}
                            <List
                                data={selectedGroup.members}
                                renderFn={renderAuthorItem}
                                wrapperClassName={"w-full h-full"}
                                title={`Group Members ${selectedGroup.members.length ? ` ( ${selectedGroup.members.length} )` : ""}`}
                                parser={Author.parseResponseAuthor}
                                emptyListPlaceholder={"This group has no members"}>
                                <GroupUsersSearch
                                    group={selectedGroup.id}
                                    setGroups={setCurrentGroups}
                                />
                            </List>
                        </Card> : <h4 className={'m-auto'}>Select a group to see more details</h4>}
                    </div>
                </div>
            </Card>
        </>
    );
};

GroupsPage.propTypes = {
    groups: oneOfType([object, arrayOf(object)]),
};
export default GroupsPage;
