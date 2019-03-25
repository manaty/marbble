class PlayerControler{
   constructor(playerIndex,username,lang, gameControler){
     this.playerIndex=playerIndex;
     this.gameControler=gameControler;
     this.model = new Player(gameControler.model,playerIndex,username,lang);
     this.component = new PlayerComponent(this);
     this.initBag();
     this.fillRack();
   }

   draw(playerWidthInPx,playerHeightInPx,rackWidthInPx,rackHeightInPx){
     this.component.draw(playerWidthInPx,playerHeightInPx);
     this.component.drawRack(rackWidthInPx,rackHeightInPx);
   }

    initBag(){
      //FIXME move in game controler
      let tileId=0;
      this.model.bag=new Array();
      this.model.bagSize=0;
      let letters=letterValues[this.model.lang];
      for (var property in letters) {
        if (letters.hasOwnProperty(property)) {
          for(let i=0;i<letters[property].n;i++){
            let v=letters[property].v,n=letters[property].n;
            let tile = new Tile(this.playerIndex+"_"+tileId,this.model,property,v,n);
            let tileComponent=new TileComponent(tile,this);
            this.model.bag.push(tile);
            this.model.bagSize++;
            tileId++;
          }
        }
      }
      this.model.shuffleBag();
    }

    fillRack(){
      for(let i=0;i<this.model.rack.length;i++){
        if(this.model.rack[i]==null){
          let tile = this.model.bag.pop();
          this.model.rack[i]=tile;
          tile.player=this.model;
          tile.setRackIdx(i);
          this.component.rackBgDivs[i].tileId=tile.id;
        }
      }
    }


    swapRackTiles(){
       let exchanged=false;
          for(let i=0;i<7;i++){
            if(this.model.rack[i]!=null && this.model.rack[i].component.isToSwap){
              this.model.rack[i].component.tileDiv.style.transform="none";
              this.model.rack[i].component.tileDiv.remove();
              this.model.bag.push(this.model.rack[i]);
              this.model.shuffleBag();
              this.model.rack[i]=null;
              exchanged=true;
            }
          }
        if(exchanged){
          this.fillRack(true);
          this.gameControler.nextTurn();
      }
    }

    gatherRackTiles(currentAction){
      if(currentAction=="gather"){
        for(let i=0;i<7;i++){
          if(this.model.previousRack[i]!=null){
            let tileBg1=this.model.previousRack[i].component.tileDiv.parentNode;
            let tileBg2=document.getElementById("player_tileBg_"+this.playerIndex+"_"+i);
            let tile1=tileBg1.removeChild(tileBg1.childNodes[0]);
            this.model.rack[i]=tile1.component.model;
            tileBg2.tileId=tile1.id;
            tile1.component.model.setRackIdx(i);
            this.model.previousRack[i]=null;
          }
        }
        currentAction=null;
        let tileBg2=document.getElementById("player_tileBg_"+this.playerIndex+"_"+0);
        this.draw(null,null,null,tileBg2.style.height);
      }
      else if(currentAction=="swapTiles"){
        for(let i=0;i<7;i++){
          if(this.model.rack[i]!=null && this.model.rack[i].isToSwap){
            this.model.rack[i].toggleSwap();
          }
        }
      }
    }

    shuffleRackTiles(){
      this.model.shuffleRackTiles();
      this.draw();
    }

    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    getTranslatedWord(originLang,word){
      if(originLang!=currentPlayer.lang && window.marbbleDic[originLang][currentPlayer.lang][word]){
        return window.marbbleDic[originLang][currentPlayer.lang][word];
      } else {
        return word;
      }
    }
}
