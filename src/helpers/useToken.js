import { useState } from 'react';

const useToken = () => {
  const [token, setToken] = useState(() => {
    // Load token from localStorage or return null
    return localStorage.getItem('apiToken') || null;
  });

  const saveToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem('apiToken', newToken);
  };

  return { token, setToken: saveToken };
};

export default useToken;
