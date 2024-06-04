import {ElMessage} from "element-plus";

export function messageTip(message, type){
    ElMessage({
        message: message,
        type: type,
        duration: 3000
    })
}