import { useEffect, useState } from 'react';
import { Button } from '../Button/Button';
import { StyledNav } from './Pagination.styles';

// Four page numbers are shown. Clicking a number never moves them; the arrows only scroll
// the row by three pages (the last one stays as an anchor) without changing the current page.
const PAGES_SHOWN = 4;
const SCROLL_BY = 3;

export const Pagination = ({ numberOfRows, onPageChange, currentPage, totalItems }) => {
  const [firstShown, setFirstShown] = useState(1);
  const totalPages = Math.ceil(totalItems / numberOfRows);
  const maxFirst = Math.max(1, totalPages - PAGES_SHOWN + 1);
  const first = Math.min(firstShown, maxFirst);

  // Bring the current page back into view when it changes from outside (search resets to page 1)
  useEffect(() => {
    if (currentPage < first || currentPage >= first + PAGES_SHOWN) {
      setFirstShown(Math.min(currentPage, maxFirst));
    }
    // Only when the page itself changes, so the arrows can scroll it out of view
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  if (totalPages < 1) return null;

  const last = Math.min(first + PAGES_SHOWN - 1, totalPages);
  const pages = Array.from({ length: last - first + 1 }, (_, i) => first + i);

  const pageButton = (label, onClick, { disabled, title, active, arrow } = {}) => (
    <li key={label}>
      <Button
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`mr-1 page-item ${active ? 'active' : ''} ${arrow ? 'page-arrow' : ''}`}
      >
        {label}
      </Button>
    </li>
  );

  return (
    <StyledNav aria-label="Page navigation">
      <ul className="pagination">
        {pageButton('‹', () => setFirstShown(Math.max(1, first - SCROLL_BY)), {
          disabled: first <= 1,
          title: 'Previous pages',
          arrow: true,
        })}
        {pages.map((page) => pageButton(page, () => onPageChange(page), { active: page === currentPage }))}
        {pageButton('›', () => setFirstShown(Math.min(maxFirst, first + SCROLL_BY)), {
          disabled: last >= totalPages,
          title: 'Next pages',
          arrow: true,
        })}
      </ul>
    </StyledNav>
  );
};
