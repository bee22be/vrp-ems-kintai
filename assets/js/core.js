'use strict';

let dateAry = [];

function init(){
    setHTML();
    manageTab();
    timer();
    setInterval(timer, 1000);
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
    document.querySelector('.time__day').innerHTML = `${dateAry[0]}年${dateAry[1]}月${dateAry[2]}日`;
    document.querySelector('.time__hhmm--hh').innerHTML = `${dateAry[3]}`;
    document.querySelector('.time__hhmm--mm').innerHTML = `${dateAry[4]}`;
    // console.dir(dateAry);
}

init();