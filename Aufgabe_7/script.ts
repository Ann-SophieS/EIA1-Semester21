
let sounds: HTMLAudioElement[] = 
[new Audio ("sounds/A.mp3"),
new Audio("sounds/C.mp3"),
new Audio("sounds/F.mp3"),
new Audio("sounds/G.mp3"),
new Audio("sounds/hihat.mp3"),
new Audio("sounds/kick.mp3"),
new Audio("sounds/laugh1.mp3"),
new Audio("sounds/laugh2.mp3"),
new Audio("sounds/snare.mp3")];

window.addEventListener("load", function () {

    document.querySelector("#tone1").addEventListener("click", function () {
        playSample(0);
    });

    document.querySelector("#tone2").addEventListener("click", function () {
        playSample(1);
    });

    document.querySelector("#tone3").addEventListener("click", function () {
        playSample(2);
    });

    document.querySelector("#tone4").addEventListener("click", function () {
        playSample(3);
    });

    document.querySelector("#tone5").addEventListener("click", function () {
        playSample(4);
    });

    document.querySelector("#tone6").addEventListener("click", function () {
        playSample(5);
    });

    document.querySelector("#tone7").addEventListener("click", function () {
        playSample(6);
    });

    document.querySelector("#tone8").addEventListener("click", function () {
        playSample(7);
    });

    document.querySelector("#tone9").addEventListener("click", function () {
        playSample(8);
    });

    function playSample(chooseSample: number) {
        sounds[chooseSample].play();
    }

    let beat: HTMLAudioElement[] = [];
    beat[0] = sounds[5],
    beat[1] = sounds[8];

    document.querySelector('#playButton').addEventListener("click", function () {
        EigenerBeat();
    });


    function EigenerBeat() {
        setTimeout(function () { playAudio(beat[0]); }, 500);
        setTimeout(function () { playAudio(beat[1]); }, 1000);
        setTimeout(function () { playAudio(beat[0]); }, 1200);
        setTimeout(function () { playAudio(beat[0]); }, 1800);
        setTimeout(function () { playAudio(beat[1]); }, 2000);
    }

    function playAudio(meinz: HTMLAudioElement) {
        meinz.play()
    }

});