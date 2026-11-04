import styled from 'styled-components';

export const StyleFavoritesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const FavoritesHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    color: #2c3e50;
    font-size: 2.25rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    
    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }
  
  p {
    color: #6c757d;
    font-size: 1.1rem;
    margin: 0;
    
    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
`;

export const FavoritesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

export const FavoriteCard = styled.div`
  background: #ffffff;
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ $accent }) => $accent};
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
`;

// Initials in the student's own colour, so cards are easy to tell apart at a glance
export const Avatar = styled.div`
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ $accent }) => $accent};
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
`;

export const StudentName = styled.h3`
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

export const StudentNumber = styled.div`
  background: #eaf4fb;
  color: #2980b9;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: inline-block;
`;

export const GradesInfo = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
  
  h4 {
    color: #495057;
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
  }
  
  p {
    color: #6c757d;
    margin: 0;
    line-height: 1.6;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: #ffffff;
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  
  h2 {
    color: #2c3e50;
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  p {
    color: #6c757d;
    font-size: 1.1rem;
    margin: 0;
  }
`;

export const StyledFavoritesButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.05rem;
  color: #f0b429;
  padding: 0.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  min-height: 32px;
  position: relative;
  
  &:active {
    transform: scale(0.95);
  }
`;

export const SearchResults = styled.div`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6c757d;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  justify-content: center;
  
  button {
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    border: 2px solid;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: relative;
    overflow: hidden;
    min-width: 100px;
    
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s;
    }
    
    &:hover:before {
      left: 100%;
    }
    
    &.btn-outline-secondary {
      background: transparent;
      color: #3498db;
      border-color: #3498db;
      
      &:hover {
        background: #3498db;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
      }
    }
    
    &.btn-outline-danger {
      background: transparent;
      color: #e74c3c;
      border-color: #e74c3c;
      
      &:hover {
        background: #e74c3c;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4);
      }
    }
    
    &:active {
      transform: translateY(0);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
    
    button {
      width: 100%;
      padding: 1rem 1.5rem;
    }
  }
`;
