import React, {useState} from "react";
import {Badge, Button, Label, Modal, Select, Textarea, TextInput} from "flowbite-react";
import {IoAdd} from "react-icons/io5";
import {array, func} from "prop-types";
import {API} from "@/API/API.js";
import {ToastTypes, useToast} from "@/Contexts/ToastContext.jsx";

/**
 * NewGroupModal Component
 * @component
 * A component for creating a new group with a modal interface.

 * @example
 * <NewGroupModal setGroups={setGroups} groups={groups} />;
 *
 * @param {Function} setGroups - The function to update the list of groups after creating a new group.
 * @param {Array} groups - An array of existing groups to select as the parent group (optional).
 * @returns The rendered NewGroupModal component.
 */
const NewGroupModal = ({handleNewGroupCreated, groups}) => {
    const [openModal, setOpenModal] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [groupDesc, setGroupDesc] = useState('');
    const [groupParent, setGroupParent] = useState(null);
    const {
        showToast,
    } = useToast();
    const handleAccept = () => {
        API.instance.groups.createGroup(groupName, groupDesc, groupParent).then(response => {
            if (response.success) {
                showToast(`${groupName} created`, ToastTypes.SUCCESS);
                handleNewGroupCreated(response.data.groups, response.data.newGroup.id)
            } else if (response.error) {
                showToast(response.error, ToastTypes.ERROR);
            }
        });
        setGroupDesc('')
        setGroupName('')
        setGroupParent(null)
        setOpenModal(false);
    }

    const handleDecline = () => {
        setOpenModal(false);
    }

    return (
        <>
            <Badge key={"createNewGroup"} icon={IoAdd} onClick={() => setOpenModal(true)} color={'success'} className={'px-6 py-2 rounded-full my-auto cursor-pointer hover:scale-110 transition-transform duration-300'}/>
            <Modal show={openModal} onClose={() => setOpenModal(false)} dismissible>
                <Modal.Header>Create a group</Modal.Header>
                <Modal.Body>
                    <div className="space-y-10">
                        <div className="max-w-md mb-4">
                            <div className="mb-2 block">
                                <Label htmlFor="groupName" value="Group name ( Required )"/>
                            </div>
                            <TextInput id={'groupName'} type={'text'} value={groupName} placeholder="New group name" required onChange={(e) => {
                                setGroupName(e.target.value)
                            }}/>
                        </div>
                    </div>
                    <div className="max-w-md mb-4">
                        <div className="mb-2 block">
                            <Label htmlFor="description" value="Group description ( Required )"/>
                        </div>
                        <Textarea id="description" value={groupDesc} placeholder="Give a description for the new group" required rows={4} className={'p-2 bg-white'} onChange={(e) => {
                            setGroupDesc(e.target.value)
                        }}/>
                    </div>
                    <div className="max-w-md">
                        <div className="mb-2 block">
                            <Label htmlFor="groups" value="Parent Group ( Optional )"/>
                        </div>
                        <Select id="groups" onChange={(e) => setGroupParent(e.target.value)} className={'bg-white'}>
                            <option key={'none'} value={null}>None</option>
                            {groups.map(group => <option key={group.id} value={group.id}>{group.name}</option>)}
                        </Select>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleAccept} disabled={groupName.length === 0 || groupDesc.length === 0}>Create</Button>
                    <Button color="gray" onClick={handleDecline}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

const styles = {
    newGroupButton: 'w-full text-lg justify-between text-center flex cursor-pointer gap-2',
}

NewGroupModal.propTypes = {
    handleNewGroupCreated: func.isRequired,
    groups: array
}

export default NewGroupModal;
