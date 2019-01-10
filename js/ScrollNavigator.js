/*jshint esversion: 6 */
import './wheel-handler';
import { onTouch } from './onTouch';
import { mobileAndTabletcheck } from './generic-helpers';


/**
 * Cases to handle:
 * - scroll to other page
 * - scroll to other block on page
 * - scroll slides in sliders
 * - scroll ordinary scrollable content
 * - ?lazy load on scroll
 * 
 * @param {string} elementSelector css selector for scroll element
 * @param {Function} callback to execute on scroll event
 * @param {Object} params object containing parameters:
 * 
 * {
 *  switch: true | false - (switch mode, event.up indicates direction)
 * 
 *  interval: ms
 * }
 */
export class ScrollNavigator {
    constructor(elementSelector, callback, params) {
        this.element = document.querySelector(elementSelector);
        this.callback = callback;
        this.switch = params.switch || false;
        this.interval = params.interval || 140;
        this.swipe = params.swipe || false;
        this.swipeHorizontal = params.swipeHorizontal || true;
        this.intervalThreshold = 800; // for magic mouse & probably touchpads
        
        this.nowTime = Date.now();
        this.thenTime = Date.now();
        this.deltaY = 1;
        this.deltaYArray = [];
        this.prevDeltaYAverage = 0;
        this.averageSpeedChange = 0;
        this.deccelerating = false;
        this.executingCallback = false;
        this.lastTimeCallbackExecuted = Date.now();
        this.eventType = 'scroll'; //scroll | swipe

        

        this.attachSwipeHandler = this.attachSwipeHandler.bind(this);
        if (this.swipe && mobileAndTabletcheck()) {
            console.log('Add swipe handler');
            
            new onTouch(this.element, this.attachSwipeHandler, true);
        } else {
            this.attachScrollHandler();
        }
    }

    detectDirection(event) {
        //console.log(event.timeStamp);
        event.up = (event.deltaY > 0) ? true : false;
    }

    attachScrollHandler() {
        // TODO: calculate speed of change for deltaY during specific interval(200ms for example) 
        window.addWheelListener(this.element, function(event){
            //console.log(`Scrolling over ${event.target}`);
            console.log(`Delta Y: ${event.deltaY}`);

            this.eventType = 'scroll';
            event.etype = this.eventType;

            this.nowTime = Date.now();
            let elapsedTime = this.nowTime - this.thenTime;
            console.log(`== Time elapsed: ${elapsedTime}`);
            
            this.detectDirection(event);

            //TODO: filter noise values before adding to array
            this.deltaYArray.push(Math.abs(event.deltaY));

            if (this.deltaYArray.length > 99) {
                this.deltaYArray.shift();
            }

            if (this.nowTime - this.lastTimeCallbackExecuted > this.intervalThreshold) {
                this.executingCallback = false;
            }

            if (elapsedTime > this.interval) {
                if (this.deltaYArray.length){
                    let avg = this.averageForTime(elapsedTime);

                    if (avg > this.averageSpeedChange) {
                        //if (!this.deccelerating) {
                            if (!this.executingCallback) {
                                if (this.callback) {
                                    this.callback(event);
                                    this.executingCallback = true;
                                    this.lastTimeCallbackExecuted = Date.now();
                                }
                            }
                            
                            this.deccelerating = true;
                    } else {
                        this.deccelerating = false;
                    }

                    this.averageSpeedChange = avg;
                }
                this.deltaYArray.length = 0;
                this.thenTime = this.nowTime;
            }

            window.clearTimeout( this.isScrolling );

            this.isScrolling = setTimeout(function() {
                this.isScrolling = null;
                // Run the callback
                console.log( 'Scrolling has stopped.' );
                this.averageSpeedChange = 0;
                this.deltaYArray.length = 0;
        
            }.bind(this), this.intervalThreshold);

            
        }.bind(this), false);
    }

    attachSwipeHandler(event, dir, phase, swipetype, distance){
        console.log(`Touched: ${dir} ${phase} ${distance}` );
        this.eventType = 'swipe';
        event.etype = this.eventType;
        if (phase == 'end') {
            switch (dir) {
                case 'left':
                    event.up = true;
                    break;
                case 'right':
                    event.up = false;
                    break;
                case 'up':
                    event.up = true;
                    break;
                case 'down':
                    event.up = false;
                    break;   
                default:
                    
                    break;
            }
            console.log(`Touch event.up set to: ${event.up}`);
    
            if (this.swipeHorizontal && (dir == 'left' || dir == 'right')) {
                if (this.callback) {
                    this.callback(event);
                }
            } else if (!this.swipeHorizontal && (dir == 'up' || dir == 'down')){
                if (this.callback) {
                    this.callback(event);
                }
            }
        }

    }

    averageForTime(elapsedTime) {
        let sum = this.deltaYArray.reduce(function (a, b) { return a + b; });
        let avg = sum / elapsedTime;
        return avg;
    }

    averageForNumber(elements, number){
        let sum = 0;

        //taking `number` elements from the end to make the average, if there are not enought, 1
        var lastElements = elements.slice(Math.max(elements.length - number, 1));

        sum = elements.reduce(function (a, b) { return a + b; });

        return Math.ceil(sum/number);
    }
}
