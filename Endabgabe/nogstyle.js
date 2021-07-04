// Funktion fuer die Formartierung der Zeit innerhalb des Timer 
function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    }
    else {
        return valString;
    }
}
//Die Klasse Player wird angelegt um die individuellen Spielerdaten zu verwalten
var Player = /** @class */ (function () {
    function Player(PlayerID, PlayerSymbol, PlayerFAIcon, PlayerName, game) {
        this.PlayerID = -1;
        this.PlayerSymbol = "!"; //"Alphabetisches" Symbol eines Spielers, koennte als Alternative zu fa-icon verwendet werden, aus Zeitgruenden nicht implementiert
        this.PlayerFAIcon = "fa fa-exclamation-triangle";
        this.PlayerName = "Undefined Player!";
        this.Score = 0; //Aktuell gilt Score = gamesWon, perspektivisch koennte der Score anders berechnet werden, bspw abhaengig von Zeit
        this.gamesWon = 0;
        this.PlayerID = PlayerID;
        this.PlayerSymbol = PlayerSymbol;
        this.PlayerFAIcon = PlayerFAIcon;
        this.PlayerName = PlayerName;
        this.game = game;
    }
    //Markieren einer gegebenen Stelle auf dem Spielfeld mit eigener SpielerID
    Player.prototype.doMove = function (x, y) {
        this.game.field[x][y] = this.PlayerID;
    };
    return Player;
}());
//Felstlegen des allgemeinen Spiels und den Eckdaten
var Game = /** @class */ (function () {
    //Konstruktor, legt HTML Elemente und Spielfeldgroesse fest
    function Game(fieldSize, playingField, dialogElement) {
        this.field = [];
        this.fieldSize = 0;
        this.players = [];
        this.playerCount = 0;
        this.totalMoves = 0;
        this.gameActive = false;
        this.gameTime = 0;
        this.roundsPlayed = 0;
        this.fieldSize = fieldSize;
        this.playingField = playingField;
        this.dialogElement = dialogElement;
    }
    //Funktion fuer den ersten Start des Spieles
    Game.prototype.startGame = function () {
        var _this = this;
        this.gameActive = true;
        dialogsHtml.hidden = false;
        this.gameTime = 0;
        //Hinzufuegen des Timers und des Rundenzaehlers im dialog HTML-Element
        dialogsHtml.innerHTML = "Time : " + pad(Math.floor(this.gameTime / 60)) + " : " + pad(this.gameTime % 60) + "<br>" + "Runde " + (this.roundsPlayed + 1) + " von " + this.fieldSize;
        //Timer wird beim Start einer Variablen zugewiesen, um ihn spaeter geziel wieder beenden zu können
        this.intervalHandle = setInterval(function () { return _this.handleTimer(); }, 1000);
        this.continueGame();
    };
    //Aktiv nach der zweiten Runde. Verantwortlich fuers zuruecksetzten der Spielzuege und des Feldes
    Game.prototype.continueGame = function () {
        this.totalMoves = 0;
        this.activePlayer = this.players[0];
        this.clearField();
        this.drawField();
        this.comDoTurn();
        this.totalMoves++;
        this.nextPlayersTurn();
        this.drawField();
        //raus Kontrolle - Ausgabe zu Testzwecken
        for (var row = 0; row < this.fieldSize; row++) {
            console.log(this.field[row][0] + " " + this.field[row][1] + " " + this.field[row][2]);
        }
    };
    //Methode fuer Umgang mit dem Timer. Wird jede Sekunde aufgerufen
    Game.prototype.handleTimer = function () {
        this.gameTime++;
        dialogsHtml.innerHTML = "";
        for (var i = 0; i <= this.playerCount - 1; i++) {
            dialogsHtml.innerHTML += "" + this.players[i].PlayerName + "\t\t" + this.players[i].Score + "<br>";
        }
        //Visuellen Timer updaten
        dialogsHtml.innerHTML += "<br>Time : " + pad(Math.floor(this.gameTime / 60)) + " : " + pad(this.gameTime % 60) + "<br>" + "Runde " + (this.roundsPlayed + 1) + " von " + this.fieldSize;
    };
    //Fuegt einen Spieler ans Ende der Spielerliste an
    Game.prototype.addPlayer = function (playerName, playerSymbol, PlayerFAIcon) {
        if (!this.gameActive)
            this.players.push(new Player(this.playerCount++, playerSymbol, PlayerFAIcon, playerName, this));
    };
    //Zuordnung der Spieler zur jeweiligen ID
    Game.prototype.findPlayerByID = function (id) {
        for (var i = 0; i <= this.playerCount; i++) {
            if (id == this.players[i].PlayerID)
                return this.players[i];
        }
        return new Player(-1, null, null, null, null);
    };
    //Spielfeld leeren / in den Ursprungszustand versetzen
    Game.prototype.clearField = function () {
        for (var row = 0; row < this.fieldSize; row++) {
            this.field[row] = [];
            for (var column = 0; column < this.fieldSize; column++) {
                this.field[row][column] = -1;
            }
        }
    };
    //Anzeigen des Spielfeldes als Tabelle im game HTML-Element
    Game.prototype.drawField = function () {
        //Aktuelles Feld loeschen
        this.playingField.innerHTML = "";
        var table = document.createElement('table');
        var tableBody = document.createElement('tbody');
        table.appendChild(tableBody);
        var _loop_1 = function (row) {
            tr = document.createElement('tr');
            tableBody.appendChild(tr);
            var _loop_2 = function (column) {
                td = document.createElement('td');
                td.width = '35px'; //Breite Variabel setzen
                td.height = '35px'; //Höhe Variabel
                var fieldButton = document.createElement("button");
                fieldButton.className = ".gameButton";
                //Besetztes Feld
                if (this_1.field[row][column] != -1) {
                    fieldButton.innerHTML = "<i class='" + this_1.findPlayerByID(this_1.field[row][column]).PlayerFAIcon + "'></i>";
                    fieldButton.className += " .occupiedGameField";
                }
                else {
                    //freies Feld
                    fieldButton.innerHTML = " ";
                    fieldButton.className += " .freeGameField";
                    fieldButton.addEventListener("click", function () { fieldClicked(row, column); });
                }
                td.appendChild(fieldButton);
                tr.appendChild(td);
            };
            for (var column = 0; column < this_1.fieldSize; column++) {
                _loop_2(column);
            }
        };
        var this_1 = this, tr, td;
        for (var row = 0; row < this.fieldSize; row++) {
            _loop_1(row);
        }
        //Anfuegen der erstellten Tabelle ans HTML Spielfeld
        this.playingField.appendChild(table);
    };
    //Naechsten Spieler als aktiven Spieler festlegen
    Game.prototype.nextPlayersTurn = function () {
        if (this.activePlayer == this.players[this.playerCount - 1]) {
            this.activePlayer = this.players[0];
        }
        else {
            this.activePlayer = this.players[this.activePlayer.PlayerID + 1];
        }
    };
    //Funktion fuer den Umgang mit dem anklicken eines Spielfelds
    Game.prototype.fieldClickHandler = function (x, y) {
        if (!this.gameActive)
            return; //Wenn das spiel nicht aktiv ist sollen auch keine Zuege erlaubt sein
        this.activePlayer.doMove(x, y);
        //hochzaehlen der total Moves fuer Berechnung notwendig
        this.totalMoves++;
        //Ueberpruefen ob das Spiel duch den Zug gewonnen wurde
        var gameWon = this.checkGameWon(x, y, this.activePlayer);
        //Fallunterscheidung in Gewonnen, Unentschieden und keines der beiden.
        if (gameWon == 1) {
            this.gameWon(this.activePlayer);
        }
        else if (gameWon == -1) {
            this.gameDrawn();
        }
        else {
            //Wenn das Spiel nicht gewonnen wurde ist der naechste Spieler (Computer) dran
            this.nextPlayersTurn();
            //Computer Zug, Koordinaten des gesetzten Felds muessen zur Gewinnueberpruefung aufgenommen werden
            var comcoord = this.comDoTurn();
            this.totalMoves++;
            //Ueberpruefen anhand aufgenommener Koordinaten ob das Spiel gewonnen wurde 
            var gameWon = this.checkGameWon(comcoord[0], comcoord[1], this.activePlayer);
            //Erneute Fallunterscheidung in Gewonnen, Unentschieden und keines der beiden.
            if (gameWon == 1) {
                this.gameWon(this.activePlayer);
            }
            else if (gameWon == -1) {
                this.gameDrawn();
            }
            else {
                this.nextPlayersTurn();
            }
        }
        this.drawField();
    };
    //Computer Zug
    Game.prototype.comDoTurn = function () {
        console.log("Com Enemy is : " + this.activePlayer.PlayerName);
        //Kann das Spiel im naechsten Zug gewonnen werden?
        for (var row = 0; row < this.fieldSize; row++) {
            for (var column = 0; column < this.fieldSize; column++) {
                //Ist das Feld frei?
                if (this.field[row][column] == -1) {
                    //Und das Spiel kann dadurch gewonnen werden?
                    if (this.checkGameWon(row, column, this.activePlayer)) {
                        //Falls ja, markiere das entsprechende Feld
                        this.field[row][column] = this.activePlayer.PlayerID;
                        return [row, column];
                    }
                }
            }
        }
        // Wenn das Spiel nicht gewonnen werden kann, waehle ein zufaelliges freies Feld....
        var attempts = 0;
        var x = Math.floor(Math.random() * this.fieldSize - 1) + 1;
        var y = Math.floor(Math.random() * this.fieldSize - 1) + 1;
        do {
            x = Math.floor(Math.random() * this.fieldSize - 1) + 1;
            y = Math.floor(Math.random() * this.fieldSize - 1) + 1;
            attempts++;
        } while (this.field[x][y] != -1 || attempts >= 100);
        //...und besetze es
        this.field[x][y] = this.activePlayer.PlayerID;
        return [x, y];
    };
    // Return Values: 1 - Win, 0 - No Win, -1 - Draw
    Game.prototype.checkGameWon = function (x, y, player) {
        //check col
        for (var i = 0; i < this.fieldSize; i++) {
            if (this.field[x][i] != this.activePlayer.PlayerID)
                break;
            if (i == this.fieldSize - 1) {
                return 1;
            }
        }
        //check row
        for (var i = 0; i < this.fieldSize; i++) {
            if (this.field[i][y] != player.PlayerID)
                break;
            if (i == this.fieldSize - 1) {
                return 1;
            }
        }
        //check diag
        if (x == y) {
            //we're on a diagonal
            for (var i = 0; i < this.fieldSize; i++) {
                if (this.field[i][i] != player.PlayerID)
                    break;
                if (i == this.fieldSize - 1) {
                    return 1;
                }
            }
        }
        //check anti diag
        if (x + y == this.fieldSize - 1) {
            for (var i = 0; i < this.fieldSize; i++) {
                if (this.field[i][(this.fieldSize - 1) - i] != player.PlayerID)
                    break;
                if (i == this.fieldSize - 1) {
                    return 1;
                }
            }
        }
        //check draw
        if (this.totalMoves >= (Math.pow(this.fieldSize, 2))) {
            return -1;
        }
        return 0;
    };
    //Spiel gewonnen Ausgabe
    Game.prototype.gameWon = function (player) {
        dialogsHtml.hidden = false;
        this.roundsPlayed++;
        if (this.roundsPlayed >= this.fieldSize) {
            //Spiel zu Ende, wenn Rundenanzahl groesser als die Feldgroesse ist
            player.gamesWon++;
            player.Score += 1;
            this.endGame();
        }
        else {
            //Naechste Runde
            player.gamesWon++;
            player.Score += 1;
            this.continueGame();
        }
    };
    //Unentschieden Ausgabe
    Game.prototype.gameDrawn = function () {
        this.roundsPlayed++;
        if (this.roundsPlayed >= this.fieldSize) {
            //Spiel zu ende
            this.endGame();
        }
        else {
            //Naechste Runde
            this.continueGame();
        }
    };
    //Spiel beendet
    Game.prototype.endGame = function () {
        clearInterval(this.intervalHandle); // Stop timer
        //Ausgabe des Gewinners
        if (this.players[0].gamesWon > this.players[1].gamesWon) {
            dialogsHtml.innerHTML = "Schade<br> der " + this.players[0].PlayerName + " hat " + this.players[0].gamesWon + " Spiele gewonnen und einen Score von " + this.players[0].Score;
        }
        else if (this.players[0].gamesWon < this.players[1].gamesWon) {
            dialogsHtml.innerHTML = "Gl&uumlckwunsch " + this.players[1].PlayerName + "<br>Du hast " + this.players[1].gamesWon + " Spiele gewonnen und einen Score von " + this.players[1].Score;
        }
        else if (this.players[0].gamesWon == 0 && this.players[1].gamesWon == 0) {
            dialogsHtml.innerHTML = "Leider eine Niete auf beiden Seiten :(";
        }
        else {
            dialogsHtml.innerHTML = "Unentschieden";
        }
        dialogsHtml.innerHTML += "<br>Das Spiel wird in 5 Sekunden zur&uumlckgesetzt.";
        this.gameActive = false;
        setTimeout(function () { return window.location.reload(); }, 5000); //Seite nach 5s neu laden um das Spiel zurueckzusetzen
    };
    return Game;
}());
//Beziehen auf HTML Element
var dialogsHtml;
var gameHtml;
var game;
//Beim laden der Seite wird das Startmenue angezeigt und die HTML Elemente werden selektiert
window.addEventListener("load", function () {
    gameHtml = document.querySelector("#game");
    dialogsHtml = document.querySelector("#dialogs");
    startmenue();
});
//Startmenue wird innerhalb des dialog-Felds im HTML-File angezeigt
function startmenue() {
    dialogsHtml.innerHTML = "Schwierigkeit w&aumlhlen<br>";
    //Ausgeben der Button zum waehlen der verschiedenen Schwierigkeiten
    var easyButton = document.createElement("button");
    var advancedButton = document.createElement("button");
    var proButton = document.createElement("button");
    //Namen geben
    easyButton.innerHTML = "Einfach";
    advancedButton.innerHTML = "Mittel";
    proButton.innerHTML = "Schwer";
    dialogsHtml.appendChild(easyButton);
    dialogsHtml.appendChild(advancedButton);
    dialogsHtml.appendChild(proButton);
    //Zuordnen der Feldgrössen zu den jewiligen Schwierigkeitsstufen
    easyButton.addEventListener("click", function () { startGame(3); });
    advancedButton.addEventListener("click", function () { startGame(4); });
    proButton.addEventListener("click", function () { startGame(5); });
}
//Spielstart auf ausgewahltem Brett
function startGame(gameSize) {
    dialogsHtml.innerHTML = "";
    //Instanzieren des Spiels, hinzufuegen der beiden Spieler und festlegen der Steine
    game = new Game(gameSize, gameHtml, dialogsHtml);
    game.addPlayer("Computer", "O", "fa fa-circle-o");
    game.addPlayer("Player", "X", "fa fa-times");
    game.startGame();
}
//Weiterleiten des click events an die Instanz der Klasse
function fieldClicked(row, col) {
    game.fieldClickHandler(row, col);
}
