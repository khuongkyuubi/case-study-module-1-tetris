class Sounds {
    constructor(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.sound.autoplay = false;
        this.sound.muted = false;
    }

    play(){
        this.sound.play();
    }

    stop(){
        this.sound.pause();
    }


}

