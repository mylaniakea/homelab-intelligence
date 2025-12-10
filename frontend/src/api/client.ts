import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Use Nginx proxy
});

export default api;
