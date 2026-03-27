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

let messages = [

"工程師正在追進度中 🚀",

"你的爆米花還沒涼 🍿",

"下一集沒有消失放心 🎬",

"伺服器正在全力修復中"

];

let messageText =

document.getElementById("message");

setInterval(() => {

let randomIndex =

Math.floor(Math.random()*messages.length);

messageText.innerText =

messages[randomIndex];

},5000);