'use strict';

const debug = true;
let dateAry = [];

function init(){
    if(debug) dbg();
    setHTML();
    manageTab();
    timer();
    setInterval(timer, 1000);

    sendSpreadsheets(['べべ','2024-12-09T10:58','2024-12-09T12:58','5'])

    document.querySelector('.attendance__result--start').addEventListener('change', function(event){
        console.log(this.value)
    });
}

function sendSpreadsheets(ary){
    function postData(url, data) {
        // fetchでPOSTリクエストを送る
        return fetch(url, {
            method: 'POST', // メソッドはPOST
            headers: {
                'Content-Type': 'application/json' // 送信するデータの形式をJSONに設定
            },
            body: JSON.stringify(data) // データをJSON形式で送信
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // レスポンスをJSONとして解析
        })
        .then(responseData => {
            console.log(responseData); // レスポンスデータをログに出力
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }
    // 使用例
    postData('https://docs.google.com/forms/u/0/d/e/1FAIpQLSeiKbwc_kWGuYNragDHNyKBuqeFyg8dl5OClPua11N6HUUyTw/formResponse', { "entry.175148690": ary[0], "entry.2086331527": ary[1], "entry.907702302": ary[2], "entry.138870410": ary[3]   });
    // ?entry.175148690=name&entry.2086331527=begin&entry.907702302=finish&entry.138870410=number
}

function setHTML(){
    document.querySelector('.landing').classList.add('js-on');
    document.querySelectorAll('title, .header__title > .header__title-name').forEach(function(element) {
        element.textContent = 'EMS勤怠';
    });
    document.querySelector('.attendance__sendWrap').innerHTML = '<button type="button" class="attendance__button attendance__button--send" disabled>勤怠を提出する</button>';
}

function manageTab(){
    const pageEl = document.querySelectorAll('main > article');
    const menuListEl = document.querySelectorAll('.menu__list > li');
    menuListEl.forEach(function(element,index) {
        element.addEventListener('click', function(event){
            document.querySelector('.header__title-cat').textContent = menuListEl[index].querySelector('a').textContent;
            menuListEl.forEach(function(element) {
                element.classList.remove('js-on');
            });
            menuListEl[index].classList.add('js-on');
            pageEl.forEach(function(element) {
                element.classList.remove('js-on');
            });
            pageEl[index].classList.add('js-on');
        });
    });
}

function timer(){
    function get00(num){
        num = "0" + num;
        return num.slice(-2);
    }
    const now = new Date();
    dateAry = [
        now.getFullYear(),
        get00(now.getMonth() + 1),
        get00(now.getDate()),
        get00(now.getHours()),
        get00(now.getMinutes())
    ];
    document.querySelector('.time__day').textContent = `${dateAry[0]}年${dateAry[1]}月${dateAry[2]}日`;
    document.querySelector('.time__hhmm--hh').textContent = `${dateAry[3]}`;
    document.querySelector('.time__hhmm--mm').textContent = `${dateAry[4]}`;
    // console.dir(dateAry);
}

function dbg() {
    document.querySelector('.landing').setAttribute('style', "display: none;");
}

init();