import React, { useCallback, useState } from 'react';
import useAPI from '@/Hooks/useAPI/useAPI.js';
import { instanceOf } from 'prop-types';
import { Work } from '@/Models/Work/Work.js';
import PaginatedList from '@/Components/PaginatedList/PaginatedList.jsx';
import { WorkItem } from '@/Components/Assets/WorkItem/WorkItem.jsx';
import { Author } from '@/Models/Author/Author.js';
import { useAuth } from '@/Hooks/useAuth/useAuth.jsx';
import useAsync from '@/Hooks/useAsync/useAsync.js';
import { useWorkVisibilityChangedEventListener } from '@/Events/WorkEvent/WorkEvent.js';

const HiddenWorks = ({ author }) => {
    const api = useAPI();
    const [hiddenWorks, setHiddenWorks] = useState({ data: [] });
    const { user } = useAuth();
    const [refreshWorks, setRefreshWorks] = useState(false);
    const handleFetchWorks = useCallback(() => {
        return api.works.getHiddenWorks().then((res) => {
            setHiddenWorks(res);
        });
    }, [refreshWorks]);

    const { loading } = useAsync(handleFetchWorks);

    const renderWorkItem = useCallback((work, index) => {
        return <WorkItem work={work} key={work.id} index={index} showUserOptions={author.id === user?.author?.id} hidden />;
    }, []);

    useWorkVisibilityChangedEventListener(() => {
        setRefreshWorks((prev) => !prev);
    }, true);

    const handleGetPage = (url) => {
        api.pagination.getPage(url).then((res) => {
            setHiddenWorks(res.data.works);
        });
    };

    return (
        <PaginatedList
            response={hiddenWorks}
            renderFn={renderWorkItem}
            parser={Work.parseResponseWork}
            className={'order-2 w-full xl:order-none xl:border-r xl:border-r-gray-300'}
            title={`Hidden Works`}
            gap={7}
            loading={loading}
            onLinkClick={handleGetPage}
            perPage={10}
        />
    );
};

HiddenWorks.propTypes = {
    author: instanceOf(Author).isRequired,
};

export default HiddenWorks;
