import axios from "axios";

//定义后端接口地址的前缀
axios.defaults.baseURL = "http://localhost:8080"

export function doGet(url, params) {
    axios({
        method: "get",
        url: url,
        params:params,
        dataType: "json"
    }).then(function (rep) {
        var s = "";
        rep.data.forEach(function (stu) {
            s += stu.name + "---------" + stu.age + "<br>";
        });
        document.getElementById("mydiv").innerHTML = s;
    })
}

export function doPost(url,data){
    return axios({
        method: "post",
        url: url,
        data:data,
        dataType: "json"
    })
}

export function doPut(url,data){
    axios({
        method: "put",
        url: url,
        data:data,
        dataType: "json"
    }).then(function (rep) {
        var s = "";
        rep.data.forEach(function (stu) {
            s += stu.name + "---------" + stu.age + "<br>";
        });
        document.getElementById("mydiv").innerHTML = s;
    })
}

export function doDelete(url, params) {
    axios({
        method: "delete",
        url: url,
        params:params,
        dataType: "json"
    }).then(function (rep) {
        var s = "";
        rep.data.forEach(function (stu) {
            s += stu.name + "---------" + stu.age + "<br>";
        });
        document.getElementById("mydiv").innerHTML = s;
    })
}