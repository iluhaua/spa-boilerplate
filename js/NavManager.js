/*jshint esversion: 6 */

export class NavManager {
    constructor(pagesArray) {
        this.pagesArray = pagesArray;
        this.pageContainer = document.querySelector('.page-container');

        this.hashUrlChangeHandler = this.hashUrlChangeHandler.bind(this);

        // IE fix for onhashchange
        if(!window.HashChangeEvent)(function(){
            let lastURL = document.URL;
            window.addEventListener("hashchange",function(event){
                Object.defineProperty(event,"oldURL",{enumerable:true,configurable:true,value:lastURL});
                Object.defineProperty(event,"newURL",{enumerable:true,configurable:true,value:document.URL});
                lastURL=document.URL;
            });
        }());
        window.onhashchange = this.hashUrlChangeHandler;

        let currentURLName = window.location.hash.substr(1);
        
        if (currentURLName.length > 0) {
            this.displayPage(currentURLName);
        } else {
            this.goToPage("#main");
        }
    }

    // called when user navigates back or clicks on link
    hashUrlChangeHandler(event) {
        if (event.newURL != event.oldURL) {
            let newUrlId = window.location.hash.substr(1);
            //let oldUrlId = event.oldURL.split('#')[1];

            this.displayPage(newUrlId);
        }
    }

    displayPage(hashname) {
        console.log(`Page ID: ${hashname}`);
        this.pageContainer.innerHTML = document.getElementById('template-' + hashname).innerHTML;
        const pageObj = this.pagesArray.find(function(element) {
            return element.page == hashname;
        });

        // TODO: set page title to pageObj.title

        SystemJS.import(pageObj.script).then(function(m){
            m.main();
            //console.log(new m.q().es6); // yay
        });
    }

    goToPage(hashname) {
        document.location.href = hashname;
    }
}