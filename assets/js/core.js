'use strict';

const debug = false;
let dateAry = [];
const inputCaseEl = document.querySelector('.attendance__result--case');
const pageEl = document.querySelectorAll('main > article');
const menuListEl = document.querySelectorAll('.menu__list > li');
const infoText = [
    [
        'テスト版リリース',
        '勤怠アプリを作成しました。バグや要望はべべまでご連絡ください。',
        '2024/12/09'
    ],
];

function init(){
    if(debug) dbg();
    setHTML();
    manageTab();
    makeRecord();
    timer();
    setInterval(timer, 1000);
}

function get00(num){
    num = '0' + num;
    return num.slice(-2);
}

function getISOSTime(){
    const now = new Date();
    const isoString = `${now.getFullYear()}-${get00(now.getMonth() + 1)}-${get00(now.getDate())}T${get00(now.getHours())}:${get00(now.getMinutes())}`;
    // console.log(isoString);
    // let isoString = date.toISOString();
    // isoString = isoString.replace(/(:\d{2})\.\d{3}/, '').replace(/Z/, '')
    return isoString;
}

function sendSpreadsheets(ary){
    $.post('https://docs.google.com/forms/u/0/d/e/1FAIpQLSeiKbwc_kWGuYNragDHNyKBuqeFyg8dl5OClPua11N6HUUyTw/formResponse',
        {
            'entry.175148690': ary[0],
            'entry.2086331527': ary[2],
            'entry.907702302': ary[3],
            'entry.138870410': ary[1]
        });
    // ?entry.175148690=name&entry.2086331527=begin&entry.907702302=finish&entry.138870410=number
}

function setHTML(){
    const myName = localStorage.getItem('VCRP__name') ? localStorage.getItem('VCRP__name') : '名無しさん' ;
    document.querySelector('.landing').classList.add('js-on');
    document.querySelectorAll('title, .header__title > .header__title-name').forEach(function(element) {
        element.textContent = 'EMS勤怠';
    });
    document.querySelector('.attendance__sendWrap').innerHTML = '<button type="button" class="attendance__button attendance__button--send" disabled>勤怠を提出する</button>';
    document.querySelector('.setting__name').value = myName;
    document.querySelector('.time__name').textContent = `Hi, ${myName}さん`;

    // temp見る
    if(localStorage.getItem('VCRP__temp')){
        const serializedArray = localStorage.getItem('VCRP__temp');
        const array = JSON.parse(serializedArray);
        if(array[3]){
            manageAttendance(2)
        }else{
            manageAttendance(1);
        }
    }

    document.querySelector('.attendance__button--send').addEventListener('click', function(event){
        const result = window.confirm('勤怠を送信します。よろしいですか？');
        if(result) {
            const tempAry = JSON.parse(localStorage.getItem('VCRP__temp'));
            const tempDate = new Date(tempAry[2]);
            const dataYYYY = tempDate.getFullYear();
            const dataMM = get00(tempDate.getMonth() + 1);
            let recordAry = localStorage.getItem('VCRP__record') ? JSON.parse(localStorage.getItem('VCRP__record')) : {} ;
            if(!localStorage.getItem('VCRP__record')){
                recordAry[`${dataYYYY}年${dataMM}月`] = [];
                recordAry[`${dataYYYY}年${dataMM}月`][0] = tempAry;
            }else{
                if(!recordAry[`${dataYYYY}年${dataMM}月`]){
                    recordAry[`${dataYYYY}年${dataMM}月`] = [];
                }
                recordAry[`${dataYYYY}年${dataMM}月`].push(tempAry);
            }
            sendSpreadsheets(tempAry);
            localStorage.setItem('VCRP__record',JSON.stringify(recordAry));
            console.log(JSON.parse(localStorage.getItem('VCRP__record')))
            makeRecord();
            manageAttendance(3);
        }
    });

    infoText.forEach(function(val){
        const dt = document.createElement('dt');
        if(val[2]){
            dt.innerHTML = `<span>${val[0]}</span><time>${val[2]}</time>`;
        }else{
            dt.innerHTML = `<span>${val[0]}</span>`;
        }
        const dd = document.createElement('dd');
        dd.innerHTML = `${val[1]}`;
        document.querySelector('.information__dl').appendChild(dt);
        document.querySelector('.information__dl').appendChild(dd);
    });
}

function makeRecord(){
    document.querySelector('.page__record').innerHTML = '';
    if(localStorage.getItem('VCRP__record')){
        const tempAry = JSON.parse(localStorage.getItem('VCRP__record'));
        Object.keys(tempAry).forEach(function (key) {
            const s = document.createElement('section');
            s.classList.add('box');
            const h2 = document.createElement('h2');
            h2.textContent = key;
            const div = document.createElement('div');
            div.classList.add('tableWrap');
            const table = document.createElement('table');
            div.appendChild(table);
            const tr = document.createElement('tr');
            tr.innerHTML = '<th>名前</th><th>事件対応数</th><th>出勤時間</th><th>退勤時間</th>';
            s.appendChild(h2);
            s.appendChild(div);
            table.appendChild(tr);
            document.querySelector('.page__record').appendChild(s);
            tempAry[key].forEach(function(val){
                const tr = document.createElement('tr');
                val.forEach(function(val2){
                    const td = document.createElement('td');
                    td.textContent = val2;
                    tr.appendChild(td);
                    // console.log(val2);
                });
                table.appendChild(tr);
            });
        });
    }else{
        const s = document.createElement('section');
        s.classList.add('box');
        const h2 = document.createElement('h2');
        h2.textContent = '勤怠記録はまだありません';
        s.appendChild(h2);
        document.querySelector('.page__record').appendChild(s);
    }
}

function manageTab(){
    menuListEl.forEach(function(element,index) {
        element.addEventListener('click', function(event){
            showTab(index);
        });
    });
}

function showTab(index){
    document.querySelector('.header__title-cat').textContent = menuListEl[index].querySelector('a').textContent;
    menuListEl.forEach(function(element) {
        element.classList.remove('js-on');
    });
    menuListEl[index].classList.add('js-on');
    pageEl.forEach(function(element) {
        element.classList.remove('js-on');
    });
    pageEl[index].classList.add('js-on');
}

function timer(){
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

function manageAttendance(state){
    const tempAry = JSON.parse(localStorage.getItem('VCRP__temp'));
    document.querySelector('.attendance__button--begin').setAttribute('disabled','disabled');
    document.querySelector('.attendance__button--finish').removeAttribute('disabled');
    document.querySelector('.attendance__resultCaseWrap').classList.add('js-on');
    document.querySelector('.attendance__resultStartWrap').classList.add('js-on');
    document.querySelector('.attendance__result--start').value = tempAry[2];
    document.querySelector('.attendance__result--case').value = tempAry[1];
    switch (state) {
        case 1:
            break;
        case 2:
            document.querySelector('.attendance__button--finish').setAttribute('disabled','disabled');
            document.querySelector('.attendance__button--send').removeAttribute('disabled');
            document.querySelector('.attendance__resultFinishWrap').classList.add('js-on');
            document.querySelector('.attendance__result--finish').value = tempAry[3];
            break;

        case 3:
            document.querySelector('.attendance__button--send').setAttribute('disabled','disabled');
            document.querySelector('.attendance__button--finish').setAttribute('disabled','disabled');
            document.querySelector('.attendance__button--begin').removeAttribute('disabled');
            document.querySelector('.attendance__resultStartWrap').classList.remove('js-on');
            document.querySelector('.attendance__resultCaseWrap').classList.remove('js-on');
            document.querySelector('.attendance__resultFinishWrap').classList.remove('js-on');
            document.querySelector('.attendance__result--start').value = '';
            document.querySelector('.attendance__result--case').value = 0;
            document.querySelector('.attendance__result--finish').value = '';
            localStorage.removeItem('VCRP__temp');
            break;
        default:
            console.log(state, tempAry);
    }
}

function manageCase(){
    const tempAry = JSON.parse(localStorage.getItem('VCRP__temp'));
    tempAry[1] = inputCaseEl.value;
    localStorage.setItem('VCRP__temp',JSON.stringify(tempAry));
}

document.querySelector('.attendance__button--begin').addEventListener('click', function(event){
    const date = getISOSTime();
    // console.log(date);
    const tempAry = [
        localStorage.getItem('VCRP__name'),
        '0',
        date
    ]
    localStorage.setItem('VCRP__temp',JSON.stringify(tempAry));
    manageAttendance(1);
});

document.querySelector('.attendance__button--finish').addEventListener('click', function(event){
    const date = getISOSTime();
    let tempAry = JSON.parse(localStorage.getItem('VCRP__temp'));
    tempAry[3] = date;
    localStorage.setItem('VCRP__temp',JSON.stringify(tempAry));
    manageAttendance(2);
});

inputCaseEl.addEventListener('change', function(event){
    manageCase();
});
document.querySelector('.attendance__result--casePlus').addEventListener('click', function(event){
    inputCaseEl.stepUp();
    manageCase();
});
document.querySelector('.attendance__result--caseMinus').addEventListener('click', function(event){
    inputCaseEl.stepDown();
    manageCase();
});

document.querySelector('.attendance__result--start').addEventListener('change', function(event){
    const tempAry = JSON.parse(localStorage.getItem('VCRP__temp'));
    tempAry[2] = this.value;
    localStorage.setItem('VCRP__temp',JSON.stringify(tempAry));
});
document.querySelector('.attendance__result--finish').addEventListener('change', function(event){
    const tempAry = JSON.parse(localStorage.getItem('VCRP__temp'));
    tempAry[3] = this.value;
    localStorage.setItem('VCRP__temp',JSON.stringify(tempAry));
});


function dbg() {
    document.querySelector('.landing').setAttribute('style', 'display: none;');
    // showTab(1);
}

init();