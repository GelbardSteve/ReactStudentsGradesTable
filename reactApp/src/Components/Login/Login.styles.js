import styled from 'styled-components';

export const StyledWrapper = styled.div`
    width: 50%;
    margin: 1.5rem auto;
    border: 1px solid gray;
    text-align: center;
`;

export const StyledLi = styled.li`
    cursor: pointer;
`;

export const StyledFormWrapper = styled.div`
   display: flex;
   justify-content: center;
   align-items: center; 
   flex-wrap: wrap;
`;

export const StyledForm = styled.form`
    & input {
        width: 200px;
    };
`;