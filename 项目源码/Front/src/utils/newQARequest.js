import axios from 'axios';

// 创建一个新的axios对象
const newQARequest = axios.create({
    baseURL: 'http://192.168.58.10:5000',
    timeout: 10000 // 可选，设置超时时间
});

// request 拦截器
newQARequest.interceptors.request.use(config => {
    // 在发送请求之前添加认证token
    const user = localStorage.getItem("user");
    if (user) {
        config.headers['token'] = JSON.parse(user).token;
    }

    return config;
}, error => {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// response 拦截器
newQARequest.interceptors.response.use(response => {
    // 对响应数据做点什么
    return response.data;
}, error => {
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default newQARequest;
