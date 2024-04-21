import { Modal, Spinner, Table, Tabs } from 'flowbite-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useClickAway } from '@uidotdev/usehooks';
import { bool, func, number } from 'prop-types';
import useAPI from '@/Hooks/useAPI/useAPI.js';
import useAsync from '@/Hooks/useAsync/useAsync.js';

const OmeaStats = ({ handleCloseStatisticsModal, statisticsModalOpen, group }) => {
    const [countsPerAuthor, setCountsPerAuthor] = useState([]);
    const [typeStatistics, setTypeStatistics] = useState([]);
    const [yearLabels, setYearLabels] = useState([]);

    const api = useAPI();

    const handleFetchTypeStats = useCallback(() => {
        api.groups.getOmeaTypeStats(group).then((res) => {
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

    const statisticsModalRef = useClickAway(() => {
        handleCloseStatisticsModal();
    });

    return (
        <Modal onClose={handleCloseStatisticsModal} show={statisticsModalOpen}>
            <div className={'overflow-hidden p-1'} ref={statisticsModalRef}>
                <Modal.Header>More Statistics</Modal.Header>
                <Modal.Body>
                    <Tabs style={'fullWidth'} className={'max-h-96'}>
                        <Tabs.Item active title="Works per Author">
                            <div className={'overflow-x-auto'}>
                                <Table>
                                    <Table.Head>
                                        <Table.HeadCell>Author</Table.HeadCell>
                                        <Table.HeadCell>OpenAlex</Table.HeadCell>
                                        <Table.HeadCell>ORCID</Table.HeadCell>
                                        <Table.HeadCell>Crossref</Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body>
                                        {countsPerAuthor.map((t) => (
                                            <Table.Row key={t.name}>
                                                <Table.Cell>{t.name}</Table.Cell>
                                                <Table.Cell className={'text-center'}>{t.counts.OpenAlex ?? '-'}</Table.Cell>
                                                <Table.Cell className={'text-center'}>{t.counts.ORCID ?? '-'}</Table.Cell>
                                                <Table.Cell className={'text-center'}>{t.counts.Crossref ?? '-'}</Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            </div>
                        </Tabs.Item>
                        <Tabs.Item active title="Works per OMEA Type">
                            <div className={'my-3 text-center text-gray-400'}>Only showing data for the last 6 years.</div>
                            <div className={'overflow-x-auto'}>
                                {loading ? (
                                    <div className={'flex'}>
                                        <Spinner className={'m-auto'} size={30} />
                                    </div>
                                ) : (
                                    <Table>
                                        <Table.Head>
                                            <Table.HeadCell>Type</Table.HeadCell>
                                            {yearLabels.map((item) => (
                                                <Table.HeadCell key={item}>{`'${item % 100}`}</Table.HeadCell>
                                            ))}
                                        </Table.Head>
                                        <Table.Body>
                                            {Object.values(typeStatistics).map(({ name, worksPerYear }) => (
                                                <Table.Row key={name}>
                                                    <Table.Cell>{name}</Table.Cell>
                                                    {Object.entries(worksPerYear).map(([year, count]) => (
                                                        <Table.Cell key={year} className={'text-center'}>
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
                </Modal.Body>
            </div>
        </Modal>
    );
};

export default OmeaStats;

OmeaStats.propTypes = {
    handleCloseStatisticsModal: func.isRequired,
    statisticsModalOpen: bool.isRequired,
    group: number.isRequired,
};
