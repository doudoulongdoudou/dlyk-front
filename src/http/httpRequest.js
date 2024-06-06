import axios from "axios";
import {getTokenName, messageConfirm, messageTip, removeToken} from "../util/util.js";
import {ElMessageBox} from "element-plus";

//定义后端接口地址的前缀
axios.defaults.baseURL = "http://localhost:8080"

export function doGet(url, params) {
    return axios({
        method: "get",
        url: url,
        params: params,
        dataType: "json"
    })
}

export function doPost(url, data) {
    return axios({
        method: "post",
        url: url,
        data: data,
        dataType: "json"
    })
}

export function doPut(url, data) {
    return axios({
        method: "put",
        url: url,
        data: data,
        dataType: "json"
    })
}

export function doDelete(url, params) {
    return axios({
        method: "delete",
        url: url,
        params: params,
        dataType: "json"
    })
}

//添加请求拦截器
axios.interceptors.request.use((config) => {
    //在发送请求之前做些什么
    let token = window.sessionStorage.getItem(getTokenName());
    if (!token) {
        token = window.localStorage.getItem(getTokenName());
        //说明用户选择了记住我
        if (token) {
            config.headers['rememberMe'] = true;
        }
    }
    if (token) {
        //在请求头中放入一个token，后端就可以从请求头中接收到该token
        config.headers['Authorization'] = token;
    }
    return config;
}, (error) => {
    //对请求错误做些什么
    return Promise.reject(error);
});

//添加响应拦截器
axios.interceptors.response.use((response) => {
    // 2xx 范围内的状态码都会触发该函数
    //对响应数据做点什么     拦截token验证的结果，进行相应的提示和页面跳转
    //code 大于 900 什么token验证未通过
    if (response.data.code > 900) {
        //给前端用户提示并且跳转页面
        messageConfirm(response.data.msg + '，是否重新登录？')
            //点击确定触发then()
            .then(() => {
                removeToken();
                //跳转登录页
                window.location.href = "/";
            })
            //点击取消触发catch()
            .catch(() => {
                messageTip("取消登录", "warning")
            })
        return ;
    }
    return response;
}, function (error) {
    // 2xx 范围内的状态码都会触发该函数
    //对响应数错误做点什么
    return Promise.reject(error);
});