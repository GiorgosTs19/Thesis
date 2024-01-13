import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import {array, arrayOf, number, oneOfType, string} from "prop-types";

const SimpleBarChart = ({labels, title, dataSet}) => {
    const chartRef = useRef(null);

    useEffect(() => {
        // Your data
        const data = {
            labels: labels,
            datasets: [{
                label: title,
                data: dataSet, // Replace with your actual data
                backgroundColor: ['rgba(75, 192, 192, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)'],
                borderWidth: 1
            }]
        };

        // Chart configuration
        const config = {
            type: 'bar',
            data,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
            }
        };

        // Create a new instance of Chart.js
        const myChart = new Chart(chartRef.current, config);

        // Cleanup function to destroy the chart when the component unmounts
        return () => {
            myChart.destroy();
        };
    }, [labels, title, dataSet]);

    return <canvas ref={chartRef}></canvas>;
};

SimpleBarChart.propTypes = {
    labels:arrayOf(oneOfType([string,number])).isRequired,
    title:string.isRequired,
    dataSet:array.isRequired,
}
export default SimpleBarChart;
