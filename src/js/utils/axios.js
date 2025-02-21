import axios from 'axios';

axios.defaults.headers['Access-Control-Allow-Origin'] = '*';

axios.defaults.headers.Accept = '*/*';
axios.defaults.headers['Accept-Language'] = 'en';
axios.defaults.headers['Content-Language'] = 'en-US';

const token = (localStorage.getItem('token') && localStorage.getItem('token') !== 'undefined') ? localStorage.getItem('token') : '';

const instance = axios.create({
    baseURL: process.env.BASE_API_URL,
    headers: { 'Authorization': `Bearer ${token}` }
})

export default instance;
