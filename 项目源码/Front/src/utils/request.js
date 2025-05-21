import axios from 'axios'

// 创建一个axios对象出来
const request = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 5000
})

// request 拦截器
request.interceptors.request.use(config => {
    // 设置默认Content-Type
    config.headers['Content-Type'] = 'application/json;charset=utf-8';

    // 增强token处理逻辑
    try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            // 双重验证确保token存在且有效
            if (user?.token && typeof user.token === 'string' && user.token.trim()) {
                config.headers['token'] = user.token.trim();
            } else {
                console.warn('无效的token格式:', user.token);
                // 可以在这里跳转到登录页
                // window.location.href = '/login';
            }
        }
    } catch (e) {
        console.error('解析用户信息异常:', e);
        // 清除无效的本地存储
        localStorage.removeItem("user");
    }

    return config;
}, error => {
    console.error('请求拦截器异常:', error);
    return Promise.reject(error);
});

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
    response => {
        // response.data即为后端返回的Result
        let res = response.data;
        // 兼容服务端返回的字符串数据
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res
        }
        return res;
    },
    error => {
        console.log('err' + error) // for debug
        return Promise.reject(error)
    }
)


export default request