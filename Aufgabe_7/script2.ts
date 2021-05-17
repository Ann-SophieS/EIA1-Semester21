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

var changePlay = document.querySelector('.changePlay');
var playButton = document.getElementById("playButton");
var pauseButton = document.getElementById("pauseButton");
var shuffleButton = document.querySelector('.shuffleButton');
var interval = setInterval(function () {
}, 2000);

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
    })
    
    changePlay.addEventListener("click", EigenerBeat);
changePlay.addEventListener("click", changebutton);
shuffleButton.addEventListener("click", random);
 
function EigenerBeat() {
    if (pauseButton.style.display == "block") {
        clearInterval(interval);
    }
    if (playButton.style.display == "block") {
        setTimeout(function () { beat[0].play(); }, 500); //LOOP!
        setTimeout(function () { beat[1].play(); }, 1000);
        setTimeout(function () { beat[0].play(); }, 1200);
        setTimeout(function () { beat[0].play(); }, 1800);
        setTimeout(function () { beat[1].play(); }, 2000);
        interval = setInterval(function () {
        setTimeout(function () { beat[0].play(); }, 500); //LOOP!
        setTimeout(function () { beat[1].play(); }, 1000);
        setTimeout(function () { beat[0].play(); }, 1200);
        setTimeout(function () { beat[0].play(); }, 1800);
        setTimeout(function () { beat[1].play(); }, 2000);
    }, 2000);
    }
}

function playAudio(meinz: HTMLAudioElement) {
        meinz.play()
    }
function changebutton() {
    if (playButton.style.display == "none") {
        playButton.style.display = "block";
        pauseButton.style.display = "none";
    
    }
    else {
        playButton.style.display = "none";
        pauseButton.style.display = "block";
    }
}
function random() {
    var number1 = Math.floor(Math.random() * 8);
    var number2 = Math.floor(Math.random() * 8);
    var number3 = Math.floor(Math.random() * 8);
    setTimeout(function () { sounds[number1].play(); }, 500); //LOOP!
    setTimeout(function () { sounds[number2].play(); }, 1000);
    setTimeout(function () { sounds[number3].play(); }, 1500);
}
});