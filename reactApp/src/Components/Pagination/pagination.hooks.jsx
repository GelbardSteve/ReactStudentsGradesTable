import { range } from 'lodash';
import { useMemo, useRef } from 'react';

export const usePagesCount = (allUsers, pageSize) => {
    const previousPagesCountRef = useRef(null);

    const pages = useMemo(() => {
        const count = Math.ceil((allUsers?.length || 0) / pageSize);
        return range(1, count + 1);
    }, [allUsers, pageSize]);

    const hasPageChanged = previousPagesCountRef.current !== null && previousPagesCountRef.current !== pages.length;

    previousPagesCountRef.current = pages.length;

    return { pages, hasPageChanged };
};