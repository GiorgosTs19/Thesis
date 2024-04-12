import React, { useEffect, useState } from 'react';
import { Badge, Button, Label, Modal, Select, Textarea, TextInput } from 'flowbite-react';
import { ToastTypes, useToast } from '@/Contexts/ToastContext.jsx';
import { IoAdd } from 'react-icons/io5';
import useAPI from '@/Hooks/useAPI/useAPI.js';

/**
 * NewGroupModal Component
 * @component
 * A component for creating a new group with a modal interface.

 * @example
 * <NewGroupModal/>;
 * @returns The rendered NewGroupModal component.
 */
const NewGroupModal = () => {
    const [openModal, setOpenModal] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [groupDesc, setGroupDesc] = useState('');
    const [groupParent, setGroupParent] = useState(null);
    const [errors, setErrors] = useState(null);
    const { showToast } = useToast();
    const api = useAPI();
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        if (openModal) {
            api.groups.getGroupsMinInfo().then((res) => {
                setGroups(res);
            });
        }
    }, [openModal]);
    const handleAccept = () => {
        api.groups.createGroup(groupName, groupDesc, groupParent).then((response) => {
            if (response.ok) {
                showToast(`${groupName}`, ToastTypes.SUCCESS, response.success);
                setGroupDesc('');
                setGroupName('');
                setGroupParent(null);
                setOpenModal(false);
                setErrors(null);
            } else if (response.errors) {
                setErrors(response.errors);
            }
        });
    };
    const handleDecline = () => {
        setOpenModal(false);
    };

    return (
        <>
            <Badge key={'createNewGroup'} icon={IoAdd} onClick={() => setOpenModal(true)} color={'success'} className={styles.newGroupButton}>
                Create Group
            </Badge>
            <Modal show={openModal} onClose={() => setOpenModal(false)} dismissible>
                <Modal.Header>Create a group</Modal.Header>
                <Modal.Body>
                    <div className="space-y-10">
                        <div className={styles.section}>
                            <div className="mb-2 block">
                                <Label htmlFor="groupName" value="Group name ( Required )" />
                            </div>
                            <TextInput
                                id={'groupName'}
                                type={'text'}
                                value={groupName}
                                placeholder="New group name"
                                required
                                onChange={(e) => {
                                    setGroupName(e.target.value);
                                }}
                            />
                            {errors?.name?.map((error, index) => (
                                <p key={index} className={styles.error}>
                                    {error}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className={styles.section}>
                        <div className="mb-2 block">
                            <Label htmlFor="description" value="Group description ( Required )" />
                        </div>
                        <Textarea
                            id="description"
                            value={groupDesc}
                            placeholder="Give a description for the new group"
                            required
                            rows={4}
                            className={styles.groupDesc}
                            onChange={(e) => {
                                setGroupDesc(e.target.value);
                            }}
                        />
                        {errors?.description?.map((error, index) => (
                            <p key={index} className={styles.error}>
                                {error}
                            </p>
                        ))}
                    </div>
                    <div className={styles.section}>
                        <div className="mb-2 block">
                            <Label htmlFor="groups" value="Parent Group ( Optional )" />
                        </div>
                        <Select id="groups" onChange={(e) => setGroupParent(e.target.value)} className={'bg-white'}>
                            <option key={'none'} value={null}>
                                None
                            </option>
                            {groups.map((group) => (
                                <option key={group.id} value={group.id}>
                                    {group.name}
                                </option>
                            ))}
                        </Select>
                        {errors?.parent?.map((error, index) => (
                            <p key={index} className={styles.error}>
                                {error}
                            </p>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleAccept} disabled={groupName.length === 0 || groupDesc.length === 0}>
                        Create
                    </Button>
                    <Button color="gray" onClick={handleDecline}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

const styles = {
    newGroupButton: 'px-6 py-3 rounded-lg cursor-pointer hover:scale-110 transition-transform duration-300 w-5/12 md:w-full mr-auto',
    groupDesc: 'p-2 bg-white',
    error: 'bold text-red-400 px-1',
    section: 'max-w-full mb-4',
};

export default NewGroupModal;
