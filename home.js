const hostname = '39.96.68.13',
    port = 8083,
    clientId = 'well_lid_client',
    timeout = 5,
    keepAlive = 100,
    cleanSession = false,
    ssl = false,
    userName = 'admin',
    password = 'public',
    topic = 'well_lid';
client = new Paho.MQTT.Client(hostname, port, clientId);
//建立客户端实例
const options = {
    invocationContext: {
        host: hostname,
        port: port,
        path: client.path,
        clientId: clientId
    },
    timeout: timeout,
    keepAliveInterval: keepAlive,
    cleanSession: cleanSession,
    useSSL: ssl,
    // userName: userName,
    // password: password,
    onSuccess: onConnect,
    onFailure: function (e) {
        console.log(e);
        let s = "{time:" + new Date().Format("yyyy-MM-dd hh:mm:ss") + ", onFailure()}";
        console.log(s);
    }
};
client.connect(options);

//连接服务器并注册连接成功处理事件
function onConnect() {
    console.log("连接成功");
    let s = "{time:" + new Date().Format("yyyy-MM-dd hh:mm:ss") + ", onConnected()}";
    console.log(s);
    client.subscribe(topic);
}

client.onConnectionLost = onConnectionLost;

//注册连接断开处理事件
client.onMessageArrived = onMessageArrived;

//注册消息接收处理事件
function onConnectionLost(responseObject) {
    console.log(responseObject);
    let s = "{time:" + new Date().Format("yyyy-MM-dd hh:mm:ss") + ", onConnectionLost()}";
    console.log(s);
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
        console.log("连接已断开");
    }
}

function onMessageArrived(message) {
    let s = "{time:" + new Date().Format("yyyy-MM-dd hh:mm:ss") + ", onMessageArrived()}";
    console.log(s);
    console.log("收到消息:" + message.payloadString);
}

function send() {
    //从文本框获取数据
    let s = document.getElementById("msg").value;
    let message;
    if (s) {
        s = "{time:" + new Date().Format("yyyy-MM-dd hh:mm:ss") + ", content:" + (s) + ", from: web console}";
        message = new Paho.MQTT.Message(s);
        message.destinationName = topic;
        client.send(message);
        document.getElementById("msg").value = "";
    }
}

let count = 0;

function start() {
    window.tester = window.setInterval(function () {
        let message;
        if (client.isConnected) {
            const s = "{time:" + new Date().Format("yyyy-MM-dd hh:mm:ss") + ", content:" + (count++) +
                ", from: web console}";
            message = new Paho.MQTT.Message(s);
            message.destinationName = topic;
            client.send(message);
        }
    }, 1000);
}

function stop() {
    window.clearInterval(window.tester);
}

Date.prototype.Format = function (fmt) { //author: meizz
    const o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (const k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[
            k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}