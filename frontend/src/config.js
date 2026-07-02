let apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Ensure the backend URL has the correct protocol prefix (so the browser doesn't treat it as a relative URL)
if (apiURL && !apiURL.startsWith('http://') && !apiURL.startsWith('https://')) {
  apiURL = `https://${apiURL}`;
}

export const API_URL = apiURL;
