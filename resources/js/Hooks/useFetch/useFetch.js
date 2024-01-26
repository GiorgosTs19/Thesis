import {useCallback, useState} from 'react';
import useAsync from "@/Hooks/useAsync/useAsync.js";

export const useFetch = (url) => {
    const [options, setOptions] = useState(null);

    const asyncFunction = useCallback(async () => {
        if (!url) {
            throw new Error('URL is required for the fetch operation.');
        }

        try {
            const response = await fetch(url, options);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch data');
            }

            return data;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }, [url, options]);

    const execute = (customOptions) => {
        setOptions(customOptions);
    };

    const {data, loading, error} = useAsync(asyncFunction);

    return {data, loading, error, execute};
};
