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
const prop_types_1 = require("prop-types");
const BaseLayout_jsx_1 = __importDefault(require("@/Layouts/BaseLayout.jsx"));
const InfoSVG_jsx_1 = require("@/SVGS/InfoSVG.jsx");
const SimpleStatisticsChart_jsx_1 = __importDefault(require("@/Charts/SimpleStatisticsChart/SimpleStatisticsChart.jsx"));
const Switch_jsx_1 = __importDefault(require("@/Components/Switch/Switch.jsx"));
const MAX_VISIBLE_AUTHORS = 4;
const PROFILE_STATUS = {
    INCOMPLETE: (name) => react_1.default.createElement("div", { className: 'whitespace-pre-wrap flex flex-wrap text-center' },
        react_1.default.createElement(InfoSVG_jsx_1.InfoSVG, { className: 'mr-2' }),
        name,
        " is not a registered user, thus the list of their works and some information might be incomplete and not always up to date."),
    REGISTERED: (name) => react_1.default.createElement("div", null,
        name,
        " is a registered user, their info and works are regularly updated."),
};
const Work = ({ work }) => {
    const { title, authors, is_oa, published_at, referenced_works_count, language } = work;
    const [showAllAuthors, setShowAllAuthors] = (0, react_1.useState)(false);
    const authorElements = (showAllAuthors ? authors : authors.slice(0, MAX_VISIBLE_AUTHORS)).map((author, index) => (react_1.default.createElement(react_1.default.Fragment, { key: index },
        react_1.default.createElement("a", { href: `http://127.0.0.1:8000/Author/${author.open_alex_id}`, className: 'hover:underline' },
            author.name,
            " "),
        index < authors.length && ', ')));
    const remainingAuthors = authors.length - MAX_VISIBLE_AUTHORS;
    return react_1.default.createElement("li", { className: "mb-4 flex-grow list-decimal" },
        react_1.default.createElement("div", { className: 'flex flex-wrap' },
            react_1.default.createElement("div", { className: "text-gray-600  pl-3 text-sm" }, is_oa ? 'Open Access Available' : 'Open Access Unavailable'),
            react_1.default.createElement("div", { className: "text-gray-600 pl-3 text-sm" },
                "Published : ",
                published_at),
            react_1.default.createElement("div", { className: "text-gray-600 pl-3 text-sm" },
                "Citations : ",
                referenced_works_count),
            react_1.default.createElement("div", { className: "text-gray-600 pl-3 text-sm" },
                "Language : ",
                language)),
        react_1.default.createElement("div", { className: "text-black border-l-2 border-l-blue-700 pl-3 text-lg\n            font-bold truncate flex-wrap whitespace-pre-wrap" }, title),
        react_1.default.createElement("div", { className: "border-l-2 border-l-blue-600 pl-3 text-blue-500 " },
            authorElements,
            remainingAuthors > 0 && !showAllAuthors ? (react_1.default.createElement("span", { className: 'cursor-pointer underline text-amber-950 ml-2', onClick: () => setShowAllAuthors(true) }, `+${remainingAuthors} more`)) :
                remainingAuthors > 0 && (react_1.default.createElement("span", { className: 'cursor-pointer underline text-amber-950 ml-2 ', onClick: () => setShowAllAuthors(false) }, `show Less`))));
};
const Author = ({ author, wosrks }) => {
    console.log(wosrks);
    const { name, is_user, citation_count, works_count, open_alex_id, scopus_id, orc_id, works, statistics, updated_at } = author;
    const ids = [
        { name: 'Open Alex', value: open_alex_id !== null && open_alex_id !== void 0 ? open_alex_id : '-' },
        { name: 'Scopus', value: scopus_id !== null && scopus_id !== void 0 ? scopus_id : '-' },
        { name: 'OrcId', value: orc_id !== null && orc_id !== void 0 ? orc_id : '-' }
    ];
    const yearsArray = statistics.map((statistic) => statistic.year);
    const CHART_DATA = {
        CITATIONS: {
            dataSet: statistics.map((statistic) => statistic.cited_count),
            title: 'Citations',
            labels: yearsArray,
        },
        WORKS: {
            dataSet: statistics.map((statistic) => statistic.works_count),
            title: 'Works',
            labels: yearsArray,
        }
    };
    const [activeChart, setActiveChart] = (0, react_1.useState)(CHART_DATA.CITATIONS);
    console.log(activeChart);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(BaseLayout_jsx_1.default, { title: name },
            react_1.default.createElement("div", { className: "bg-gray-100 flex items-center max-w-9xl mx-auto" },
                react_1.default.createElement("div", { className: "bg-white w-full p-6 flex flex-col" },
                    react_1.default.createElement("div", { className: "rounded-lg p-6 flex flex-wrap gap-8" },
                        react_1.default.createElement("div", { className: "mb-4 w-fit flex-grow" },
                            react_1.default.createElement("p", { className: "text-black border-l-2 border-l-blue-600 pl-3 text-lg font-bold" }, citation_count),
                            react_1.default.createElement("p", { className: "text-gray-600 border-l-2 border-l-blue-600 pl-3" }, "Citations")),
                        react_1.default.createElement("div", { className: "mb-4 w-fit flex-grow" },
                            react_1.default.createElement("p", { className: "text-black border-l-2 border-l-blue-600 pl-3 text-lg font-bold" }, works_count),
                            react_1.default.createElement("p", { className: "text-gray-600 border-l-2 border-l-blue-600 pl-3" }, "Works")),
                        ids.map(({ name, value }) => (react_1.default.createElement("div", { key: name, className: "mb-4 w-fit flex-grow" },
                            react_1.default.createElement("p", { className: "text-black border-l-2 border-l-blue-600 pl-3 text-lg font-bold" }, value),
                            react_1.default.createElement("p", { className: "text-gray-600 border-l-2 border-l-blue-600 pl-3" }, name))))),
                    react_1.default.createElement(Switch_jsx_1.default, { checkedLabel: CHART_DATA.WORKS.title, uncheckedLabel: CHART_DATA.CITATIONS.title, checked: activeChart.title !== CHART_DATA.CITATIONS.title, className: 'mx-auto my-4', onChange: (checked) => setActiveChart(checked ? CHART_DATA.CITATIONS : CHART_DATA.WORKS) }),
                    react_1.default.createElement("div", { className: "px-4 mb-4 overflow-x-auto w-full" },
                        react_1.default.createElement(SimpleStatisticsChart_jsx_1.default, { title: activeChart.title, dataSet: activeChart.dataSet, labels: activeChart.labels })),
                    react_1.default.createElement("div", { className: "mt-4" },
                        react_1.default.createElement("div", { className: "rounded-lg bg-gray-100 px-6 py-4" },
                            react_1.default.createElement("h2", { className: "text-lg font-semibold mb-2" }, is_user ? 'Registered User' : 'Incomplete Profile'),
                            react_1.default.createElement("div", { className: 'text-gray-700 italic' }, is_user ? PROFILE_STATUS.REGISTERED(name) : PROFILE_STATUS.INCOMPLETE(name)),
                            react_1.default.createElement("div", { className: 'mt-2 text-gray-500 opacity-80 text-sm' },
                                "Last updated : ",
                                updated_at))),
                    react_1.default.createElement("div", { className: "mt-4" },
                        react_1.default.createElement("div", { className: "rounded-lg bg-gray-200 p-6" },
                            react_1.default.createElement("div", { className: "text-lg font-semibold mb-4 text-yellow-800" },
                                "Works",
                                react_1.default.createElement("span", { className: 'mx-2 text-gray-600 opacity-50' }, is_user ? '' : `(Only works co-authored with registered users appear in the list )`)),
                            react_1.default.createElement("ul", { className: "list-disc pl-8" }, works.map((work) => (react_1.default.createElement(Work, { work: work, key: work.doi })))))))))));
};
Author.propTypes = {
    author: prop_types_1.object
};
Work.propTypes = {
    title: prop_types_1.string,
    authors: prop_types_1.array,
    is_oa: prop_types_1.bool,
    published_at: prop_types_1.string,
    referenced_works_count: prop_types_1.number,
    language: prop_types_1.string
};
exports.default = Author;
