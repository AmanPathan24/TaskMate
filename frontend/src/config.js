let apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

if (apiURL && !apiURL.startsWith('http://') && !apiURL.startsWith('https://')) {
  apiURL = `https://${apiURL}`;
}

export const API_URL = apiURL;
