/*jshint esversion: 6 */

/* MODULE IMPORTS */

// executed every time block is loaded
export function main(){
    console.info(`== main function executed from index.js`);
    

    document.dispatchEvent(criticalResourcesLoaded);


}



