import React from 'react';
import { WorksSVG } from '@/SVGS/WorksSVG.jsx';
import { AuthorSVG } from '@/SVGS/AuthorSVG.jsx';
import { arrayOf, object } from 'prop-types';
import clsx from 'clsx';
import { Card } from 'flowbite-react';
import { ScopusSVG } from '@/SVGS/ScopusSVG.jsx';
import { OpenAlexSVG } from '@/SVGS/OpenAlexSVG.jsx';
import { OrcidSVG } from '@/SVGS/OrcidSVG.jsx.jsx';
import { RiNumber1, RiNumber2, RiNumber3 } from 'react-icons/ri';
import List from '@/Components/List/List.jsx';
import { renderAuthorItem } from '@/Models/Author/Utils.jsx';
import { Author } from '@/Models/Author/Author.js';
import { renderWorkItem } from '@/Models/Work/Utils.jsx';
import { Work } from '@/Models/Work/Work.js';
import { useAuth } from '@/Hooks/useAuth/useAuth.jsx';

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
 * @param mostCitationsUsers - An array of author objects
 * @param mostWorksUsers - An array of author objects
 * @param mostCitationsWorks - An array of work objects
 * @returns The rendered HomeBanner component.
 */
const HomeBanner = ({ mostCitationsUsers, mostWorksUsers, mostCitationsWorks }) => {
    const { isLoggedIn } = useAuth();
    const renderWork = (work, index) =>
        renderWorkItem(
            work,
            index + 1,
            {
                type: true,
                oa: true,
                language: true,
            },
            { authors: true },
        );
    const renderProductivityAuthors = (author, index) => renderAuthorItem(author, index, { works: true, citations: false });
    const renderCitationsAuthors = (author, index) => renderAuthorItem(author, index, { works: false, citations: true });

    return (
        <>
            <div className={styles.outerGrid}>
                <div className={clsx(styles.wrapperDiv)}>
                    <div className={styles.card}>
                        <div className={'m-auto'}>
                            <AuthorSVG width={64} height={64} className={styles.image} />
                            <div className={styles.text}>Explore a vast collection of renowned authors. Uncover insights, and statistical data for each literary figure.</div>
                        </div>
                    </div>
                    <div className={clsx('flex flex-col gap-5 md:flex-row', styles.listWrapper)}>
                        <List
                            data={mostWorksUsers}
                            renderFn={renderProductivityAuthors}
                            vertical
                            title={'Top Users by Productivity ( Works )'}
                            parser={Author.parseResponseAuthor}
                            wrapperClassName={styles.list}
                            rounded
                        />

                        <List
                            data={mostCitationsUsers}
                            renderFn={renderCitationsAuthors}
                            vertical
                            title={'Top Users by Citations'}
                            parser={Author.parseResponseAuthor}
                            wrapperClassName={styles.list}
                            rounded
                        />
                    </div>
                </div>
                <div className={clsx(styles.wrapperDiv, 'order-3 xl:order-3')}>
                    <div className={styles.card}>
                        <div className={'m-auto'}>
                            <WorksSVG width={64} height={64} className={styles.image} />
                            <div className={styles.text}>Search through an extensive catalog of papers, discover details about each piece, and explore statistical analyses.</div>
                        </div>
                    </div>
                    <div className={styles.listWrapper}>
                        <List data={mostCitationsWorks} renderFn={renderWork} vertical title={'Most Cited Works'} parser={Work.parseResponseWork} wrapperClassName={styles.list} rounded />
                    </div>
                </div>
            </div>
            <div className={clsx(styles.timelineWrapper, isLoggedIn ? 'invisible' : '')}>
                <Card className={styles.timeLineCard}>
                    <div className={styles.timeLineCardInnerContainer}>
                        <RiNumber1 className={styles.timelineStepNumber} />
                        <div className={styles.timelineText}>Kickstart your journey by logging in to our platform.</div>
                    </div>
                </Card>
                <Card className={styles.timeLineCard}>
                    <div className={styles.timeLineCardInnerContainer}>
                        <RiNumber2 className={styles.timelineStepNumber} />
                        <div className={'flex w-full flex-col'}>
                            <div className={styles.timelineText}>Tell us who you are by providing one of your unique identifiers.</div>
                            <div className={'mx-auto mt-2 flex gap-4'}>
                                <OrcidSVG height={24} width={24} />
                                <OpenAlexSVG height={24} width={24} />
                                <ScopusSVG height={24} width={24} />
                            </div>
                        </div>
                    </div>
                </Card>
                <Card className={styles.timeLineCard}>
                    <div className={styles.timeLineCardInnerContainer}>
                        <RiNumber3 className={styles.timelineStepNumber} />
                        <div className={styles.timelineText}>Once you have shared your info, leave the rest to us. We will seamlessly fetch your works and build your profile.</div>
                    </div>
                </Card>
            </div>
        </>
    );
};

const styles = {
    wrapperDiv: 'col-span-3 flex flex-col xl:flex-row text-center h-full min-h-96',
    statistics: 'col-span-3 flex flex-col text-center h-full',
    card: 'shadow-lg border border-gray-200 rounded-xl h-full w-full xl:w-5/12 p-3 flex',
    timeLineCard: 'w-full mx-auto border border-gray-200',
    timeLineCardInnerContainer: 'w-full text-center flex gap-3',
    statisticsCard: 'shadow-lg h-full w-full xl:w-4/12 mx-auto',
    list: 'h-full shadow-lg bg-card border border-gray-200 text-left w-full ',
    listWrapper: 'mt-10 xl:mt-0 xl:ml-10 w-full',
    image: 'mx-auto mb-4',
    text: 'text-accent truncate whitespace-pre-wrap mx-auto text-sm lg:text-base xl:text-lg 4xl:text-2xl italic',
    outerGrid: 'grid grid-cols-3 gap-6 lg:gap-8 xl:gap-10 mb-8 space-y-12',
    propertiesWrapper: 'flex flex-wrap gap-10 m-auto py-1 text-center flex px-4 rounded-3xl',
    propertyWrapper: 'flex-grow flex text-center mx-auto',
    propertyValue: 'text-black text-2xl lg:text-3xl xxl:text-5xl font-bold mx-auto',
    propertyName: 'text-yellow-800 text-sm lg:text-lg mx-auto',
    header: 'text-xl md:text-2xl xl:text-3xl text-gray-500 mb-4 italic focus:ring-0',
    button: 'px-4 py-2 rounded-xl border border-gray-200 bg-gray-200 mt-5 w-fit mx-auto',
    activeButton: 'hover:bg-gray-100',
    disabledButton: 'opacity-50',
    timelineText: 'text-accent font-bold truncate whitespace-pre-wrap mx-auto md:w-9/12 xl:w-7/12 text-sm lg:text-base 4xl:text-xl  flex flex-col text-center',
    timelineWrapper: 'flex flex-col xl:flex-row gap-5 w-full mt-20',
    timelineStepNumber: 'my-auto text-2xl',
    banner: 'text-center mt-20 mb-3 rounded-xl col-span-5',
    bannerInnerContainer: 'flex flex-col justify-between rounded-lg border-t-0 border border-background shadow-lg rounded-t-none bg-accent p-4 md:flex-row w-fit mx-auto',
    bannerTextContainer: 'mb-3 mr-4 flex flex-col items-start md:mb-0 md:flex-row md:items-center',
    bannerButtonContainer: 'flex flex-shrink-0 items-center',
    bannerText: 'flex items-center text-xl 4xl:text-2xl font-normal text-background',
};

HomeBanner.propTypes = {
    mostCitationsUsers: arrayOf(object),
    mostWorksUsers: arrayOf(object),
    mostCitationsWorks: arrayOf(object),
};
export default HomeBanner;
