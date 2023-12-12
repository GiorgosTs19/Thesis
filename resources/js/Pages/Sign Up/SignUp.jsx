import React, {useEffect, useState} from 'react';
import {Navigation} from "../../Components/Navigation/Navigation.jsx";
import ExtendedInput from "../../Components/ExtendedInput/ExtendedInput.jsx";
import {useForm} from "@inertiajs/inertia-react";

SignUp.propTypes = {

};

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
const Options = {
    OpenAlex: {name:'Open Alex', value:'open_alex', allowedLength : 10},
    OrcId:{name:'OrcId', value:'orc_id', allowedLength : 19}
}
const placeholders = {
    OpenAlex:'0123456789',
    OrcId:'0123-4567-8901-2345',
}

function SignUp(props) {
    const { data, setData, get, processing, errors} = useForm({
        authorId:'',id_type:Options.OpenAlex.value
    });
    const [selectedIdType,setSelectedIdType] = useState(Options.OpenAlex.value);
    const [authorId,setAuthorId] = useState('');

    const [author, setAuthor] = useState({value:undefined,exists:false});
    const handleOptionChange = (option) => {
        setSelectedIdType(option);
        setData({...data,idType:option});
    };

    useEffect(() => {
        setData({...data, authorId: ''});
        setAuthorId('');
    }, [selectedIdType]);


    const handleInputChange = (e) => {
        let id = '';
        switch (data.id_type) {
            case Options.OpenAlex.value : {
                if(e.target.value.length > Options.OpenAlex.allowedLength) return;
                id = e.target.value.replace(/[^0-9]/g, '');
                break;
            }
            case Options.OrcId : {
                const { value, selectionStart } = e.target;

                const isBackspace = e.nativeEvent.inputType === 'deleteContentBackward';

                const numericValue = value.replace(/[^0-9]/g, '');

                let formattedValue = '';

                formattedValue = numericValue.replace(/(.{4})/g, '$1-');

                id = formattedValue = formattedValue.slice(0, Options.OrcId.allowedLength);

                if (isBackspace && selectionStart % 5 === 0) {
                    e.target.setSelectionRange(selectionStart-1, selectionStart-1);
                }
                break;
            }
        }
        setData({...data,authorId:id});
        setAuthorId(id);
    };
console.log(processing)
    useEffect(()=>{
        switch (data.id_type) {
            case Options.OpenAlex.value : {
                if(authorId.length !== Options.OpenAlex.allowedLength)
                    return;
                get(route('check_author_exists'),{
                    onSuccess:res=> {
                        const props = res.props;
                        setAuthor({value: props.author, exists: props.exists})
                    },
                    preserveState:true,preserveScroll:true
                });
                break;
            }
            case Options.OrcId.value : {
                if(authorId.length !== Options.OrcId.allowedLength)
                    return;
                break;
            }
        }
    },[authorId]);
    console.log(author)
    return (
        <div className="min-h-full">
            <Navigation/>
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Sign Up</h1>
                </div>
            </header>
            <div className="mt-8 w-full max-w-md px-6 pt-6 pb-0 bg-white rounded-md shadow-md m-auto flex flex-col">
                <div className="flex items-center mb-4">
                    <label className={`cursor-pointer relative text-gray-700 mr-2 transition duration-300 py-1 px-2 rounded-md flex-nowrap flex-1 text-center
                    ${selectedIdType === Options.OpenAlex.value ? 'bg-sky-300' : ''}`}>
                        Open Alex
                        <div className="absolute inset-0 bg-blue-500 opacity-0 transition duration-300 transform scale-x-0"></div>
                        <input
                            type="radio"
                            id="option1"
                            name="radio-group"
                            className="hidden"
                            checked={selectedIdType === Options.OpenAlex.value}
                            onChange={() => handleOptionChange(Options.OpenAlex.value)}
                        />
                    </label>

                    <label
                        className={`cursor-pointer relative text-gray-700 transition duration-300 py-1 px-2 rounded-md flex-1 text-center ${
                            selectedIdType === Options.OrcId.value ? 'bg-sky-300' : ''
                        }`}
                    >
                        OrcId
                        <div className="absolute inset-0 bg-blue-500 opacity-0 transition duration-300 transform scale-x-0"></div>
                        <input
                            type="radio"
                            id="option2"
                            name="radio-group"
                            className="hidden"
                            checked={selectedIdType === Options.OrcId.value}
                            onChange={() => handleOptionChange(Options.OrcId.value)}
                        />
                    </label>
                </div>

                {data.id_type && (
                    <div className="mb-4 text-center">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Provide your {Object.values(Options).find(item=>item.value === selectedIdType).name} Id</label>
                        <ExtendedInput value={authorId} onChange={handleInputChange} leadingElement={selectedIdType === Options.OpenAlex.value ? 'A -' : null}
                            placeholder={selectedIdType === Options.OpenAlex.value ? placeholders.OpenAlex : placeholders.OrcId} name={'Author_id'}
                                       containerClassName={'w-56 mx-auto'} inputClassName={'px-9'}
                                       leadingElementClassName={'font-bold text-gray-400'}
                        />
                        <div className={'font-light mt-5 text-sm text-zinc-500'} style={{textWrap:'balance'}}>
                            Your information will be automatically retrieved once you provide a valid {Object.values(Options).find(item=>item.value === selectedIdType).name} Id
                        </div>
                    </div>
                )}
                <div className={`mx-auto text-center ${author.value !== undefined ? 'opacity-100' : 'opacity-0'}`}>
                    <span className={'font-light text-sm text-zinc-500'}>{author.exists ? '1 result found' : 'No results were found.'}</span>
                    <div className={`mx-auto ${author.exists ? 'opacity-100' : 'opacity-0'}`}>{`${author.exists && ("Are you " + author.value.display_name + "?")}`}</div>
                </div>
                <div className={`mx-auto mb-4  ${processing ? 'opacity-100' : 'opacity-0'}`}>Fetching your information...</div>
            </div>
        </div>
    )
}

export default SignUp;
