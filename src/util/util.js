import {ElMessage, ElMessageBox} from "element-plus";

/**
 * 消息提示
 * @param message
 * @param type
 */
export function messageTip(message, type){
    ElMessage({
        message: message,
        type: type,
        duration: 3000
    })
}

/**
 * 获取存储在sessionStorage或localStorage
 * 里的 token (jwt) 的名称
 * @returns {string}
 */
export function getTokenName(){

    return "dlyk_token";
}

/**
 * 删除前端token信息
 */
export function removeToken(){
    window.localStorage.removeItem(getTokenName());
    window.sessionStorage.removeItem(getTokenName());
}

/**
 * 消息确认
 * @param msg
 * @returns {Promise<MessageBoxData>}
 */
export function messageConfirm(msg){
    return ElMessageBox
        .confirm(
        msg,
        '系统提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
}