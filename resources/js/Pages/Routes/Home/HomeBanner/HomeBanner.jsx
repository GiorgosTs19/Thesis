import React from "react";

const styles = {
    wrapperDiv: 'col-span-3 lg:col-span-1 flex flex-col text-center',
    image: 'mx-auto mb-4',
    text: 'text-gray-500 font-bold truncate whitespace-pre-wrap mx-auto w-full lg:w-6/12 text-sm lg:text-lg',
    outerGrid: 'grid grid-cols-3 gap-6 lg:gap-2 mb-12'
}
const HomeBanner = () => {
    return <div className={styles.outerGrid}>
        <div className={styles.wrapperDiv}>
            <img src={'resources/Images/Author.png'} width={64} height={64} alt={'Author'}
                 className={styles.image}/>
            <div className={styles.text}>
                Explore a vast collection of renowned authors. Uncover insights,
                and statistical data for each literary figure
            </div>
        </div>
        <div className={styles.wrapperDiv}>
            <img src={'resources/Images/Works.png'} width={64} height={64} alt={'Works'}
                 className={styles.image}/>
            <div className={styles.text}>
                Search through an extensive catalog of papers, discover details about each piece,
                and explore statistical analyses. A comprehensive experience for
                literature enthusiasts
            </div>
        </div>
        <div className={styles.wrapperDiv}>
            <img src={'resources/Images/User.png'} width={64} height={64} alt={'Works'}
                 className={styles.image}/>
            <div className={styles.text}>
                Calling all authors! Elevate your presence by registering on our platform.
                Provide your unique identifiers, and we will seamlessly fetch your data
            </div>
        </div>
    </div>
}

export default HomeBanner;
