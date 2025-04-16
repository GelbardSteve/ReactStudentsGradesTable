import { range } from 'lodash';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const usePagesCount = (numberOfRows) => {
    const allUsers = useSelector((state) => state.manageData.allUsers);

    const pages = useMemo(() => {
        const count = Math.ceil(allUsers.length / numberOfRows);
        return range(1, count + 1);
    }, [allUsers.length, numberOfRows]);



    return { pages };
};