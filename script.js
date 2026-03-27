let time = 60;

let countdownElement =

document.getElementById("countdown");

setInterval(() => {

time--;

countdownElement.innerText =

"預估恢復時間：" + time + " 秒";

}, 1000);