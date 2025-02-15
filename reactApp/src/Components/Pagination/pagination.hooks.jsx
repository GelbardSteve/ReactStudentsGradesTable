import { useCallback } from 'react';
import { range } from 'lodash';

export const usePagesCount = (allUsers, pageSize) => {
    const pagesCount = useCallback(() => {
        return Math.ceil((allUsers?.length || 0) / pageSize);
      }, [allUsers, pageSize]);
    
      const pages = range(1, pagesCount() + 1);

      return pages;
}