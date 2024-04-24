import React, {useState} from 'react'
import {Card} from "flowbite-react";
import {OpenAlexSVG} from "@/SVGS/OpenAlexSVG.jsx";
import {ScopusSVG} from "@/SVGS/ScopusSVG.jsx";
import {OrcidSVG} from "@/SVGS/OrcidSVG.jsx.jsx";

const OpenAlexPattern = /^A\d+$/;
const OrcIdPattern = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
const ScopusPattern = /^\d+$/;
const OpenAlexError = 'The provided id does not match the expected format (A0123456789).';
const OrcIdError = 'The provided id does not match the expected format. (0123-0123-0123-0123).';
const ScopusError = 'The provided id does not match the expected format. (012345678901)';
const VerifyAuthorIdentifiers = ({}) => {
    const [ids, setIds] = useState({
        ORCID: {
            value:'',
            error:null,
        },
        OPENALEX: {
            value:'',
            error:null,
        },
        SCOPUS: {
            value:'',
            error:null,
        }
    });

    console.log('🚀 ~ ',ids)
    const handleChangeOpenAlex = (e) => {
        setIds({
            ...ids, OPENALEX: {
                value:e.target.value,
                error: !OpenAlexPattern.test(e.target.value) && e.target.value.length > 9
            }
        })
    }
    const handleChangeOrcID = (e) => {
        setIds({
            ...ids, ORCID: {
                value:e.target.value,
                error: !OrcIdPattern.test(e.target.value) && e.target.value.length > 15
            }
        })
    }
    const handleChangeScopus = (e) => {
        setIds({
            ...ids, SCOPUS: {
                value:e.target.value,
                error: !ScopusPattern.test(e.target.value) && e.target.value.length > 8
            }
        })
    }

    return <Card className={'my-auto w-10/12 md:w-7/12 lg:w-4/12 mx-auto'}>
        <div className={'flex flex-col gap-5'}>
            <h5 className={'text-center text-lg'}>Welcome to MyPubsV2</h5>
            <div className={'text-center'}>
                To ensure seamless access to our platform's resources and optimize your experience,
                it is essential that you provide one ( or more ) of the following unique identifiers:
                OpenAlex ID, ORCID ID, or Scopus ID. These identifiers will be used to build your profile.
            </div>
            <div>
                <label htmlFor="OpenAlex"
                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">OpenAlex</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                        <OpenAlexSVG/>
                    </div>
                    <input type="text" id="OpenAlex" value={ids.OPENALEX.value}
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5 "
                           placeholder="OpenAlex" onChange={handleChangeOpenAlex}/>
                </div>
                <div className={'text-red-400'}>
                    {ids.OPENALEX.error && OpenAlexError}
                </div>
            </div>
            <div>
                <label htmlFor="Scopus"
                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Scopus</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                        <ScopusSVG/>
                    </div>
                    <input type="text" id="Scopus" value={ids.SCOPUS.value}
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5"
                           placeholder="Scopus" onChange={handleChangeScopus}/>
                </div>
                <div className={'text-red-400'}>
                    {ids.SCOPUS.error && ScopusError}
                </div>
            </div>
            <div>
                <label htmlFor="ORCID"
                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ORCID</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                        <OrcidSVG/>
                    </div>
                    <input type="text" id="ORCID" value={ids.ORCID.value}
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5"
                           placeholder="ORCID" onChange={handleChangeOrcID}/>
                </div>
                <div className={'text-red-400'}>
                    {ids.ORCID.error && OrcIdError}
                </div>
            </div>
        </div>
    </Card>
}

export default VerifyAuthorIdentifiers;
