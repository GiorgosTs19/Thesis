"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const auto_1 = __importDefault(require("chart.js/auto"));
const prop_types_1 = require("prop-types");
const SimpleBarChart = ({ labels, title, dataSet }) => {
    const chartRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
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
        const myChart = new auto_1.default(chartRef.current, config);
        // Cleanup function to destroy the chart when the component unmounts
        return () => {
            myChart.destroy();
        };
    }, [labels, title, dataSet]);
    return react_1.default.createElement("canvas", { ref: chartRef });
};
SimpleBarChart.propTypes = {
    labels: (0, prop_types_1.arrayOf)((0, prop_types_1.oneOfType)([prop_types_1.string, prop_types_1.number])).isRequired,
    title: prop_types_1.string.isRequired,
    dataSet: prop_types_1.array.isRequired,
};
exports.default = SimpleBarChart;
