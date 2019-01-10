/*jshint esversion: 6 */

export class Slider {
    constructor(stripeElem, scrollStep, stepMetric, beginReached, endReached, slideChanged) {
        this.stripeElem = stripeElem;
        this.scrollStep = scrollStep;
        this.stepMetric = stepMetric;
        this.beginReached = beginReached;
        this.endReached = endReached;
        this.onSlideChanged = slideChanged;
        const slideElements = stripeElem.querySelectorAll('.block-slide');
        this.slides = Array.from(slideElements);
        this.slidesCount = this.slides.length;
        this.endLimit = (this.slidesCount - 1) * scrollStep;
        this.scrollProgressLine = document.querySelector('.progress-dynamic');

        this.move = this.move.bind(this);
        this.setSlideByIndex = this.setSlideByIndex.bind(this);

        this.translateValue = 0;
        this.currentSlideIndex = 0;
        this.currentSlide = this.slides[this.currentSlideIndex];
        this.setSlideByIndex(this.currentSlideIndex);

        if(this.scrollProgressLine){
            const percentOfOneElement = this.calcOneSlidePercentWidth();
            this.scrollProgressLine.style.width =  String(percentOfOneElement) + '%';
        }
    }

    move(){
        this.stripeElem.style.transform = `translateX(${this.translateValue}${this.stepMetric})`;
    }

    calcOneSlidePercentWidth(){
        const stripeWidth = this.stripeElem.getBoundingClientRect().width;  //in px
        const stepOfLine = stripeWidth / this.slidesCount;  //in px
        const percentOfOneElement = (stepOfLine * 100) / stripeWidth;
        return percentOfOneElement;
    }

    scaleProgressIndicator(currentIndex) {
        // scale this.scrollProgressLine
        if(this.scrollProgressLine){
            const percentOfOneElement = this.calcOneSlidePercentWidth();
            this.scrollProgressLine.style.width = String(Math.round(percentOfOneElement * currentIndex)) + '%';
        }
    }

    setSlideByIndex(index) {
        this.currentSlide = this.slides[index];
        this.translateValue = -(index * this.scrollStep * 1);
        this.move();
        if (this.onSlideChanged) {
            this.onSlideChanged({"slides": this.slides, "current": this.currentSlide, "index": index});
        }
    }

    forward(){
        let newIndex = this.currentSlideIndex + 1;

        if(newIndex > this.slidesCount - 2){
            //removing scroll tip
            if(document.querySelector('.tip')){
                document.querySelector('.tip').classList.add('unvisible');
            }
        }

        if (newIndex > this.slidesCount - 1 && this.endReached) {
            this.endReached();
        } else {
            this.currentSlideIndex = newIndex;
            this.setSlideByIndex(this.currentSlideIndex);
            this.scaleProgressIndicator(newIndex + 1);
        }
    }

    backward(){
        let newIndex = this.currentSlideIndex - 1;
        if (newIndex < 0 && this.beginReached) {
            this.beginReached();
        } else {
            this.currentSlideIndex = newIndex;
            this.setSlideByIndex(this.currentSlideIndex);
            this.scaleProgressIndicator(newIndex + 1);
        }
    }
}