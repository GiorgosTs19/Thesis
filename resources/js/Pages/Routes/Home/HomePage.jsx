import React from "react";
import {array, arrayOf, number, shape, string} from "prop-types";
import Search from "@/Components/Search/Search.jsx";
import HomeBanner from "@/Pages/Routes/Home/HomeBanner/HomeBanner.jsx";

const HomePage = ({mostWorksAuthors, mostWorksUsers, mostCitationsWorks, worksByType}) => {

    return (
        <div className={styles.container}>
            <div className={styles.innerContainer}>
                <div className={styles.wrapper}>
                    <div className={styles.header}>
                        MyPubsV2
                    </div>
                    <Search isHomeScreen/>
                </div>
                <HomeBanner worksByType={worksByType} mostWorksAuthors={mostWorksAuthors} mostWorksUsers={mostWorksUsers} mostCitationsWorks={mostCitationsWorks}/>
            </div>
        </div>
    )
}


const styles = {
    header: 'text-4xl xl:text-6xl text-gray-500 mb-6',
    container: 'flex items-center h-full rounded-lg',
    innerContainer: 'w-full px-6 py-3 flex flex-col h-full rounded-lg',
    wrapper: 'md:p-4 flex flex-col text-center mb-5',
}

HomePage.propTypes = {
    mostWorksAuthors: array,
    mostWorksUsers: array,
    mostCitationsWorks: array,
    worksByType: arrayOf(shape({
        type: string.isRequired,
        count: number.isRequired
    }))
}
export default HomePage;
