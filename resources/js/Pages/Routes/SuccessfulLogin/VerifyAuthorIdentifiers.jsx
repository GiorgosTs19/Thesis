import React, { useState } from 'react';
import { Button, Card, Label, TextInput } from 'flowbite-react';
import { OpenAlexSVG } from '@/SVGS/OpenAlexSVG.jsx';
import { ScopusSVG } from '@/SVGS/ScopusSVG.jsx';
import { OrcidSVG } from '@/SVGS/OrcidSVG.jsx.jsx';
import useAPI from '@/Hooks/useAPI/useAPI.js';
import { Author } from '@/Models/Author/Author.js';
import AuthorsList from '@/Pages/Routes/SuccessfulLogin/AuthorsList.jsx';

const OpenAlexExample = 'A0123456789';
const OrcIdExample = '0123-0123-0123-0123';
const ScopusExample = '012345678901';
const VerifyAuthorIdentifiers = () => {
    const [result, setResult] = useState([]);
    const [error, setError] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const api = useAPI();

    const [ids, setIds] = useState({
        orc_id: '',
        open_alex: '',
        scopus: '',
    });

    const clear = () => {
        setIds({
            orc_id: '',
            open_alex: '',
            scopus: '',
        });
    };

    const handleChangeOpenAlex = (e) => {
        setIds({
            ...ids,
            open_alex: e.target.value,
        });
    };
    const handleChangeOrcID = (e) => {
        setIds({
            ...ids,
            orc_id: e.target.value,
        });
    };

    const handleChangeScopus = (e) => {
        setIds({
            ...ids,
            scopus: e.target.value,
        });
    };

    const handleSubmit = () => {
        api.search.searchAuthorsByIdentifiers(ids).then((res) => {
            if (!res.length) {
                setError('No authors were found with the provided identifiers.');
                return;
            }
            setResult(res.map(Author.parseResponseAuthor));
            setShowResults(true);
        });
    };

    const handleBack = () => {
        setShowResults(false);
        clear();
    };

    return (
        <Card className={'mx-auto my-auto w-10/12 md:w-7/12 lg:w-4/12'}>
            {!showResults && (
                <div className={'flex flex-col gap-5'}>
                    <h5 className={'text-center text-lg'}>Welcome to MyPubsV2</h5>
                    <div className={'text-center text-sm'}>
                        {/* eslint-disable-next-line react/no-unescaped-entities */}
                        To ensure seamless access to our platform's resources and optimize your experience, it is essential that you provide one of the following unique identifiers to build your
                        profile.
                    </div>
                    <div>
                        <Label htmlFor="OpenAlex" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                            OpenAlex
                        </Label>
                        <div className="relative">
                            <TextInput
                                icon={OpenAlexSVG}
                                id="OpenAlex"
                                value={ids.open_alex}
                                placeholder="OpenAlex"
                                onChange={handleChangeOpenAlex}
                                disabled={!!(ids.scopus.length || ids.orc_id.length)}
                            />
                        </div>
                        <div className={'ml-2 mt-2 text-xs text-gray-500'}>e.g {OpenAlexExample}</div>
                    </div>
                    <div>
                        <Label htmlFor="Scopus" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                            Scopus
                        </Label>
                        <div className="relative">
                            <TextInput icon={ScopusSVG} id="Scopus" value={ids.scopus} placeholder="Scopus" onChange={handleChangeScopus} disabled={!!(ids.orc_id.length || ids.open_alex.length)} />
                        </div>
                        <div className={'ml-2 mt-2 text-xs text-gray-500'}>e.g {ScopusExample}</div>
                    </div>
                    <div>
                        <Label htmlFor="ORCID" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                            ORCID
                        </Label>
                        <div className="relative">
                            <TextInput
                                icon={OrcidSVG}
                                id="ORCID"
                                value={ids.orc_id}
                                // className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900"
                                placeholder="ORCID"
                                onChange={handleChangeOrcID}
                                disabled={!!(ids.scopus.length || ids.open_alex.length)}
                            />
                        </div>
                        <div className={'ml-2 mt-2 text-xs text-gray-500'}>e.g {OrcIdExample}</div>
                    </div>
                    <Button className={'mx-auto'} onClick={handleSubmit}>
                        Submit
                    </Button>
                </div>
            )}
            {showResults && (
                <div className={'flex flex-col gap-5'}>
                    <Button className={'mx-auto mb-5'} onClick={handleBack}>
                        Back
                    </Button>
                    <AuthorsList authors={result} />
                </div>
            )}
        </Card>
    );
};

export default VerifyAuthorIdentifiers;
