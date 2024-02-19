import {useEffect, useState} from 'react';

const useAsync = (asyncFunction, condition = true, dependencies = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!condition) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await asyncFunction();
                setData(result);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [asyncFunction, ...dependencies]);

    return {data, loading, error};
};

export default useAsync;
