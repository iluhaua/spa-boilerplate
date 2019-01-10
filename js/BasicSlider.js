/*jshint esversion: 6 */

export function BasicSlider(slides, slideSelector, autoplay=false, callbackAnimation) {

    this.setSlideByCurrentIndex = function () {
        console.log(this.currentSlideIndex, 'I"m in the setSlide now ');

        let currentSlide = this.slides[this.currentSlideIndex];
        let nextSlide = this.slides[this.currentSlideIndex + 1];
        let prevSlide = this.slides[this.currentSlideIndex - 1];
        let futurePrevSlide = this.slides[this.currentSlideIndex - 2];

        this.slides.forEach(function(slide){
            slide.classList.remove('current');
            slide.classList.remove('prev');
            slide.classList.remove('next');
        });

        if (nextSlide) {
            nextSlide.classList.add('next');
        }

        if (currentSlide) {
            currentSlide.classList.add('current');
        }

        if (prevSlide) {
            prevSlide.classList.add('prev');
        }
    };

    this.switchToNext = function (afterSwitched) {
        this.currentSlideIndex += 1;
        console.log('switching to next......', this.currentSlideIndex);
        if(callbackAnimation){
            callbackAnimation(this.currentSlideIndex);
        }

        if (this.currentSlideIndex < this.slides.length) {
            console.log('going to next slide NOW');
            this.setSlideByCurrentIndex();
        } else if (this.currentSlideIndex == this.slides.length) {
            console.log('length and curr slide index are equal !!!');
            this.currentSlideIndex = 0;
            this.setSlideByCurrentIndex();
        }

        if (afterSwitched) {
            afterSwitched();
        }
    };

    this.switchToPrev = function (afterSwitched) {
        this.currentSlideIndex -= 1;

        if (this.currentSlideIndex >= 0) {
            this.setSlideByCurrentIndex();
        } else if (this.currentSlideIndex < 0) {
            this.currentSlideIndex = this.slides.length - 1;
            this.setSlideByCurrentIndex();
        }
        
        if (afterSwitched) {
            afterSwitched();
        }
    };

    this.addSlideElement = function (element) {
        this.slides.push(element);
    };

    this.autoplayCycle = function () {
        if(this.autoplay === true){
            this.autoPlayer = setInterval(this.switchToNext(undefined, 8000));
        }
    }.bind(this);

    this.init = function() {
        this.slidesContainer = document.querySelector(slides);
        this.slides = [];
        this.autoplay = autoplay;
        this.currentSlideIndex = 0;
        this.addSlideElement = this.addSlideElement.bind(this);
        this.switchToNext = this.switchToNext.bind(this);
        this.switchToPrev = this.switchToPrev.bind(this);

        if (this.slidesContainer) {
            let slideElements = this.slidesContainer.querySelectorAll(slideSelector);
            Array.prototype.forEach.call(slideElements, this.addSlideElement);
        }

        this.autoplayCycle();
    };

    this.init();
}