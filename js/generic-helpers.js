/*jshint esversion: 6 */
export const isMac   = navigator.platform.match('Mac') !== null;
export const isiOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
export const isAndroid = /(android)/i.test(navigator.userAgent);
export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
export const mobile  = window.matchMedia("(max-width: 767px), and (max-width: 840px) and (orientation: landscape)").matches;
export const tablet        = window.matchMedia("(max-width: 1023px) and (min-width: 768px)").matches;
export const desktop       = window.matchMedia("(min-width: 1025px)").matches;
export const desktopLarge  = window.matchMedia("(min-width: 1200px)").matches;
export const desktopSmall  = window.matchMedia("(max-width: 1279px)").matches;
export const desktopSmall_tabletLand = window.matchMedia("(max-width: 1200px) and (min-width: 825px) and (orientation: landscape)").matches;
export const phones = window.matchMedia("screen and (max-width: 600px) and (orientation: portrait)").matches;
export const lessThan1366 = window.matchMedia("screen and (max-width: 1366px)").matches;

import { TweenMax } from 'gsap/TweenMax';

// forEach for IE
(function () {
    if (typeof NodeList.prototype.forEach !== "function") {
        NodeList.prototype.forEach = Array.prototype.forEach;
    }
}());

// OS detected
const html = document.querySelector("html");
if (isMac) html.classList.add("mac-os");
if (isiOS) html.classList.add("iOS");
if (isAndroid) html.classList.add("android");


function isFF(){
    //true if:
    return navigator.userAgent.indexOf("Firefox") > 0 ;
}

/**
 * Prepends new node before existing nodes
 * @param {HTMLElement} newChild new element to prepend
 */
Node.prototype.prependChild = function(newChild) {
    let _this = this;

    if (_this.hasChildNodes()) {
        this.insertBefore(newChild, _this.firstChild);
    } else {
        _this.appendChild(newChild);
    }
};
    
/**
 * 
 * @param {HTMLElement} el child element which parent need to be found
 * @param {string} cls class which parent element should contain
 */

export function findParent(el, cls){
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}

/**
 * 
 * @param {HTMLElement} video html5 video selector
 */

export function getVideo(video) {
    let xhr = new XMLHttpRequest();
    let videoSrc = video.getAttribute("data-src");

    xhr.open('GET', videoSrc, true);  // true <=> async req
    xhr.responseType = 'blob';

    xhr.onload = function() {
        if (this.status === 200) {
            let videoDuration = video.duration;
            let videoBlob = this.response;
            let videoURL = URL.createObjectURL(videoBlob);
            video.src = videoURL;

            // let i = setInterval(function() {
            //     if (video.readyState > 0) {
            //         console.log(videoDuration);
            //     }
            // }, 200);
        } 
    };

    xhr.onerror = function() {
        console.log("video: something went wrong");
    };

    xhr.send();
}

/**
 * 
 * @param {HTMLElement} parentElement parent element
 * @param {string} childSelector css selector for children
 * @param {string} classToRemove class to remove from children
 */
export function clearClassForChildren(parentElement, childSelector, classToRemove) {
    let children = parentElement.querySelectorAll(childSelector);

    Array.prototype.forEach.call(children, function (child) {
        child.classList.remove(classToRemove);
    });
}

export function detectIE() {
    let ua = window.navigator.userAgent;
    let msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    let trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        let rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    let edge = ua.indexOf('Edge/');
    if (edge > 0) {
        // Edge (IE 12+) => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}


/**
 * Retrieve the coordinates of the given event relative to the center
 * of the widget.
 *
 * @param event
 *   A mouse-related DOM event.
 * @param reference
 *   A DOM element whose position we want to transform the mouse coordinates to.
 * @return
 *    A hash containing keys 'x' and 'y'.
 */
export function getRelativeCoordinates(event, reference) {
    let x, y;
    event = event || window.event;
    let el = event.target || event.srcElement;

    if (!window.opera && typeof event.offsetX != 'undefined') {
        // Use offset coordinates and find common offsetParent
        let pos = { x: event.offsetX, y: event.offsetY };

        // Send the coordinates upwards through the offsetParent chain.
        let e = el;
        while (e) {
        e.mouseX = pos.x;
        e.mouseY = pos.y;
        pos.x += e.offsetLeft;
        pos.y += e.offsetTop;
        e = e.offsetParent;
        }

        // Look for the coordinates starting from the reference element.
        e = reference;
        let offset = { x: 0, y: 0 };
        while (e) {
        if (typeof e.mouseX != 'undefined') {
            x = e.mouseX - offset.x;
            y = e.mouseY - offset.y;
            break;
        }
        offset.x += e.offsetLeft;
        offset.y += e.offsetTop;
        e = e.offsetParent;
        }

        // Reset stored coordinates
        e = el;
        while (e) {
        e.mouseX = undefined;
        e.mouseY = undefined;
        e = e.offsetParent;
        }
    }
    else {
        // Use absolute coordinates
        let pos = getAbsolutePosition(reference);
        x = event.pageX  - pos.x;
        y = event.pageY - pos.y;
    }
    // Subtract distance to middle
    return { x: x, y: y };
}

export function updateDuration() {
    for(let i=1; i<=document.getElementsByTagName('video').length; i++) {
        let videoTag = document.querySelector("#vid-" + i);
        videoTag.onloadedmetadata = function () {
            let insertHere = document.querySelector("[data-tab='" + videoTag.getAttribute('id') + "']").childNodes[4];
            let animatedDotsContainer = document.createElement('span');
            animatedDotsContainer.innerText = ':';
            animatedDotsContainer.classList.add('pulse');

            let timeArr = fancyTimeFormat(videoTag.duration).split(':');
            insertHere.innerHTML = String(timeArr[0]);
            insertHere.appendChild(animatedDotsContainer);
            insertHere.innerHTML += String(timeArr[1]);
        };
    }
    function fancyTimeFormat(time) {
        // Hours, minutes and seconds
        let mins = ~~((time % 3600) / 60);
        let secs = time % 60;

        // Output like "1:01" or "4:03:59" or "123:03:59"
        let ret = "";
        ret += "0" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret.split('.')[0];
    }
}

export function defineDocumentVisibility(){
    let hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
        hidden = "hidden";
        visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
    }
    return [hidden, visibilityChange];
}

// check if mobile device
export function mobilecheck() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

export function mobileAndTabletcheck() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

// update image scale to fit renderer
export function updateImageScale(widthSpr, heightSpr, spriteImg ) {

    spriteImg.width = widthSpr;
    spriteImg.height = heightSpr; 

    let ratio = Math.max(widthSpr / spriteImg.texture.width, heightSpr / spriteImg.texture.height);
    //console.log(`== Picture ration: ${ratio}`);
    spriteImg.scale.x = ratio; 
    spriteImg.scale.y = ratio;
    spriteImg.x = widthSpr / 2;
    spriteImg.y = heightSpr / 2;
    spriteImg.anchor.set(0.5);
}
/**
 * Returns relative bounds of element
 * @param {HTMLElement} element for which bounds are calculated
 * @param {HTMLElement} parent parent element
 */
export function getElementRelativeBounds(element, parent) {
    let parentRect = parent.getBoundingClientRect();
    let elementRect = element.getBoundingClientRect();
    return {left: parentRect.left - elementRect.left, top: parentRect.top - elementRect.top, right: parentRect.right - elementRect.right, bottom: parentRect.bottom - elementRect.bottom};
}


export function splitIntoLetters(innerText, letterCallback){
    //takes in innerText of some element, gives out transformed text
    const letters = innerText.split('');
    letters.forEach(function (letter) {
        if(letterCallback){
            letterCallback(letter);
        }
    }.bind(this));
}

export function buttonWithCircleArrow() {
    let buttonWithCircleArrow = document.querySelectorAll(".button-with-circle-arrow");

    if (document.querySelector("html").classList.contains("no-touchevents")) {
        buttonWithCircleArrow.forEach(function(button) {
            let buttonText = button.querySelector(".button-text").innerText;
            const textAnimateWrap = document.createElement("div");
            textAnimateWrap.setAttribute("class", "button-text-animate");
    
            splitIntoLetters(buttonText, function(letter) {
                const span = document.createElement("span");
                
                span.innerText = letter;
                button.querySelector(".button-text").appendChild(textAnimateWrap);
                textAnimateWrap.appendChild(span);
            });
        });
    }
}

export function inputFocus(input) {
    let inputItems = document.querySelectorAll(input);
    
    Array.prototype.forEach.call(inputItems, function(inputItem) {
        let inputWrap = inputItem.parentNode;
        inputItem.addEventListener("focus", function() {
            inputWrap.classList.add("focus");
        });
        inputItem.addEventListener("blur", function() {
            if (inputItem.value == "") inputWrap.classList.remove("focus");
        });
    });
}

export function buttonSendAnimate(thisButton, focusBlockClass, callback) {
    let focusedBlock = findParent(thisButton, focusBlockClass);
    let iconBlock = thisButton.parentNode;

    iconBlock.classList.add("animate");
    focusedBlock.classList.remove("focus");
    setTimeout(function() {
        iconBlock.classList.remove("animate");

        if (callback) callback();
    }, 2500);
}

//this function turns vertical scroll into horizontal

//TODO think of how to remove dependency from generic helpers
export function makeScrollEvtHorizontal(element, scrolledElm, step=100, callback) {
    scrolledElm.scrollLeft = 0;
    let event = 'mousewheel';
    if(isFF() === true){
        event = 'wheel';
    }
    //works for all but FF
    element.addEventListener(event, function (event) {
        if(event.deltaY > 0){
            // moving wheel down
            //scrolledElm.scrollLeft += 60;
            TweenMax.to(scrolledElm, .3, {scrollLeft: scrolledElm.scrollLeft + step});

        } else {
           // scrolledElm.scrollLeft -= 60;
            TweenMax.to(scrolledElm, .3, {scrollLeft: scrolledElm.scrollLeft - step});
        }
        if(callback){
            callback();
            console.log('dOnE');
        }
        event.preventDefault();
    });
}

export function highlightMenuElement(ind) {
    if( document.querySelector('.menu-item-link.active')){
        document.querySelector('.menu-item-link.active').classList.remove('active');
    }
    document.querySelectorAll('.menu-item-link')[ind].classList.add('active');
}

export function calculateHorizontalProgress(containerElm, scrolledElm,
                                            dynamicProgrElm, percentElm) {
    const maxScroll = scrolledElm.offsetWidth - containerElm.offsetWidth;
    const scrolledPercent = containerElm.scrollLeft * 100 / maxScroll;
    if(scrolledPercent <= 100){
       dynamicProgrElm.style.width = String(scrolledPercent) + "%";
       percentElm.innerText = String(Math.round(scrolledPercent)) + '%';
    }
    else {
        dynamicProgrElm.style.width =  "100%";
        percentElm.innerText = "100%";
    }
}

export function changeScreenCount(totalSlides, screenCounterSel, params, staticPart='1.0'){
    const screenCounter = document.querySelector(screenCounterSel);
    let currentNum = Number(screenCounter.innerText.split('.')[1].split('')[1]);
    //for jumping between the screens
    let step = params.step ? params.step : 1;
    console.log(step);
    //increase
    if(params.decrease === false){
        currentNum + step <= totalSlides ?
            screenCounter.innerText = staticPart + String(currentNum + step) : currentNum;
    }
    //decrease
    else {
        currentNum - step >= 1 ?
            screenCounter.innerText = staticPart + String(currentNum - step) : currentNum;
    }
}

export function googleMapsExists(){
    return typeof window.google === 'object' && typeof window.google.maps === 'object'
};