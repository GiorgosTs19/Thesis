import React from "react";
import {WorksSVG} from "@/SVGS/WorksSVG.jsx";
import {AuthorSVG} from "@/SVGS/AuthorSVG.jsx";
import {arrayOf, number, shape, string} from "prop-types";
import {capitalizeFirstLetter} from "@/Utility/Strings/Utils.js";
import clsx from "clsx";
import {Card} from "flowbite-react";
import {ScopusSVG} from "@/SVGS/ScopusSVG.jsx";
import {OpenAlexSVG} from "@/SVGS/OpenAlexSVG.jsx";
import {OrcidSVG} from "@/SVGS/OrcidSVG.jsx.jsx";
import './styles.css'
import {RiNumber1, RiNumber2, RiNumber3} from "react-icons/ri";
import List from "@/Components/List/List.jsx";
import {renderAuthorItem} from "@/Models/Author/Utils.jsx";
import {Author} from "@/Models/Author/Author.js";
import {renderWorkItem} from "@/Models/Work/Utils.jsx";
import {Work} from "@/Models/Work/Work.js";

/**
 * HomeBanner Component
 *
 * A component representing the home page banner with sections for exploring authors and works,
 * along with a step-by-step guide for users to kickstart their journey on the platform.
 *
 * @component
 * @example
 * <HomeBanner worksByType={worksByType} />
 *
 * @param {Array} worksByType - An array of objects representing different types of works and their counts.
 * @returns The rendered HomeBanner component.
 */
const HomeBanner = ({worksByType, mostWorksAuthors, mostWorksUsers, mostCitationsWorks}) => {
    return <>
        <div className={styles.outerGrid}>
            <div className={clsx(styles.statistics, 'order-first xl:order-none')}>
                <Card className={styles.statisticsCard}>
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
            <div className={clsx(styles.wrapperDiv)}>
                <div className={styles.card}>
                    <div className={'m-auto'}>
                        <AuthorSVG width={64} height={64} className={styles.image}/>
                        <div className={styles.text}>
                            Explore a vast collection of renowned authors. Uncover insights,
                            and statistical data for each literary figure.
                        </div>
                        <button className={clsx(styles.button, styles.disabledButton)} disabled>
                            Explore Authors
                        </button>
                    </div>
                </div>
                <div className={'flex flex-col md:flex-row gap-5 mt-10 xl:mt-0 xl:ml-10 w-full'}>
                    <List data={mostWorksAuthors} renderFn={renderAuthorItem} vertical
                          title={'Top Authors by Prolificacy'} parser={Author.parseResponseAuthor}
                          wrapperClassName={'w-full'}/>

                    <List data={mostWorksUsers} renderFn={renderAuthorItem} vertical
                          title={'Top Users by Prolificacy'} parser={Author.parseResponseAuthor}
                          wrapperClassName={'w-full'}/>
                </div>
            </div>
            <div className={clsx(styles.wrapperDiv, 'order-3 xl:order-3')}>
                <div className={styles.card}>
                    <div className={'m-auto'}>
                        <WorksSVG width={64} height={64} className={styles.image}/>
                        <div className={styles.text}>
                            Search through an extensive catalog of papers, discover details about each piece,
                            and explore statistical analyses.
                        </div>
                        <button className={clsx(styles.button, styles.disabledButton)} disabled>
                            Explore Works
                        </button>
                    </div>
                </div>
                <div className={'w-full mt-10 xl:mt-0 xl:ml-10'}>
                    <List data={mostCitationsWorks} renderFn={renderWorkItem}
                          title={'Most Cited Works: A Citation Powerhouse'} parser={Work.parseResponseWork}
                          wrapperClassName={'h-full'}/>
                </div>
            </div>
        </div>
        <div className={'flex flex-col xl:flex-row gap-5 w-full mt-10'}>
            <Card className={'w-full mx-auto bg-transparent'}>
                <div className={'w-full text-center flex gap-3'}>
                    <RiNumber1 className={'my-auto text-2xl'}/>
                    <div className={'w-full flex flex-col gap-4'}>
                        <div>
                            Kickstart your journey by creating an account on our platform.
                        </div>
                        <a className={'text-blue-700 text-xl hover:underline hover:text-blue-500 cursor-pointer'}>
                            Create an account
                        </a>
                    </div>
                </div>
            </Card>
            <Card className={'w-full mx-auto text-center bg-transparent'}>
                <div className={'w-full text-center flex gap-3'}>
                    <RiNumber2 className={'my-auto text-2xl'}/>
                    <div className={'w-full flex flex-col'}>
                        <div>
                            Tell us who you are by providing your unique identifiers, along with some essential
                            details.
                        </div>
                        <div className={'flex gap-4 mx-auto mt-2'}>
                            <OrcidSVG height={24} width={24}/>
                            <OpenAlexSVG height={24} width={24}/>
                            <ScopusSVG height={24} width={24}/>
                        </div>
                    </div>
                </div>
            </Card>
            <Card className={'w-full mx-auto text-center flex bg-transparent'}>
                <div className={'w-full text-center flex gap-3'}>
                    <RiNumber3 className={'my-auto text-2xl'}/>
                    <div className={'w-full flex flex-col'}>
                        <div>
                            Once you have shared your info, leave the rest to us.
                            We will seamlessly fetch your works and build your profile.
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    </>
}

const styles = {
    wrapperDiv: 'col-span-3 flex flex-col xl:flex-row text-center h-full ',
    statistics: 'col-span-3 flex flex-col text-center h-full',
    card: 'shadow-lg h-full w-full xl:w-8/12 p-3 flex',
    statisticsCard: 'shadow-lg h-full w-full',
    image: 'mx-auto mb-4',
    text: 'text-gray-500 truncate whitespace-pre-wrap mx-auto md:w-9/12 xl:w-7/12 text-sm lg:text-base italic',
    outerGrid: 'grid grid-cols-3 gap-6 lg:gap-8 mb-8',
    propertiesWrapper: 'flex flex-wrap gap-10 m-auto py-7 text-center flex px-4 rounded-3xl',
    propertyWrapper: 'flex-grow flex text-center mx-auto',
    propertyValue: 'text-black text-2xl lg:text-3xl xxl:text-5xl font-bold mx-auto',
    propertyName: 'text-gray-600 text-sm lg:text-lg mx-auto',
    header: 'text-xl md:text-2xl xl:text-3xl text-gray-500 mb-4 italic focus:ring-0',
    button: 'px-4 py-2 rounded-xl border border-gray-200 bg-gray-200 mt-5 w-fit mx-auto',
    activeButton: 'hover:bg-gray-100',
    disabledButton: 'opacity-50',
    timelineText: 'text-gray-500 font-bold truncate whitespace-pre-wrap mx-auto md:w-9/12 xl:w-7/12 text-sm flex flex-col text-center'
}

HomeBanner.propTypes = {
    worksByType: arrayOf(shape({
        type: string.isRequired,
        count: number.isRequired
    }))
}
export default HomeBanner;