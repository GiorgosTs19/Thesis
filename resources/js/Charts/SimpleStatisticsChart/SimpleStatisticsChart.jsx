import React from 'react';
import PropTypes from 'prop-types';
import './styles.css'; // Import the corresponding CSS file

SimpleStatisticsChart.propTypes = {

}
function SimpleStatisticsChart({ statistics, title, xAxisName, yAxisName }) {
    return (
        <>
            {title && <h3 className="text-center italic mb-7">{title}</h3>}
            <div className={'flex flex-col'}>
                <div className={'flex flex-row mx-auto'}>
                    {yAxisName && <h4 className="rotate-90 h-fit m-auto">{yAxisName}</h4>}
                    <div className="chart-container">
                        {statistics.map((stat, index) => (
                            <div className="bar" key={index} title={stat.cited_count}>
                                <div className="bar-cited" style={{height: `${stat.cited_count / 4}px`}}/>
                                <div className="bar-label text-sm">{stat.year}</div>
                            </div>
                        ))}
                    </div>
                </div>
                {xAxisName && <h4 className="my-2 text-center">{xAxisName}</h4>}
            </div>
        </>
    );
}

export default SimpleStatisticsChart;
