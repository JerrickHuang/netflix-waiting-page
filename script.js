let time = 60;

let countdownElement =

document.getElementById("countdown");

setInterval(() => {

time--;

countdownElement.innerText =

"預估恢復時間：" + time + " 秒";

}, 1000);

let progress =

document.querySelector(".progress");

let width = 0;

setInterval(() => {

if(width < 100){

width++;

progress.style.width =

width + "%";

}

}, 600);