import { Spinner, Table, Tabs } from 'flowbite-react';
import React, { useCallback, useEffect, useState } from 'react';
import { number } from 'prop-types';
import useAPI from '@/Hooks/useAPI/useAPI.js';
import useAsync from '@/Hooks/useAsync/useAsync.js';
import Collapsible from '@/Components/Collapsible/Collapsible.jsx';

/**
 * OmeaStats component fetches and displays OMEA statistics for a given group.
 *
 * @param {number} group - The ID of the group for which statistics are fetched.
 * @returns {JSX.Element} The rendered OmeaStats component.
 */
const OmeaStats = ({ group }) => {
    const [countsPerAuthor, setCountsPerAuthor] = useState([]);
    const [typeStatistics, setTypeStatistics] = useState([]);
    const [yearLabels, setYearLabels] = useState([]);

    const api = useAPI();

    const handleFetchTypeStats = useCallback(() => {
        const currentYear = new Date().getFullYear();
        api.groups.getOmeaTypeStats(group, currentYear - 15, currentYear).then((res) => {
            setTypeStatistics(res.data.typeStatistics);
            const labels = [];

            for (let i = res.data.requestedMin; i <= res.data.requestedMax; i++) {
                labels.push(i);
            }
            setYearLabels(labels);
        });
    }, [group]);

    useEffect(() => {
        api.groups.getOmeaAuthorStats(group).then((res) => {
            setCountsPerAuthor(res.data.countsPerAuthor);
        });
    }, [group]);

    const { loading } = useAsync(handleFetchTypeStats);

    return (
        <Collapsible title={'OMEA Stats'} initiallyCollapsed>
            <div className={'overflow-auto p-1'}>
                <Tabs style={'fullWidth'} className={'max-h-96'}>
                    <Tabs.Item active title="Works per Author">
                        <Table>
                            <Table.Head className={'text-center'}>
                                <Table.HeadCell>Author</Table.HeadCell>
                                <Table.HeadCell>OpenAlex</Table.HeadCell>
                                <Table.HeadCell>ORCID</Table.HeadCell>
                                <Table.HeadCell>Crossref</Table.HeadCell>
                            </Table.Head>
                            <Table.Body>
                                {countsPerAuthor.map((t) => (
                                    <Table.Row key={t.name} className={'border-b border-b-gray-200'}>
                                        <Table.Cell>
                                            <a href={t.url} className={'hover:text-blue-500 hover:underline'}>
                                                {t.name}
                                            </a>
                                        </Table.Cell>
                                        <Table.Cell className={'border-x border-x-gray-100 text-center'}>{t.counts.OpenAlex ?? '-'}</Table.Cell>
                                        <Table.Cell className={'border-r border-r-gray-100 text-center'}>{t.counts.ORCID ?? '-'}</Table.Cell>
                                        <Table.Cell className={'border-r border-r-gray-100 text-center'}>{t.counts.Crossref ?? '-'}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </Tabs.Item>
                    <Tabs.Item active title="Works per OMEA Type">
                        <div className={'my-3 text-center text-gray-400'}>Showing data for the last 15 years.</div>
                        <div className={'overflow-auto'}>
                            {loading ? (
                                <div className={'flex'}>
                                    <Spinner className={'m-auto'} size={30} />
                                </div>
                            ) : (
                                <Table>
                                    <Table.Head className={'text-center'}>
                                        <Table.HeadCell>Type</Table.HeadCell>
                                        {yearLabels.map((item) => (
                                            <Table.HeadCell key={item}>{`'${item % 100}`}</Table.HeadCell>
                                        ))}
                                    </Table.Head>
                                    <Table.Body>
                                        {Object.values(typeStatistics).map(({ name, worksPerYear }) => (
                                            <Table.Row key={name} className={'border-b border-b-gray-200'}>
                                                <Table.Cell>{name}</Table.Cell>
                                                {Object.entries(worksPerYear).map(([year, count]) => (
                                                    <Table.Cell key={year} className={'border-x border-x-gray-100 text-center'}>
                                                        {count}
                                                    </Table.Cell>
                                                ))}
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            )}
                        </div>
                    </Tabs.Item>
                </Tabs>
            </div>
        </Collapsible>
    );
};

export default OmeaStats;

OmeaStats.propTypes = {
    group: number.isRequired,
};
