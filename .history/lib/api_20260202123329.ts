import axios from 'axios';

const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://vexonapi.teymensel.com';

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('vexon_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    loginWithDiscord: (code: string) => api.post('/auth/discord', { code }),
};

export const guildAPI = {
    getGuilds: () => api.get('/user/guilds'),
    getSettings: (guildId: string) => api.get(`/guilds/${guildId}/settings`),
    saveSettings: (guildId: string, settings: { modules: any, config: any }) =>
        api.post(`/guilds/${guildId}/settings`, settings),
};

export default api;
