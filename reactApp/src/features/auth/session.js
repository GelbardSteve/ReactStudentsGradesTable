// The admin session lives in localStorage: the Bearer token and the admin's email
const TOKEN_KEY = 'adminToken';
const EMAIL_KEY = 'adminEmail';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getEmail = () => localStorage.getItem(EMAIL_KEY);

export const saveSession = ({ token, email }) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EMAIL_KEY, email);
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EMAIL_KEY);
};
