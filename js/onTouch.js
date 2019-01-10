/*jshint esversion: 6 */
/************************************
 * SWIPE HANDLER (Returns direction) 
 ************************************/
// http://www.javascriptkit.com/javatutors/touchevents3.shtml
export function onTouch(el, callback, capture){

    this.touchsurface = el;
    this.dir;
    this.swipeType;
    this.startX;
    this.startY;
    this.distX;
    this.distY;
    this.threshold = 150; //required min distance traveled to be considered swipe
    this.restraint = 50; // maximum distance allowed at the same time in perpendicular direction
    this.allowedTime = 500; // maximum time allowed to travel that distance
    this.elapsedTime;
    this.startTime;
    this.handletouch = callback || function(evt, dir, phase, swipetype, distance){};
    
    this.touchsurface.addEventListener('touchstart', function(e){
        // TODO: this is working only with console.log, figure out how to get rid of it
        console.log(e);
        //console.log(e.changedTouches[0]);
        
        let touchList = e.changedTouches;
        //console.log(touchList[0].pageX);
        
        this.dir = 'none';
        this.swipeType = 'none';
        //let dist = 0;

        this.startX = touchList[0].pageX;
        this.startY = touchList[0].pageY;
        
        this.startTime = new Date().getTime(); // record time when finger first makes contact with surface
        this.handletouch(e, 'none', 'start', this.swipeType, 0); // fire callback function with params dir="none", phase="start", swipetype="none" etc
        //e.preventDefault()
    
    }.bind(this), capture || false);
    
    this.touchsurface.addEventListener('touchmove', function(e){
        console.log(e);
        let touchList = e.changedTouches;
        let touchObj = touchList[0];
        this.distX = touchObj.pageX - this.startX; // get horizontal dist traveled by finger while in contact with surface
        this.distY = touchObj.pageY - this.startY; // get vertical dist traveled by finger while in contact with surface

        if (Math.abs(this.distX) > Math.abs(this.distY)){ // if distance traveled horizontally is greater than vertically, consider this a horizontal movement
            this.dir = (this.distX < 0)? 'left' : 'right';
            this.handletouch(e, this.dir, 'move', this.swipeType, this.distX); // fire callback function with params dir="left|right", phase="move", swipetype="none" etc
        }
        else{ // else consider this a vertical movement
            this.dir = (this.distY < 0)? 'up' : 'down';
            this.handletouch(e, this.dir, 'move', this.swipeType, this.distY); // fire callback function with params dir="up|down", phase="move", swipetype="none" etc
        }
        //e.preventDefault() // prevent scrolling when inside DIV
    }.bind(this), capture || false);
    
    this.touchsurface.addEventListener('touchend', function(e){
        //let touchobj = e.changedTouches[0];
        //console.log(`Start time: ${this.startTime}`);
        this.elapsedTime = new Date().getTime() - this.startTime; // get time elapsed
        //console.log(`Elapsed time: ${this.elapsedTime}`);
        if (this.elapsedTime <= this.allowedTime){ // first condition for awipe met
            if (Math.abs(this.distX) >= this.threshold && Math.abs(this.distY) <= this.restraint){ // 2nd condition for horizontal swipe met
                this.swipeType = this.dir; // set swipeType to either "left" or "right"
            }
            else if (Math.abs(this.distY) >= this.threshold && Math.abs(this.distX) <= this.restraint){ // 2nd condition for vertical swipe met
                this.swipeType = this.dir; // set swipeType to either "top" or "down"
            }
        }
        // Fire callback function with params dir="left|right|up|down", phase="end", swipetype=dir etc:
        this.handletouch(e, this.dir, 'end', this.swipeType, (this.dir =='left' || this.dir =='right')? this.distX : this.distY);
        //e.preventDefault()
    }.bind(this), capture || false);
}
    
// USAGE:
/*
ontouch(el, function(evt, dir, phase, swipetype, distance){
    // evt: contains original Event object
    // dir: contains "none", "left", "right", "top", or "down"
    // phase: contains "start", "move", or "end"
    // swipetype: contains "none", "left", "right", "top", or "down"
    // distance: distance traveled either horizontally or vertically, depending on dir value
    
    if ( phase == 'move' && (dir =='left' || dir == 'right') )
    console.log('You are moving the finger horizontally by ' + distance)
})
*/