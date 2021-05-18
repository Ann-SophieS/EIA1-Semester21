
let sounds: string[] = 
[("sounds/A.mp3"),
("sounds/C.mp3"),
("sounds/F.mp3"),
("sounds/G.mp3"),
("sounds/hihat.mp3"),
("sounds/kick.mp3"),
("sounds/laugh1.mp3"),
("sounds/laugh2.mp3"),
("sounds/snare.mp3")];

document.querySelector("#tone1").addEventListener("click", function (): void { playSample(sounds[0]); });
document.querySelector("#tone2").addEventListener("click", function (): void { playSample(sounds[1]); });
document.querySelector("#tone3").addEventListener("click", function (): void { playSample(sounds[2]); });
document.querySelector("#tone4").addEventListener("click", function (): void { playSample(sounds[3]); });
document.querySelector("#tone5").addEventListener("click", function (): void { playSample(sounds[4]); });
document.querySelector("#tone6").addEventListener("click", function (): void { playSample(sounds[5]); });
document.querySelector("#tone7").addEventListener("click", function (): void { playSample(sounds[6]); });
document.querySelector("#tone8").addEventListener("click", function (): void { playSample(sounds[7]); });
document.querySelector("#tone9").addEventListener("click", function (): void { playSample(sounds[8]); });

function playSample(sample: string): void {
    var sound: HTMLAudioElement = new Audio(sample); sound.play();
}

var EigenerBeat = [sounds[5], sounds[8], sounds[5], sounds[5], sounds[8]];
    var i = 0;
    document.querySelector("#playButton").addEventListener("click", function () {
        var soundplay = setInterval(function myInterval() {
            playSample(EigenerBeat[i]);
            i += 1;
            if (i > 5) {
                i = 0;
            }
        }, 500);
        document.querySelector("#stopButton").addEventListener("click", function () {
            clearInterval(soundplay);
        });
    });

    document.querySelector("#stopButton").addEventListener("click", function (): void {
        clearInterval(soundplay);
    });
  
    document.getElementById("playButton").addEventListener("click", function (): void {
    document.getElementById("playButton").classList.add("is-hidden");
    document.getElementById("stopButton").classList.remove("is-hidden");

});
  
    document.getElementById("stopButton").addEventListener("click", function (): void {
    document.getElementById("stopButton").classList.add("is-hidden");
    document.getElementById("playButton").classList.remove("is-hidden");

});
 
document.querySelector("#remixButton").addEventListener("click", remix);

function remix(): void {EigenerBeat.length = 0;
    for (let i: number = 0; i < 3; i++) {
        const index: number = Math.floor(Math.random() * 9);
        playSample(sounds[index]);}
    }

    document.querySelector("#deleteButton").addEventListener("click", function (): void {
        EigenerBeat = [];
        console.log("löschen")
    })