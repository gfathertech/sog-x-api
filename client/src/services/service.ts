// import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL;

// const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
// });

// export default api;

import axios from 'axios';

const isDev = import.meta.env.MODE === 'development';

const baseURL = isDev
  ? import.meta.env.VITE_API_URL // local backend dev
  : '';                       // serverless proxy in production

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;