import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { arrayOf, number, oneOfType, string } from 'prop-types';
import clsx from 'clsx';

/**
 * SimpleDoughnutChart component displays a basic doughnut chart using Chart.js library.
 *
 * @component
 * @param {Array} labels - The labels for the data points.
 * @param {string} title - The title of the doughnut chart.
 * @param {Array} dataSet - The data set for the doughnut chart.
 *
 * @param className
 * @example
 * // Example usage of SimpleDoughnutChart component
 * <SimpleDoughnutChart
 *   labels={['Label 1', 'Label 2', 'Label 3']}
 *   title="My Doughnut Chart"
 *   dataSet={[10, 20, 30]}
 *   description="This is a sample doughnut chart."
 * />
 */

const SimpleDoughnutChart = ({ labels, title, dataSet, className }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        // Your data
        const data = {
            labels: labels,
            datasets: [
                {
                    label: title,
                    data: dataSet,
                    backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)', 'rgba(255, 206, 86, 0.5)'],
                    borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 206, 86, 1)'],
                    borderWidth: 1,
                },
            ],
        };

        // Chart configuration
        const config = {
            type: 'doughnut',
            data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
            },
        };

        const myChart = new Chart(chartRef.current, config);

        return () => {
            myChart.destroy();
        };
    }, [labels, title, dataSet]);

    return <canvas ref={chartRef} className={clsx('max-w-fit', className)}></canvas>;
};

SimpleDoughnutChart.propTypes = {
    labels: arrayOf(oneOfType([string, number])).isRequired,
    title: string.isRequired,
    dataSet: arrayOf(number).isRequired,
    className: string,
};

export default SimpleDoughnutChart;
