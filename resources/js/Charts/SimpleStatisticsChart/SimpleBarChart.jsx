import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { array, arrayOf, number, oneOfType, string } from 'prop-types';
import clsx from 'clsx';

/**
 * SimpleBarChart component displays a basic bar chart using Chart.js library.
 *
 * @component
 * @param {Array} labels - The labels for the data points on the X-axis.
 * @param {string} itle - The title of the bar chart.
 * @param {Array} dataSet - The data set for the bar chart.
 *
 * @example
 * // Example usage of SimpleBarChart component
 * <SimpleBarChart
 *   labels={['Label 1', 'Label 2', 'Label 3']}
 *   title="My Bar Chart"
 *   dataSet={[10, 20, 30]}
 * />
 */

const SimpleBarChart = ({ labels, title, dataSet, className }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        // Your data
        const data = {
            labels: labels,
            datasets: [
                {
                    label: title,
                    data: dataSet,
                    backgroundColor: ['rgba(75, 192, 192, 0.2)'],
                    borderColor: ['rgba(75, 192, 192, 1)'],
                    borderWidth: 1,
                },
            ],
        };

        // Chart configuration
        const config = {
            type: 'bar',
            data,
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                barThickness: 17,
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 0, // Set animation duration to 0 to disable animation
                },
            },
        };

        const myChart = new Chart(chartRef.current, config);

        return () => {
            myChart.destroy();
        };
    }, [labels, title, dataSet]);

    return <canvas ref={chartRef} className={clsx('max-w-full', className)}></canvas>;
};

SimpleBarChart.propTypes = {
    labels: arrayOf(oneOfType([string, number])).isRequired,
    title: string.isRequired,
    dataSet: array.isRequired,
    description: string,
    className: string,
};
export default SimpleBarChart;
