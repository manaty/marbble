class PlayerComponent{
  constructor(playerControler){
    this.controler = playerControler;
    this.model = playerControler.model;

    //FIXME introduce RackComponent
    this.rackBgDivs=[];

    let i = this.controler.playerIndex;
    this.playerDiv=document.createElement('div');
    this.playerDiv.id="mbb_player_"+i;
    this.playerDiv.className="player";

    this.playerScoreDiv= document.createElement('div');
    this.playerScoreDiv.id="playerScore_"+i;
    this.playerScoreDiv.className="playerScore";
    this.playerDiv.appendChild(this.playerScoreDiv);

    this.playerNameDiv= document.createElement('div');
    this.playerNameDiv.className="playerName";
    this.playerDiv.appendChild(this.playerNameDiv);

    this.playerRackDiv= document.createElement('div');
    this.playerRackDiv.id="playerRack_"+i;
    this.playerRackDiv.className="playerRack";
    let j=0;
    for(j=0;j<7;j++){
      let tileBgDiv=this.buildTileBg(0,0,j,"player_tileBg_"+i+"_"+j);
      this.playerRackDiv.appendChild(tileBgDiv);
      this.rackBgDivs.push(tileBgDiv);
      tileBgDiv.style.border="0px";
      tileBgDiv.style.borderRadius="0px";
      tileBgDiv.playerIdx=i;
      tileBgDiv.rackIdx=j;
    }
    //this.playerDiv.appendChild(this.playerRackDiv);
  }

  draw(playerWidthInPx,playerHeightInPx){
    if(!playerWidthInPx){
      playerWidthInPx=this.playerWidthInPx;
      playerHeightInPx=this.playerHeightInPx;
    } else {
      this.playerWidthInPx=playerWidthInPx;
      this.playerHeightInPx=playerHeightInPx;
    }
    let playerIdx=this.model.idx;
    this.playerDiv.style.width = playerWidthInPx+"px";
    this.playerDiv.style.height = (playerHeightInPx/2)+"px";
    this.playerDiv.style.left = playerWidthInPx*playerIdx+"px";
    this.playerDiv.style.bottom = "0px";
    if(playerIdx==this.controler.gameControler.model.playerToPlay){
      this.playerDiv.classList.add("selected");
    } else {
      this.playerDiv.classList.remove("selected");
    }
    this.playerScoreDiv.style.fontSize=(playerHeightInPx/2-2)+"px";
    this.playerScoreDiv.style.height = (playerHeightInPx/2)+"px";
    this.playerScoreDiv.innerHTML= this.model.score;

    this.playerNameDiv.style.fontSize=(playerHeightInPx/2-2)+"px";
    this.playerNameDiv.style.height = (playerHeightInPx/2)+"px";
    this.playerNameDiv.innerHTML= this.model.username;
}

  drawRack(rackWidthInPx,rackHeightInPx){
    if(!rackWidthInPx){
      rackWidthInPx=this.rackWidthInPx;
      rackHeightInPx=this.rackHeightInPx;
    } else {
      this.rackWidthInPx=rackWidthInPx;
      this.rackHeightInPx=rackHeightInPx;
    }
    if(this.model.idx!=this.controler.gameControler.model.playerToPlay){
      this.playerRackDiv.style.display="none";
    } else {
      this.playerRackDiv.style.display="block";
      this.playerRackDiv.style.height = (rackHeightInPx-2)+"px";
      this.playerRackDiv.style.width = (rackWidthInPx-2)+"px";
      let tileSizeInPx=Math.min(rackWidthInPx/7,rackHeightInPx)-1;
      for(let j=0;j<7;j++){
        this.drawTile(tileSizeInPx,j);
      }
    }
  }

  buildTileBg(tileBg,i,j,id){
       let tileBgDiv=document.createElement('div');
       tileBgDiv.className="tileBg";
       tileBgDiv.id=id;
       tileBgDiv.classList.add("tileBg"+tileBg);
       tileBgDiv.x=j;
       tileBgDiv.y=15-i;
       tileBgDiv.acceptsDropping=function(el, tileBgDiv, originTileBg, sibling){
         if(tileBgDiv.rackIdx!=undefined && tileBgDiv.tileId!=null && originTileBg.rackIdx==undefined){
           return false;
         }
         if(originTileBg.rackIdx!=undefined && tileBgDiv.tileId!=null){
           if(originTileBg.rackIdx==tileBgDiv.rackIdx){
             return false;
           }
         }
         return true;
       }
       tileBgDiv.onDropped=function(tileDiv, tileBgDiv, originTileBg, sibling){
         let tileComponent=tileDiv.component;
         let tile = tileComponent.model;
         let player= tileComponent.playerControler.model;
         console.log("tileBgDiv.rackIdx="+tileBgDiv.rackIdx+" originTileBg.rackIdx="+originTileBg.rackIdx);
         if(originTileBg.rackIdx!=undefined && tileBgDiv.tileId!=undefined){
           let tileToSwitch = document.getElementById(tileBgDiv.tileId);
           player.rack[originTileBg.rackIdx]=tileToSwitch.component.model;
           tileToSwitch.component.model.setRackIdx(originTileBg.rackIdx);
           originTileBg.tileId=tileToSwitch.id
         } else {
           originTileBg.tileId=null;
         }
         let temp=player.rack[tileBgDiv.rackIdx];
         player.rack[tileBgDiv.rackIdx]=tileDiv.component.model;;
         if(tile.rackIdx!=null && !tileBgDiv.tileId){
           player.rack[tile.rackIdx]=null;
         } else if(tile.rackIdx!=null) {
           player.rack[tile.rackIdx]=temp;
         }
         tile.setRackIdx(tileBgDiv.rackIdx);
         tileBgDiv.tileId=tile.id;
         tileComponent.playerControler.draw();
       }
       tileBgDiv.onOver=function(tileDiv, tileBgDiv, originTileBg){
         tileDiv.compenent.draw(tileBgDiv.clientHWidth,tileDiv);
       }
       tileDragula.containers.push(tileBgDiv);
       return tileBgDiv;
     }

  drawTile(tileSizeInPx,j){
    let tileBgDiv=this.rackBgDivs[j];
    tileBgDiv.style.width = (tileSizeInPx)+"px";
    tileBgDiv.style.height = (tileSizeInPx)+"px";
    tileBgDiv.style.left=j*tileSizeInPx+"px";
    tileBgDiv.style.top=0+"px";
    tileBgDiv.tileSizeInPx=tileSizeInPx;
    if(this.model.rack[j]){
      while (tileBgDiv.hasChildNodes()) {
          tileBgDiv.removeChild(tileBgDiv.lastChild);
      }
      let tileDiv = this.model.rack[j].component.draw(tileSizeInPx);
      tileBgDiv.appendChild(tileDiv);
    }
  }


  drawScore(){
      this.playerScoreDiv.innerHTML= this.model.score;
  }
}
