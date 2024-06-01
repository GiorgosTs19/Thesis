import React from 'react';
import { array, arrayOf, number, shape, string } from 'prop-types';
import Search from '@/Components/Search/Search.jsx';
import HomeBanner from '@/Pages/Routes/Home/HomeBanner/HomeBanner.jsx';
import logo from '@images/ThesisLogo.png';

const HomePage = ({ mostCitationsUsers, mostWorksUsers, mostCitationsWorks }) => {
    return (
        <div className={styles.container}>
            <div className={styles.innerContainer}>
                <div className={styles.wrapper}>
                    <div className={styles.header}>
                        <img src={logo} alt={'MyPubsV2'} className={'mx-auto my-5'} width={550} height={550} />
                    </div>
                    <div className={'my-7 flex'}>
                        <Search isHomeScreen />
                    </div>
                </div>
                <HomeBanner mostCitationsUsers={mostCitationsUsers} mostWorksUsers={mostWorksUsers} mostCitationsWorks={mostCitationsWorks} />
            </div>
        </div>
    );
};

const styles = {
    header: 'text-4xl xl:text-6xl text-gray-500 mb-6',
    container: 'items-center h-full rounded-lg',
    innerContainer: 'w-full p-2 md:p-4 flex flex-col h-full rounded-lg',
    wrapper: 'md:p-4 flex flex-col text-center mb-5',
};

HomePage.propTypes = {
    mostCitationsUsers: array,
    mostWorksUsers: array,
    mostCitationsWorks: array,
    worksByType: arrayOf(
        shape({
            type: string.isRequired,
            count: number.isRequired,
        }),
    ),
};
export default HomePage;
