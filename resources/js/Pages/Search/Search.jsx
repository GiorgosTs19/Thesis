import React, {useEffect, useState} from 'react';
import {useForm} from "@inertiajs/inertia-react";
import {Navigation} from "../../Components/Navigation/Navigation.jsx";
import ExtendedInput from "../../Components/ExtendedInput/ExtendedInput.jsx";

Search.propTypes = {};

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const Options = {
    OpenAlex: {
        name: 'Open Alex',
        value: 'open_alex',
        allowedLength: 10,
        allowedAssets: [{value: 1, label: 'Author'}, {value: 2, label: 'Work'}]
    },
    OrcId: {name: 'OrcId', value: 'orc_id', allowedLength: 19, allowedAssets: [{value: 1, label: 'Author'}]}
}
const placeholders = {
    OpenAlex: '0123456789',
    OrcId: '0123-4567-8901-2345',
}


function Search() {
    const [selectedIdType, setSelectedIdType] = useState(Options.OpenAlex.value);
    const [selectedAssetType, setSelectedAssetType] = useState(1);
    const [assetId, setAssetId] = useState('');

    const {data, setData, get, processing, errors} = useForm({
        asset_id: assetId, id_type: selectedIdType, asset_type: 1
    });

    const [asset, setAsset] = useState({value: undefined, exists: false});
    const handleOptionChange = (option) => {
        setSelectedIdType(option);
        setData({...data, id_type: option});
    };

    useEffect(() => {
        setData({...data, asset_id: '', asset_type: 1});
        setAsset({exists: false, value: undefined})
        setAssetId('');
    }, [selectedIdType]);

    const handleSelectChange = (e) => {
        setSelectedAssetType(e.target.value);
        setData({...data, asset_type: e.target.value});
    };

    const handleInputChange = (e) => {
        let id = '';
        switch (selectedIdType) {
            case Options.OpenAlex.value : {
                if (e.target.value.length > Options.OpenAlex.allowedLength) return;
                id = e.target.value.replace(/[^0-9]/g, '');
                break;
            }
            case Options.OrcId.value : {
                const {value, selectionStart} = e.target;

                const isBackspace = e.nativeEvent.inputType === 'deleteContentBackward';

                const numericValue = value.replace(/[^0-9]/g, '');


                const formattedValue = numericValue.replace(/(.{4})/g, '$1-');

                id = formattedValue.slice(0, Options.OrcId.allowedLength);

                if (isBackspace && selectionStart % 5 === 0) {
                    e.target.setSelectionRange(selectionStart - 1, selectionStart - 1);
                }
                break;
            }
        }
        setData({...data, asset_id: id});
        setAssetId(id);
    };

    useEffect(() => {
        switch (selectedIdType) {
            case Options.OpenAlex.value : {
                if (assetId.length !== Options.OpenAlex.allowedLength)
                    return;
                get(route('check_author_exists'), {
                    onStart: () => {
                        console.log(data)
                    },
                    onSuccess: res => {
                        const props = res.props;
                        setAsset({value: props.asset, exists: props.exists, asset_type: props.asset_type})
                    },
                    preserveState: true, preserveScroll: true
                });
                break;
            }
            case Options.OrcId.value : {
                if (assetId.length !== Options.OrcId.allowedLength)
                    return;
                get(route('check_author_exists'), {
                    onStart: () => {
                        console.log(data)
                    },
                    onSuccess: res => {
                        const props = res.props;
                        setAsset({value: props.asset, exists: props.exists, asset_type: props.asset_type})
                    },
                    preserveState: true, preserveScroll: true
                });
                break;
            }
        }
    }, [assetId]);


    return (
        <div className="min-h-full">
            <Navigation/>
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Search</h1>
                </div>
            </header>
            <div className="mt-8 w-full max-w-xs px-6 pt-6 pb-0 bg-white rounded-md shadow-md m-auto flex flex-col">
                <div className="flex items-center mb-4">
                    <label className={`cursor-pointer relative text-gray-700 mr-2 transition duration-300 py-1 px-2 rounded-md flex-nowrap flex-1 text-center align-middle
                    ${selectedIdType === Options.OpenAlex.value ? 'bg-sky-300' : ''}`}>
                        Open Alex
                        <div
                            className="absolute inset-0 bg-blue-500 opacity-0 transition duration-300 transform scale-x-0"></div>
                        <input
                            type="radio"
                            id="open_alex"
                            name="id_type"
                            className="hidden"
                            checked={selectedIdType === Options.OpenAlex.value}
                            onChange={() => handleOptionChange(Options.OpenAlex.value)}
                        />
                    </label>

                    <label
                        className={`cursor-pointer relative text-gray-700 transition duration-300 py-1 px-2 rounded-md flex-1 text-center ${
                            selectedIdType === Options.OrcId.value ? 'bg-sky-300' : ''}`}>
                        OrcId
                        <div
                            className="absolute inset-0 bg-blue-500 opacity-0 transition duration-300 transform scale-x-0"></div>
                        <input
                            type="radio"
                            id="orc_id"
                            name="id_type"
                            className="hidden"
                            checked={selectedIdType === Options.OrcId.value}
                            onChange={() => handleOptionChange(Options.OrcId.value)}
                        />
                    </label>
                </div>

                {selectedIdType && (
                    <div className="mb-4 text-center">
                        <label
                            className="block font-light mt-5 text-sm text-zinc-500 mb-2">Provide {`${selectedAssetType === 1 ? 'an' : 'a'}  ${Object.values(Options).find(item => item.value === selectedIdType).name}`} Id</label>
                        <ExtendedInput value={assetId} onChange={handleInputChange}
                                       leadingElement={selectedIdType === Options.OpenAlex.value ? 'children' : null}
                                       placeholder={selectedIdType === Options.OpenAlex.value ? placeholders.OpenAlex : placeholders.OrcId}
                                       name={'asset_id'}
                                       containerClassName={'w-56 mx-auto'}
                                       inputClassName={selectedIdType === Options.OpenAlex.value ? 'pl-28' : 'px-8'}
                                       leadingElementClassName={'font-bold text-gray-400'}
                        >
                            <select id="asset_type" name="asset_type" className="h-full rounded-md border-0 bg-transparent py-0 px-2 text-gray-500
                                focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                                    value={selectedAssetType} onChange={handleSelectChange}>
                                <option key={1} value={1}>Author</option>
                                <option key={2} value={2}>Work</option>
                            </select>
                        </ExtendedInput>
                    </div>
                )}
                <div className={`mx-auto text-center ${asset.value !== undefined ? 'opacity-100' : 'opacity-0'}`}>
                    <span
                        className={'font-light text-sm text-zinc-500 px'}>{asset.exists ? '1 result found' : 'No results were found.'}</span>
                    <div
                        className={`mx-auto ${asset.exists ? 'opacity-100' : 'opacity-0'}`}>{`${asset.exists && asset.value.display_name}`}</div>
                </div>
                <div className={`mx-auto my-4  ${processing ? 'opacity-100' : 'opacity-0'}`}>Fetching asset's
                    information...
                </div>
            </div>
        </div>
    )
}

export default Search;
