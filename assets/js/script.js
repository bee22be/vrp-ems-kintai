'use strict';

const startDialogEl = document.querySelector('.starting');
const startDialogWrapEl = document.querySelector('.startingWrap');
const startDialogErrorEl = document.querySelector('.starting__errorWrap');

async function sha256(text){
    const uint8  = new TextEncoder().encode(text)
    const digest = await crypto.subtle.digest('SHA-256', uint8)
    return Array.from(new Uint8Array(digest)).map(v => v.toString(16).padStart(2,'0')).join('')
}

function checkStorage() {
    if(localStorage.getItem("VCRP__login")){
        sha256(localStorage.getItem("VCRP__login")).then(hash => {
            if(hash === '7c0a0a5d856698fc86b3d4328f6e0cec97047abe725b56c404d94d591e32ae17'){
                setCore();
            }
        });
    }
    // console.log(localStorage.getItem("VCRP__login"))
}

function setCore() {
    const s = document.createElement("script");
    s.src = "./assets/js/core.js";
    document.querySelector('head').appendChild(s);
    document.querySelector('.starting__button').setAttribute('disabled','disabled')
    startDialogEl.remove();
}

document.querySelector('.starting__button').addEventListener('click', function(event){
    checkStorage();
    let pass = document.querySelector('.starting__input--pass').value;
    sha256(pass).then(hash => {
        const myName = document.querySelector('.starting__input--text').value;
        if(myName === '' && hash === '7c0a0a5d856698fc86b3d4328f6e0cec97047abe725b56c404d94d591e32ae17'){
            console.log('name NG!');
            startDialogErrorEl.querySelector('p:nth-of-type(1)').setAttribute('style', "display: none;");
            startDialogErrorEl.querySelector('p:nth-of-type(2)').setAttribute('style', "display: block;");
            startDialogWrapEl.classList.add('js-ng');
            startDialogErrorEl.classList.add('js-ng');
        } else if(hash==='7c0a0a5d856698fc86b3d4328f6e0cec97047abe725b56c404d94d591e32ae17'){
            console.log('OK!');

            document.querySelector('.setting__name').value = myName;
            startDialogWrapEl.classList.add('js-ok');
            startDialogEl.addEventListener("animationend", () => {
                setCore();
            });
            startDialogEl.classList.add('js-ok');

            localStorage.setItem("VCRP__login", pass);

        } else {
            console.log('NG!');
            startDialogErrorEl.querySelector('p:nth-of-type(2)').setAttribute('style', "display: none;");
            startDialogErrorEl.querySelector('p:nth-of-type(1)').setAttribute('style', "display: block;");
            startDialogWrapEl.classList.add('js-ng');
            startDialogErrorEl.classList.add('js-ng');
        }
    })
    event.preventDefault();
});

startDialogWrapEl.addEventListener("animationend", () => {
    startDialogWrapEl.classList.remove("js-ng");
});
startDialogErrorEl.addEventListener("animationend", () => {
    startDialogErrorEl.classList.remove("js-ng");
});

checkStorage();
