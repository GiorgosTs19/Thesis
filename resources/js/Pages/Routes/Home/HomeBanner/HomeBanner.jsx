import React from "react";
import {WorksSVG} from "@/SVGS/WorksSVG.jsx";
import {AuthorSVG} from "@/SVGS/AuthorSVG.jsx";
import {arrayOf, number, shape, string} from "prop-types";
import {capitalizeFirstLetter} from "@/Utility/Strings/Utils.js";
import {OrcidSVG} from "@/SVGS/OrcidSVG.jsx.jsx";
import {OpenAlexSVG} from "@/SVGS/OpenAlexSVG.jsx";
import {ScopusSVG} from "@/SVGS/ScopusSVG.jsx";
import {CheckGearSVG} from "@/SVGS/CheckGearSVG.jsx";
import clsx from "clsx";
import {Card} from "flowbite-react";

const styles = {
    wrapperDiv: 'col-span-3 lg:col-span-1 flex flex-col text-center h-full',
    card: 'shadow-xl h-full',
    image: 'mx-auto mb-4',
    text: 'text-gray-500 font-bold truncate whitespace-pre-wrap mx-auto md:w-9/12 xl:w-7/12 text-sm lg:text-base',
    outerGrid: 'grid grid-cols-3 gap-6 lg:gap-8 mb-8',
    propertiesWrapper: 'flex flex-wrap gap-10 m-auto py-7 text-center flex px-4 rounded-3xl',
    propertyWrapper: 'flex-grow flex text-center mx-auto',
    propertyValue: 'text-black text-2xl lg:text-3xl xxl:text-5xl font-bold mx-auto',
    propertyName: 'text-gray-600 text-sm lg:text-lg mx-auto',
    header: 'text-xl md:text-2xl xl:text-3xl text-gray-500 mb-4 italic focus:ring-0',
    button: 'p-4 rounded-xl border border-gray-200 bg-gray-200 hover:bg-gray-100 mt-5 w-fit mx-auto'
}
const HomeBanner = ({worksByType}) => {
    return <>
        <div className={styles.outerGrid}>
            <div className={clsx(styles.wrapperDiv)}>
                <Card className={styles.card}>
                    <AuthorSVG width={64} height={64} className={styles.image}/>
                    <div className={styles.text}>
                        Explore a vast collection of renowned authors. Uncover insights,
                        and statistical data for each literary figure
                    </div>
                    <button className={styles.button}>
                        Explore Authors
                    </button>
                </Card>
            </div>
            <div className={clsx(styles.wrapperDiv, 'order-first lg:order-none')}>
                <Card className={styles.card}>
                    <div className={styles.header}>
                        Discover notable authors and their literary works
                    </div>
                    <div className={styles.propertiesWrapper}>
                        {
                            worksByType.map(({type, count}) => <div key={type}
                                                                    className={styles.propertyWrapper}>
                                    <div className={'mx-auto'}>
                                        <p className={styles.propertyValue}>
                                            {count}
                                        </p>
                                        <p className={styles.propertyName}>
                                            {`${capitalizeFirstLetter(type)}s`}
                                        </p>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </Card>
            </div>
            <div className={clsx(styles.wrapperDiv, 'order-3 lg:order-3')}>
                <Card className={styles.card}>
                    <WorksSVG width={64} height={64} className={styles.image}/>
                    <div className={styles.text}>
                        Search through an extensive catalog of papers, discover details about each piece,
                        and explore statistical analyses. A comprehensive experience for
                        literature enthusiasts
                    </div>
                    <button className={styles.button}>
                        Explore Works
                    </button>
                </Card>
            </div>
        </div>
        <div className={'flex flex-col mt-6'}>
            {/*<NewUserSVG width={64} height={64} className={'mx-auto'}/>*/}
            {/*<div className={clsx(styles.text, 'text-center mb-10 text-lg lg:text-xl')}>*/}
            {/*    Calling all authors! Elevate your presence by registering on our platform.*/}
            {/*</div>*/}
            <div className={styles.outerGrid}>
                <div className={styles.wrapperDiv}>
                    <Card className={styles.card}>
                        <div
                            className={'mx-auto text-lg lg:text-3xl border border-gray-300 rounded-full py-4 px-6 mb-4'}>
                            1
                        </div>
                        <div className={styles.text}>
                            Kickstart your journey by creating an account on our platform. It is the first step to
                            boosting
                            your
                            authorial presence.
                        </div>
                        <a className={'text-blue-700 text-xl p-4 hover:underline hover:text-blue-500 cursor-pointer mt-5'}>
                            Create an account
                        </a>
                    </Card>
                </div>
                <div className={styles.wrapperDiv}>
                    <Card className={styles.card}>
                        <div
                            className={'mx-auto text-lg lg:text-3xl border border-gray-300 rounded-full py-4 px-6 mb-4'}>
                            2
                        </div>
                        <div className={styles.text}>
                            Tell us who you are by providing your unique identifiers, along with some essential details.
                            This
                            helps us tailor your profile.
                        </div>
                        <div className={'flex gap-4 mx-auto mt-7'}>
                            <OrcidSVG height={24} width={24}/>
                            <OpenAlexSVG height={24} width={24}/>
                            <ScopusSVG height={24} width={24}/>
                        </div>
                    </Card>
                </div>
                <div className={styles.wrapperDiv}>
                    <Card className={styles.card}>
                        <div
                            className={'mx-auto text-lg lg:text-3xl border border-gray-300 rounded-full py-4 px-6 mb-4'}>
                            3
                        </div>
                        <div className={styles.text}>
                            Once you have shared your info, leave the rest to us. We will smoothly gather your works
                            and build up your author profile hassle-free.
                        </div>
                        <CheckGearSVG width={56} height={56} className={'mx-auto mt-4'}/>
                    </Card>
                </div>
            </div>
        </div>
    </>
}

HomeBanner.propTypes = {
    worksByType: arrayOf(shape({
        type: string.isRequired,
        count: number.isRequired
    }))
}
export default HomeBanner;
