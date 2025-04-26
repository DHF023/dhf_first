import axios from 'axios';

// 创建一个新的axios对象
const newQARequest = axios.create({
    baseURL: 'http://10.98.128.95:5000',
    timeout: 10000000 // 可选，设置超时时间
});

// 仅保留请求拦截器
newQARequest.interceptors.request.use(config => {
    // 在发送请求之前添加认证token
    const user = localStorage.getItem("user");
    if (user) {
        config.headers['token'] = JSON.parse(user).token;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default newQARequest;
