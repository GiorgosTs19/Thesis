import React, {useState} from 'react';
import {Navigation} from "../Navigation/Navigation.jsx";

SignUp.propTypes = {

};

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
const Options = {
    OpenAlex:'Open Alex',
    OrcId:'OrcId',
}

function SignUp(props) {
    const [selectedOption, setSelectedOption] = useState(Options.OpenAlex);
    const [inputValue, setInputValue] = useState('');
    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    const handleInputChange = (e) => {
        switch (selectedOption) {
            case Options.OpenAlex : {
                if(e.target.value.length > 11) break;
                setInputValue(e.target.value);
                break;
            }
            case Options.OrcId : {
                const { value, selectionStart } = e.target;

                // Check if the user pressed backspace
                const isBackspace = e.nativeEvent.inputType === 'deleteContentBackward';

                // Remove non-numeric characters
                const numericValue = value.replace(/[^0-9]/g, '');

                let formattedValue = '';

                // Handle OrcId format
                if (selectedOption === Options.OrcId) {
                    // Insert a dash after every 4 characters
                    formattedValue = numericValue.replace(/(.{4})/g, '$1-');
                } else {
                    formattedValue = numericValue;
                }

                // Limit the length to 19 characters (including dashes for OrcId)
                formattedValue = formattedValue.slice(0, 19);

                // Set the input value
                setInputValue(formattedValue);

                // Move the cursor position after the dash when the user presses backspace
                if (isBackspace && selectedOption === Options.OrcId && selectionStart % 5 === 0) {
                    e.target.setSelectionRange(selectionStart - 1 , selectionStart - 1);
                }
            }
        }
        // Update input value, but prevent changes to the 'A' portion when Open Alex is selected

    };
    const error = () => {
        switch (selectedOption) {
            case Options.OpenAlex : {
                return inputValue.length ? inputValue[0] !== 'A' && 'Open Alex Author Ids always start with a latin A' : ''
            }
            case Options.OrcId : {
                return;
            }
        }
    }
    return (
        <div className="min-h-full">
            <Navigation/>
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Sign Up</h1>
                </div>
            </header>
            <div className="mt-8 w-full max-w-md p-6 bg-white rounded-md shadow-md m-auto">
                <div className="flex items-center mb-4">
                    <label
                        className={`cursor-pointer relative text-gray-700 mr-2 transition duration-300 py-1 px-2 rounded-md flex-nowrap flex-1 text-center ${
                            selectedOption === Options.OpenAlex ? 'bg-sky-300' : ''
                        }`}
                    >
                        Open Alex
                        <div className="absolute inset-0 bg-blue-500 opacity-0 transition duration-300 transform scale-x-0"></div>
                        <input
                            type="radio"
                            id="option1"
                            name="radio-group"
                            className="hidden"
                            checked={selectedOption === Options.OpenAlex}
                            onChange={() => handleOptionChange(Options.OpenAlex)}
                        />
                    </label>

                    <label
                        className={`cursor-pointer relative text-gray-700 transition duration-300 py-1 px-2 rounded-md flex-1 text-center ${
                            selectedOption === Options.OrcId ? 'bg-sky-300' : ''
                        }`}
                    >
                        OrcId
                        <div className="absolute inset-0 bg-blue-500 opacity-0 transition duration-300 transform scale-x-0"></div>
                        <input
                            type="radio"
                            id="option2"
                            name="radio-group"
                            className="hidden"
                            checked={selectedOption === Options.OrcId}
                            onChange={() => handleOptionChange(Options.OrcId)}
                        />
                    </label>
                </div>

                {selectedOption && (
                    <div className="mb-4 text-center">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Provide your {selectedOption} Id</label>
                        <input
                            type="text"
                            className="w-full py-2 px-3 text-gray-700 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                            placeholder={`Example Id : ${selectedOption === Options.OpenAlex ? 'A0123456789' : '0123-4567-8901-2345'}`}
                            value={inputValue}
                            onChange={handleInputChange}
                        />
                        <div className={'text-red-600 mt-4 text-sm font-light'}>{error()}</div>
                        <div className={'font-light mt-5 text-sm text-zinc-500'}>
                            Your information will be automatically retrieved once you provide a valid {selectedOption} Id
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SignUp;
