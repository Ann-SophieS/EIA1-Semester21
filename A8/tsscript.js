window.addEventListener("load", function () {
    var sound = [new Audio("sounds/kick.mp3"),
        new Audio("sounds/hihat.mp3"),
        new Audio("sounds/snare.mp3"),
        new Audio("sounds/A.mp3"),
        new Audio("sounds/C.mp3"),
        new Audio("sounds/F.mp3"),
        new Audio("sounds/G.mp3"),
        new Audio("sounds/laugh1.mp3"),
        new Audio("sounds/laugh1.mp3"),
    ];
    window.addEventListener("load", function () {
        document.querySelector("#tone1").addEventListener("click", function () { playSample(0); });
        document.querySelector("#tone2").addEventListener("click", function () { playSample(1); });
        document.querySelector("#tone3").addEventListener("click", function () { playSample(2); });
        document.querySelector("#tone4").addEventListener("click", function () { playSample(3); });
        document.querySelector("#tone5").addEventListener("click", function () { playSample(4); });
        document.querySelector("#tone6").addEventListener("click", function () { playSample(5); });
        document.querySelector("#tone7").addEventListener("click", function () { playSample(6); });
        document.querySelector("#tone8").addEventListener("click", function () { playSample(7); });
        document.querySelector("#tone9").addEventListener("click", function () { playSample(8); });
        function playSample(chooseSample) {
            sound[chooseSample].play();
        }
        var EigenerBeat = [sound[0], sound[2], sound[0], sound[0], sound[2]];
        var i = 0;
        document.querySelector("#playButton").addEventListener("click", function () {
            var soundplay = setInterval(function myInterval() {
                playSample(EigenerBeat[i]);
                i += 1;
                if (i > 4) {
                    i = 0;
                }
            }, 500);
            document.querySelector("#stopButton").addEventListener("click", function () {
                clearInterval(soundplay);
            });
        });
        document.getElementById("playButton").addEventListener("click", function () {
            document.getElementById("playButton").classList.add("is-hidden");
            document.getElementById("stopButton").classList.remove("is-hidden");
        });
        document.getElementById("stopButton").addEventListener("click", function () {
            document.getElementById("stopButton").classList.add("is-hidden");
            document.getElementById("playButton").classList.remove("is-hidden");
        });
        var remix = document.getElementById("remixButton");
        document.querySelector("#remixButton").addEventListener("click", function () {
            var remix = setInterval(function () {
                playSample(sound[i]);
                i = Math.floor(Math.random() * 9);
                console.log(i);
            }, 500);
        });
        document.querySelector("#deleteButton").addEventListener("click", function () {
            EigenerBeat = [];
            console.log("löschen");
        });
    });
});
