
// Funktion fuer die Formartierung der Zeit innerhalb des Timer 
function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
      return "0" + valString;
    } else {
      return valString;
    }
  }

//Die Klasse Player wird angelegt um die individuellen Spielerdaten zu verwalten
class Player{
    PlayerID : number = -1;
    PlayerSymbol : String = "!"; //"Alphabetisches" Symbol eines Spielers, koennte als Alternative zu fa-icon verwendet werden, aus Zeitgruenden nicht implementiert
    PlayerFAIcon : String = "fa fa-exclamation-triangle";
    PlayerName : String = "Undefined Player!";
    Score : number = 0; //Aktuell gilt Score = gamesWon, perspektivisch koennte der Score anders berechnet werden, bspw abhaengig von Zeit
    gamesWon : number = 0;
    game : Game;

    constructor(PlayerID : number, PlayerSymbol : String, PlayerFAIcon : String ,PlayerName : String, game : Game){
        this.PlayerID = PlayerID;
        this.PlayerSymbol = PlayerSymbol;
        this.PlayerFAIcon = PlayerFAIcon;
        this.PlayerName = PlayerName;
        this.game = game;
    }

    //Markieren einer gegebenen Stelle auf dem Spielfeld mit eigener SpielerID
    doMove(x : number, y : number){
        this.game.field[x][y] = this.PlayerID;
    }
}

//Felstlegen des allgemeinen Spiels und den Eckdaten
class Game{
    field : number[][] = [];
    fieldSize : number = 0;

    players : Player[] = [];
    playerCount : number = 0;
    activePlayer : Player;

    totalMoves : number = 0;
    gameActive : boolean = false;
    gameTime : number = 0;
    intervalHandle : number;
    roundsPlayed : number = 0;
    
    playingField : HTMLElement;
    dialogElement : HTMLElement;
    

    //Konstruktor, legt HTML Elemente und Spielfeldgroesse fest
    constructor(fieldSize:number,playingField : HTMLElement, dialogElement : HTMLElement){
        this.fieldSize = fieldSize;
        this.playingField = playingField;
        this.dialogElement = dialogElement;
    }

    
    //Funktion fuer den ersten Start des Spieles
    startGame() : void{
        this.gameActive = true; 
        dialogsHtml.hidden = false;
        this.gameTime = 0;
        //Hinzufuegen des Timers und des Rundenzaehlers im dialog HTML-Element
        dialogsHtml.innerHTML = "Time : " + pad(Math.floor(this.gameTime / 60)) + " : " + pad(this.gameTime % 60) + "<br>" + "Runde " + (this.roundsPlayed+1) + " von " +this.fieldSize;
        //Timer wird beim Start einer Variablen zugewiesen, um ihn spaeter geziel wieder beenden zu können
        this.intervalHandle = setInterval(() => this.handleTimer(),1000);
        this.continueGame();
        
    }

    //Aktiv nach der zweiten Runde. Verantwortlich fuers zuruecksetzten der Spielzuege und des Feldes
    continueGame() : void{
        this.totalMoves = 0;
        this.activePlayer = this.players[0];
        this.clearField();

        this.drawField();
        this.comDoTurn();
        this.totalMoves++;
        this.nextPlayersTurn();
        this.drawField();

        //raus Kontrolle - Ausgabe zu Testzwecken
        for ( let row: number = 0; row < this.fieldSize; row++) {
            console.log(this.field[row][0] + " " + this.field[row][1] + " " + this.field[row][2]);
        }
        
    }
    
    //Methode fuer Umgang mit dem Timer. Wird jede Sekunde aufgerufen
    handleTimer() : void{
        this.gameTime++;
        dialogsHtml.innerHTML = "";
        for(let i = 0; i <= this.playerCount-1; i++){
            dialogsHtml.innerHTML += "" + this.players[i].PlayerName + "\t\t" + this.players[i].Score +"<br>"
        } 
        //Visuellen Timer updaten
        dialogsHtml.innerHTML += "<br>Time : " + pad(Math.floor(this.gameTime / 60)) + " : " + pad(this.gameTime % 60) + "<br>" + "Runde " + (this.roundsPlayed+1) + " von " +this.fieldSize;
    }

    //Fuegt einen Spieler ans Ende der Spielerliste an
    addPlayer(playerName : String, playerSymbol : String, PlayerFAIcon : String) : void{
        if(!this.gameActive)
            this.players.push(new Player(this.playerCount++, playerSymbol, PlayerFAIcon, playerName,this));    
    }

    //Zuordnung der Spieler zur jeweiligen ID
    findPlayerByID(id : number) : Player{
        for(var i = 0; i <= this.playerCount; i++){
            if(id == this.players[i].PlayerID)
                return this.players[i];
        }
        return new Player(-1,null,null,null,null);
    }

    //Spielfeld leeren / in den Ursprungszustand versetzen
    clearField() : void {
        for ( let row: number = 0; row < this.fieldSize; row++) {
            this.field[row] = [];
            for (let column: number = 0; column < this.fieldSize; column++) {
                this.field[row][column] = -1;
            }
        }
    }

    //Anzeigen des Spielfeldes als Tabelle im game HTML-Element
    drawField() : void{
        //Aktuelles Feld loeschen
        this.playingField.innerHTML = "";
    
        var table = document.createElement('table');
        var tableBody = document.createElement('tbody');
        table.appendChild(tableBody);
        
        for ( let row: number = 0; row < this.fieldSize; row++) {
            var tr = document.createElement('tr');
            tableBody.appendChild(tr);
            for (let column: number = 0; column < this.fieldSize; column++) {
    
                var td = document.createElement('td');
                td.width = '35px'; //Breite Variabel setzen
                td.height = '35px'; //Höhe Variabel
                let fieldButton : HTMLElement = document.createElement("button");
                fieldButton.className = ".gameButton";
    
                //Besetztes Feld
                if(this.field[row][column] != -1){
                    fieldButton.innerHTML = "<i class='" + this.findPlayerByID(this.field[row][column]).PlayerFAIcon + "'></i>";
                    fieldButton.className += " .occupiedGameField";
                }else{
                //freies Feld
                    fieldButton.innerHTML = " ";
                    fieldButton.className += " .freeGameField";
                    fieldButton.addEventListener("click", function (): void {fieldClicked(row,column); });
                }
    
                td.appendChild(fieldButton);
                tr.appendChild(td);
            }
        }
        //Anfuegen der erstellten Tabelle ans HTML Spielfeld
        this.playingField.appendChild(table);
    }

    //Naechsten Spieler als aktiven Spieler festlegen
    nextPlayersTurn() : void{
        if(this.activePlayer == this.players[this.playerCount-1]){
            this.activePlayer = this.players[0];
        }else{
            this.activePlayer = this.players[this.activePlayer.PlayerID + 1];
        }
    }

    //Funktion fuer den Umgang mit dem anklicken eines Spielfelds
    fieldClickHandler(x:number, y : number) {

        if(!this.gameActive)
            return; //Wenn das spiel nicht aktiv ist sollen auch keine Zuege erlaubt sein
        
        this.activePlayer.doMove(x,y);
        //hochzaehlen der total Moves fuer Berechnung notwendig
        this.totalMoves++;


        //Ueberpruefen ob das Spiel duch den Zug gewonnen wurde
        var gameWon : number = this.checkGameWon(x,y,this.activePlayer);

        //Fallunterscheidung in Gewonnen, Unentschieden und keines der beiden.
        if(gameWon == 1){
            this.gameWon(this.activePlayer);
        }else if(gameWon == -1){
            this.gameDrawn();
        }else{
            //Wenn das Spiel nicht gewonnen wurde ist der naechste Spieler (Computer) dran
            this.nextPlayersTurn();
            //Computer Zug, Koordinaten des gesetzten Felds muessen zur Gewinnueberpruefung aufgenommen werden
            var comcoord : number[]= this.comDoTurn();
            this.totalMoves++;
            //Ueberpruefen anhand aufgenommener Koordinaten ob das Spiel gewonnen wurde 
            var gameWon : number = this.checkGameWon(comcoord[0],comcoord[1],this.activePlayer);
            //Erneute Fallunterscheidung in Gewonnen, Unentschieden und keines der beiden.
            if(gameWon == 1){
                    this.gameWon(this.activePlayer);
            }else if(gameWon == -1){
                    this.gameDrawn();
            }else{
                    this.nextPlayersTurn();
            }  
        }
        this.drawField();   
    }

    //Computer Zug
    comDoTurn() : number[]{
        console.log("Com Enemy is : " + this.activePlayer.PlayerName);
        //Kann das Spiel im naechsten Zug gewonnen werden?
        for ( let row: number = 0; row < this.fieldSize; row++) {
            for (let column: number = 0; column < this.fieldSize; column++) {
                //Ist das Feld frei?
                if(this.field[row][column] == -1){
                    //Und das Spiel kann dadurch gewonnen werden?
                    if(this.checkGameWon(row,column,this.activePlayer)){
                        //Falls ja, markiere das entsprechende Feld
                        this.field[row][column] = this.activePlayer.PlayerID;
                        return [row,column];
                    }
                    
                }
            }
        }

        // Wenn das Spiel nicht gewonnen werden kann, waehle ein zufaelliges freies Feld....
        let attempts = 0;
        let x = Math.floor(Math.random() * this.fieldSize-1) + 1;
        let y = Math.floor(Math.random() * this.fieldSize-1) + 1;
        do{
            x = Math.floor(Math.random() * this.fieldSize-1) + 1;
            y = Math.floor(Math.random() * this.fieldSize-1) + 1;
            attempts++;
        }while(this.field[x][y] != -1 || attempts >= 100)
        
        //...und besetze es
        this.field[x][y] = this.activePlayer.PlayerID;
        return [x,y];


    }
    

    // Return Values: 1 - Win, 0 - No Win, -1 - Draw
    checkGameWon(x : number, y : number, player : Player) : number{
        for(var i = 0; i < this.fieldSize; i++){
            if(this.field[x][i] != this.activePlayer.PlayerID)
                break;
            if(i == this.fieldSize-1){
                return 1;
            }
        }

        //check row
        for(var i = 0; i < this.fieldSize; i++){
            if(this.field[i][y] != player.PlayerID)
                break;
            if(i == this.fieldSize-1){
                return 1;
            }
        }

        //check diag
        if(x == y){
            //we're on a diagonal
            for(var i = 0; i < this.fieldSize; i++){
                if(this.field[i][i] != player.PlayerID)
                    break;
                if(i == this.fieldSize-1){
                    return 1;
                }
            }
        }

        //check anti diag
        if(x + y == this.fieldSize - 1){
            for(var i = 0; i < this.fieldSize; i++){
                if(this.field[i][(this.fieldSize-1)-i] != player.PlayerID)
                    break;
                if(i == this.fieldSize-1){
                    return 1;
                }
            }
        }

        //check draw
        if(this.totalMoves >= (Math.pow(this.fieldSize, 2))){
            return -1;
        }

        return 0;
    }

    //Spiel gewonnen Ausgabe
    gameWon(player: Player){
        
        dialogsHtml.hidden = false;
        this.roundsPlayed++;
        if(this.roundsPlayed >= this.fieldSize){
            //Spiel zu Ende, wenn Rundenanzahl groesser als die Feldgroesse ist
            player.gamesWon++;
            player.Score += 1;
            this.endGame();
            
        }else{
            //Naechste Runde
            player.gamesWon++;
            player.Score += 1;
            this.continueGame();
        }
    }

    //Unentschieden Ausgabe
    gameDrawn(){
        this.roundsPlayed++;
        if(this.roundsPlayed >= this.fieldSize){
            //Spiel zu ende
            this.endGame();  
        }else{
            //Naechste Runde
            this.continueGame();
        }
    }

    //Spiel beendet
    endGame() : void{

        clearInterval(this.intervalHandle); // Stop timer

        //Ausgabe des Gewinners
        if(this.players[0].gamesWon > this.players[1].gamesWon){
            dialogsHtml.innerHTML = "Schade<br> der " +  this.players[0].PlayerName + " hat " + this.players[0].gamesWon + " Spiele gewonnen und einen Score von " +  this.players[0].Score;
        }else if(this.players[0].gamesWon < this.players[1].gamesWon){
            dialogsHtml.innerHTML = "Gl&uumlckwunsch " +  this.players[1].PlayerName + "<br>Du hast " + this.players[1].gamesWon + " Spiele gewonnen und einen Score von " +  this.players[1].Score;
        }else if(this.players[0].gamesWon == 0 && this.players[1].gamesWon == 0){
            dialogsHtml.innerHTML = "Leider eine Niete auf beiden Seiten :(";
        }else{
            dialogsHtml.innerHTML = "Unentschieden";
        }

        dialogsHtml.innerHTML +="<br>Das Spiel wird in 5 Sekunden zur&uumlckgesetzt.";

        this.gameActive = false;

        setTimeout(() => window.location.reload(), 5000); //Seite nach 5s neu laden um das Spiel zurueckzusetzen

    }
}

//Beziehen auf HTML Element
let dialogsHtml: HTMLElement;
let gameHtml: HTMLElement;

let game : Game;


//Beim laden der Seite wird das Startmenue angezeigt und die HTML Elemente werden selektiert
window.addEventListener("load", function(): void {
    gameHtml = document.querySelector("#game");
    dialogsHtml = document.querySelector("#dialogs");
    startmenue();
});

//Startmenue wird innerhalb des dialog-Felds im HTML-File angezeigt
function startmenue(): void {
    dialogsHtml.innerHTML = "Schwierigkeit w&aumlhlen<br>";

    //Ausgeben der Button zum waehlen der verschiedenen Schwierigkeiten
    var easyButton: HTMLButtonElement = document.createElement("button");
    var advancedButton: HTMLButtonElement = document.createElement("button");
    var proButton: HTMLButtonElement = document.createElement("button");

    //Namen geben
    easyButton.innerHTML = "Einfach";
    advancedButton.innerHTML = "Mittel";
    proButton.innerHTML = "Schwer";

    dialogsHtml.appendChild(easyButton);
    dialogsHtml.appendChild(advancedButton);
    dialogsHtml.appendChild(proButton);
    
    //Zuordnen der Feldgrössen zu den jewiligen Schwierigkeitsstufen
    easyButton.addEventListener("click", function (): void { startGame(3); });
    advancedButton.addEventListener("click", function (): void { startGame(4); });
    proButton.addEventListener("click", function (): void { startGame(5); });
}

//Spielstart auf ausgewahltem Brett
function startGame(gameSize : number): void{

    dialogsHtml.innerHTML = "";

    //Instanzieren des Spiels, hinzufuegen der beiden Spieler und festlegen der Steine
    game = new Game(gameSize,gameHtml,dialogsHtml);
    game.addPlayer("Computer", "O","fa fa-circle-o");
    game.addPlayer("Player", "X", "fa fa-times");

    game.startGame();

}

//Weiterleiten des click events an die Instanz der Klasse
function fieldClicked(row,col) : void {
    game.fieldClickHandler(row,col);
}









