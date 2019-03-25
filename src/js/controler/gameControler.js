class GameControler{

  constructor(screenDivId){
    this.currentAction=null;
    this.model = new Game();
    this.component = new GameComponent(screenDivId,this);
    this.playerControlers=[];
  }

  addPlayer(name,lang){
    let playerControler = new PlayerControler(this.playerControlers.length,name,lang,this);
    this.playerControlers.push(playerControler);
    this.model.players.push(playerControler.model);
    this.component.playersDiv.appendChild(playerControler.component.playerDiv);
    this.component.playerRacksDiv.appendChild(playerControler.component.playerRackDiv);
  }

  draw(){
    this.component.draw();
  }

  setTranslation(horizontalWord,horizontalLang,verticalWord,verticalLang){
    let translationHTML="";
    let lang=this.model.getPlayer().lang;
    if(horizontalWord!=null && lang!=horizontalLang){
      translationHTML=horizontalWord+":"+this.model.getTranslatedWord(horizontalLang,horizontalWord);
    }
    if(verticalWord!=null && lang!=verticalLang){
      translationHTML+="<br/>"+verticalWord+":"+this.model.getTranslatedWord(verticalLang,verticalWord);
    }
    this.component.translationDiv.innerHTML=translationHTML;
  }

  shuffleRack(){
      if(this.currentAction==null){
        this.currentAction="shuffle";
        let playerControler=this.playerControlers[this.model.playerToPlay];
        for(let i=0;i<10;i++){
           playerControler.shuffleRackTiles();
        }
        this.currentAction=null;
      }
   }

  gatherTiles(){
    let playerControler=this.playerControlers[this.model.playerToPlay];
    if(this.currentAction==null){
      this.currentAction="gather";
      playerControler.gatherRackTiles(this.currentAction);
      this.currentAction=null;
    } else if(this.currentAction=="swapTiles"){
      playerControler.gatherRackTiles(this.currentAction);
    }
  }

  swapTiles(){
    if(this.currentAction==null){
      this.gatherTiles();
      this.currentAction="swapTiles";
      this.component.swapTilesDiv.classList.toggle("selected");
    } else if(this.currentAction=="swapTiles"){
      this.component.swapTilesDiv.classList.toggle("selected");
      let playerControler=this.playerControlers[this.model.playerToPlay];
      playerControler.swapRackTiles();
      this.currentAction=null;
    }
  }

  playForGood(){
    this.play(true);
  }

  play(forGood){
    if(this.currentAction==null){
      this.currentAction="play";
      let result = this.model.play(forGood,this.round==1);
      if(result=="NOTHING_PLAYED"){ //nothing has been played
        this.currentAction=null;
        return;
      }
      if(result=="LETTERS_NOT_ALIGNED"){
        this.currentAction=null;
        return;
      }
      if(result=="STAR_NOT_COVERED"){
        if(forGood){
          alert("First word must cover the star in the middle of the board");
        }
        this.currentAction=null;
        return;
      }
      if(result=="HOLES_EXIST"){
        if(forGood){
          alert("there are holes");
        }
        this.currentAction=null;
        return;
      }
      if(result=="MUST_REUSE_LETTER"){
        if(forGood){
          alert("The word must reuse letters of the board");
        }
        this.currentAction=null;
        return;

      }
      if(result=="INVALID_WORD"){
        if(forGood){
          alert(" the word doesnt exist");
        }
        this.currentAction=null;
        return;
      }

      if(!forGood){
        if(result!="NO_POINT"){
        this.component.displayTempScore(result);
        }
        this.currentAction=null;
        return;
      }
      let playerControler=this.playerControlers[this.model.playerToPlay];
      for(let i=0;i<7;i++){
        if(this.model.getPlayer().previousRack[i]){
            let tile=this.model.getPlayer().previousRack[i];
            tile.isPlayed=true;
            tile.component.tileDiv.draggable = false;
            tile.component.tileDiv.parentNode.removeEventListener("dragover",this.component.allowDrop);
        }
      }

      for(let i=0;i<7;i++){
        this.model.getPlayer().previousRack[i]=null;
      }
      this.model.round++;
      playerControler.fillRack(true);
      this.currentAction=null;
      this.nextTurn();
    }
    else if(this.currentAction=="swapTiles"){
      this.swapTiles();
    }
  }

  pass(){
    if(this.currentAction==null){
       this.gatherTiles();
       this.model.getPlayer().passed=true;
       this.nextTurn();
    }
  }

  nextTurn(){
    let result = this.model.nextTurn();
    if(result=="END_GAME"){
      alert("Game ended");
      location.reload();
    } else {
      this.draw();
    }
  }
}
