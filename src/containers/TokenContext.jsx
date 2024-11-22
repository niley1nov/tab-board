import React, { createContext, useState, useContext, useEffect } from 'react';

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
	const [token, setToken] = useState(null);

	// Load token from localStorage (or sessionStorage) when the app loads
	useEffect(() => {
		const storedToken = localStorage.getItem('secureToken');
		if (storedToken) {
			setToken(storedToken);
		}
	}, []);

	// Save token to localStorage (or sessionStorage) whenever it changes
	const handleSetToken = (newToken) => {
		setToken(newToken);
		localStorage.setItem('secureToken', newToken); // Replace with sessionStorage if preferred
	};

	return (
		<TokenContext.Provider value={{ token, setToken: handleSetToken }}>
			{children}
		</TokenContext.Provider>
	);
};

// Custom hook for easy access to the token context
export const useToken = () => {
	return useContext(TokenContext);
};
