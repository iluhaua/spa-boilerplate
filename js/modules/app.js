/*jshint esversion: 6 */

/* MODULE IMPORTS */
import '../../vendor/modernizr-custom';
import {tablet, mobile, highlightMenuElement} from '../generic-helpers';
import { NavManager } from '../NavManager';

console.log('== Begin executing app.js ==');

/* MODULE VARIABLES */
const page = document.querySelector(".page");

const navContainer = document.querySelector('.nav-container');
const menuLayout = document.querySelector('.nav-section.menu-social');
const menuSwitcher = document.querySelector('.nav-section.menu-btn');
const menuIcon = menuSwitcher.querySelector('.menu-switcher');

document.documentElement.className = document.documentElement.className.replace(/\bno-js\b/g, '');

//reload on logo
const logo = document.querySelector('.logo a');
logo.addEventListener('click', function (e) {
   // highlightMenuElement();
    if(mobile && menuLayout.classList.contains('open')){

        menuLayout.classList.remove('open');
        menuIcon.classList.remove('open');
        navContainer.classList.remove('menu-open');
        setTimeout(function(){
            menuLayout.classList.remove('close');
        }, 800);


    }
});

const menuHandler = function (params) {

    if (menuLayout.classList.contains('open')) {
        menuLayout.classList.remove('open');
        menuIcon.classList.remove('open');
        //menuLayout.classList.add('close');
        navContainer.classList.remove('menu-open');


        setTimeout(function(){
            menuLayout.classList.remove('close');
        }, 800);

    } else if (!menuLayout.classList.contains('close')) {
        console.log("block");

        menuLayout.classList.add('open');
        menuIcon.classList.add('open');
        navContainer.classList.add('menu-open');
    }
    console.log('TARGET!', event.target);
    if(event.target.classList.contains('menu-item-link')){
            // event.stopPropagation();
        if(document.querySelector('.menu-item-link.active')){
            document.querySelector('.menu-item-link.active').classList.remove('active');
        }
            event.target.classList.add('active');
    }
};

menuSwitcher.addEventListener('click',menuHandler);

menuLayout.addEventListener('click', menuHandler);

export const pageContainer = document.querySelector('.page-container');

export const navManager = new NavManager([
    {"page": "main", "title": "SPA Boilerplate", "script": "./js/index.js"},
    {"page": "contacts", "title": "SPA Boilerplate", "script": "./js/contacts.js"},
]);

console.log('== end executing app.js ==');
export { page, tablet };