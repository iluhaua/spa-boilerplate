// CustomVideo object
/**
 * 
 * @param {String} video css selector for video element
 * @param {String} opener css selector for element that causes video playback (play button for example)
 * @param {String} scene css selector for video wrapping element - used to control visual state
 * @param {String} controls css selector for custom video controls
 */


export function CustomVideo(video, opener, scene, controls) {

    let UID = {
        _current: 0,
        getNew: function(){
            this._current++;
            return this._current;
        }
    };

    this.playVideoFromStart = function(soundMuted) {
        this.video.currentTime = 0;
        this.video.muted = soundMuted;
        this.video.play();
    };

    this.showVideoControls = function(callback) {

        if (this.controls.style.opacity != "1") {
            this.controls.style.opacity = "1";
        }

        if (callback) {
            callback();
        }
    };

    this.hideVideoControls = function() {
        this.controls.style.opacity = "0";
        this.mousemoving = false;
    };

    this.handleVideoTouch = function(event) {
        if (!this.mousemoving) {
            // show video controls
            this.showVideoControls(function(){
                this.mousemoving = true;
                setTimeout(this.hideVideoControls, 5000);
            }.bind(this));
        }
       
    };

    this.videoOpen = function() {
        console.log(this.videoOpen, 'open');
        if (this.scene) {
            this.scene.classList.add('open');
            document.querySelector('.header').style.visibility = 'hidden';
        }
        this.playVideoFromStart(false);
        let playBtn = this.controls.querySelector('.playpause');
        playBtn.classList.remove('paused');
        this.video.play();

        //this.video.addEventListener("mousemove", this.handleVideoTouch, false);
        //this.video.addEventListener("touchstart", this.handleVideoTouch, false);
    }.bind(this);

    this.videoClose = function() {
        if (this.scene) {
            this.scene.classList.remove('open');
            document.querySelector('.header').style.visibility = 'visible';
        }
        if (this.video) {
            this.video.pause();
            this.video.muted = true;

            this.video.removeEventListener("mousemove", this.handleVideoTouch, false);
            this.video.removeEventListener("touchstart", this.handleVideoTouch, false);
        }
    };

    let flag = true;
    this.videoPause = function (){
        if(flag) {
            this.video.pause();
            let pauseBtn = this.controls.querySelector('.playpause');
            pauseBtn.classList.add('paused');
            flag = !flag;
        }

        else {
            this.video.play();
            let playBtn = this.controls.querySelector('.playpause');
            playBtn.classList.remove('paused');
            flag = !flag;
        }
    }.bind(this);

    this.videoContinue = function () {
        this.video.play();
    }.bind(this);

    this.readyStateChanged = function () {
        // read more here:
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
        //console.log("Video state: " + this.video.readyState);
    };

    this.init = function() {
        this.video = document.querySelector(video);
        this.opener = document.querySelector(opener);
        this.controls = document.querySelector(controls);
        this.mousemoving = false;

        // TODO: add these element dynamically
        if (this.controls) {
            this.controls.playpause = this.controls.querySelector('.playpause');
            this.controls.progress = this.controls.querySelector('.progress');
            this.controls.close = this.controls.querySelector('.close');
        }

        this.handleVideoTouch = this.handleVideoTouch.bind(this);
        this.videoOpen = this.videoOpen.bind(this);
        this.videoClose = this.videoClose.bind(this);
        this.hideVideoControls = this.hideVideoControls.bind(this);
        this.readyStateChanged = this.readyStateChanged.bind(this);

        if (this.video) {
            this.video.controls = false;
            this.video.muted = true;
        }

        if (this.opener) {
            this.opener.addEventListener('click', this.videoOpen);
        }

        if (this.controls) {
            this.controls.close.addEventListener('click', this.videoClose);
            this.controls.playpause.addEventListener('click', this.videoPause);
        }

        if (this.video) {
            this.video.addEventListener('canplay', this.readyStateChanged);
        }

        window.addEventListener('blur', this.videoClose);

        this.scene = document.querySelector(scene);

        if(this.video){
            this.video.onended = function () {
            this.video.play();
        }.bind(this);}
    };
    this.init();
}