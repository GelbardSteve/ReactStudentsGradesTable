import { range } from 'lodash';
import { useMemo } from 'react';
import { useStudents } from '../../hooks/useStudents';

export const usePagesCount = (numberOfRows) => {
    const { allStudents } = useStudents();

    const pages = useMemo(() => {
        const count = Math.ceil(allStudents.length / numberOfRows);
        console.log('Pages calculation:', { 
            totalStudents: allStudents.length, 
            numberOfRows, 
            count, 
            pages: range(1, count + 1) 
        });
        return range(1, count + 1);
    }, [allStudents.length, numberOfRows]);

    return { pages };
};