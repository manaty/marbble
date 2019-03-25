class GameComponent{
  constructor(screenDivId,controler){
    this.controler=controler;
    this.screenDiv =  document.getElementById(screenDivId);
    if(!this.screenDiv){
      throw "Missing board div "+screenDivId;
    }

    this.playersDiv= document.createElement('div');
    this.playersDiv.id="mbb_players";
    this.playersDiv.className="players";
    let playerMaskDiv= document.createElement('div');
    playerMaskDiv.id="mbb_player_mask";
    playerMaskDiv.className="playerMask";
    playerMaskDiv.addEventListener("drop",function(){});
    playerMaskDiv.addEventListener("click",function(){});
    playerMaskDiv.addEventListener("dbclick",function(){});
    this.playersDiv.appendChild(playerMaskDiv);
    this.screenDiv.appendChild(this.playersDiv);
    this.playerComponents=[];



    this.boardDiv = document.createElement('div');
    this.boardDiv.id = "mbb_board";
    this.boardDiv.className="board";
    let i,j;
    for(i=0;i<15;i++){
      for(j=0;j<15;j++){
        let tileBgDiv=this.buildTileBg(boardBg[i*15+j],i,j,"board_tileBg_"+i+"_"+j);
        this.boardDiv.appendChild(tileBgDiv);
      }
    }
    this.screenDiv.appendChild(this.boardDiv);


    this.playerRacksDiv= document.createElement('div');
    this.playerRacksDiv.className="playerRack";
    this.screenDiv.appendChild(this.playerRacksDiv);

    this.translationDiv= document.createElement('div');
    this.translationDiv.className="translation";
    this.screenDiv.appendChild(this.translationDiv);

    this.menuDiv= document.createElement('div');
    this.menuDiv.id="mbb_menu";
    this.menuDiv.className="menu";
    this.screenDiv.appendChild(this.menuDiv);

    this.swapTilesDiv= document.createElement('div');
    this.swapTilesDiv.className="menuButton";
    this.swapTilesDiv.classList.add("swapButton");
    this.swapTilesDiv.addEventListener("click", this.controler.swapTiles.bind(this.controler),true);
    this.menuDiv.appendChild(this.swapTilesDiv);

    this.tempScoreDiv= document.createElement('div');
    this.tempScoreDiv.className="tempScore";
    this.screenDiv.appendChild(this.tempScoreDiv);


    this.shuffleDiv= document.createElement('div');
    this.shuffleDiv.className="menuButton";
    this.shuffleDiv.classList.add("shuffleButton");
    this.shuffleDiv.addEventListener("click", this.controler.shuffleRack.bind(this.controler),true);
    this.menuDiv.appendChild(this.shuffleDiv);

    this.gatherTilesDiv= document.createElement('div');
    this.gatherTilesDiv.className="menuButton";
    this.gatherTilesDiv.classList.add("gatherButton");
    this.gatherTilesDiv.addEventListener("click", this.controler.gatherTiles.bind(this.controler),true);
    this.menuDiv.appendChild(this.gatherTilesDiv);

    this.passDiv= document.createElement('div');
    this.passDiv.className="menuButton";
    this.passDiv.classList.add("passButton");
    this.passDiv.addEventListener("click",this.controler.pass.bind(this.controler),true);
    this.menuDiv.appendChild(this.passDiv);

    this.playDiv= document.createElement('div');
    this.playDiv.className="menuButton";
    this.playDiv.classList.add("playButton");
    this.playDiv.addEventListener("click",this.controler.playForGood.bind(this.controler),true);
    this.menuDiv.appendChild(this.playDiv);

  }

  draw(){
    let docH=document.documentElement.clientHeight-20;
    let docW=document.documentElement.clientWidth-20;

    let playerHeightInPx = Math.max(32,docH*0.117);
    let menuWidthInPx = playerHeightInPx;
    let nbPlayers= this.controler.playerControlers.length;

    let boardSizeInPx = docH-(playerHeightInPx*2.5);
    if(boardSizeInPx>(docW-menuWidthInPx)){
      boardSizeInPx = docW-menuWidthInPx;
    }
    let playersWidthInPx = boardSizeInPx;
    let playerWidthInPx = boardSizeInPx/nbPlayers;

    this.playersDiv.style.width = playersWidthInPx+"px";
    this.playersDiv.style.height = (playerHeightInPx/2)+"px";
    this.playersDiv.style.top = "0px";

    this.playerRacksDiv.style.top = (docH-2*playerHeightInPx)+"px";

    this.translationDiv.style.width = playersWidthInPx+"px";
    this.translationDiv.style.height = playerHeightInPx+"px";
    this.translationDiv.style.top = (docH-playerHeightInPx)+"px";

    // this.menuDiv.style.width = menuWidthInPx+"px";
    this.menuDiv.style.height = playerHeightInPx+"px";
    this.menuDiv.style.width = boardSizeInPx+"px";
    this.menuDiv.style.top = (docH-playerHeightInPx+2)+"px";
    //this.menuDiv.style.paddingTop = (menuWidthInPx*0.2)+"px";

    this.shuffleDiv.style.width = (menuWidthInPx*0.8)+"px";
    this.shuffleDiv.style.height = (menuWidthInPx*0.6)+"px";

    this.gatherTilesDiv.style.width = (menuWidthInPx*0.8)+"px";
    this.gatherTilesDiv.style.height = (menuWidthInPx*0.6)+"px";
    this.swapTilesDiv.style.width = (menuWidthInPx*0.8)+"px";
    this.swapTilesDiv.style.height = (menuWidthInPx*0.6)+"px";
    this.passDiv.style.width = (menuWidthInPx*0.8)+"px";
    this.passDiv.style.height = (menuWidthInPx*0.6)+"px";
    this.playDiv.style.width = (menuWidthInPx*0.8)+"px";
    this.playDiv.style.height = (menuWidthInPx*0.6)+"px";

    this.boardDiv.style.width = boardSizeInPx+"px";
    this.boardDiv.style.height = boardSizeInPx+"px";
    this.boardDiv.style.left = "0px";
    this.boardDiv.style.top = (playerHeightInPx/2)+"px";

    for(let playerControler of this.controler.playerControlers){
      playerControler.draw(playerWidthInPx,playerHeightInPx,boardSizeInPx,playerHeightInPx);
    }

    let tileSizeInPx = boardSizeInPx/15;
    let i,j;
    for(i=0;i<15;i++){
      for(j=0;j<15;j++){
        let tileBgDiv= document.getElementById("board_tileBg_"+i+"_"+j);
        this.drawTileBg(tileSizeInPx,tileBgDiv,i,j);
        if(this.controler.model.board[i*15+j]){
          let tile=this.controler.model.board[i*15+j];
          let childNode=tileBgDiv.childNodes[0];
          tileBgDiv.removeChild(childNode);
          tile.component.draw(tileSizeInPx);
          tileBgDiv.appendChild(tile.component.tileDiv);
        }
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
       tileBgDiv.acceptsDropping=function(el, tileBgDiv, source, sibling){
         return tileBgDiv.tileId==null;
       }
       tileBgDiv.onDropped=function(tileDiv, tileBdDiv, source, sibling){
         let tile = tileDiv.component.model;
         let gameComponent = tileDiv.component.playerControler.gameControler.component;
         tile.setBoardPosition(tileBdDiv.x,tileBdDiv.y);
         tileBdDiv.tileId=tile.id;
         tileDiv.component.playerControler.gameControler.play(false);
         source.tileId=null;
       }
       tileBgDiv.onOver=function(tileDiv, tileBgDiv, originTileBg){
         tileDiv.compenent.draw(tileBgDiv.clientHWidth,tileDiv);
       }
       tileDragula.containers.push(tileBgDiv);
       return tileBgDiv;
  }

  drawTileBg(tileSizeInPx,tileBgDiv,i,j){
    tileBgDiv.style.width = (tileSizeInPx)+"px";
    tileBgDiv.style.height = (tileSizeInPx)+"px";
    tileBgDiv.style.left=j*tileSizeInPx+"px";
    tileBgDiv.style.top=i*tileSizeInPx+"px";
    tileBgDiv.style.backgroundSize=(0.4*tileSizeInPx)+"px";
    tileBgDiv.tileSizeInPx=tileSizeInPx;
    return tileBgDiv;
  }

  displayTempScore(score){
    this.tempScoreDiv.innerHTML=score;
    this.tempScoreDiv.style.display="block";
    let f=function(){
       this.tempScoreDiv.style.display="none";
    }
    setTimeout(f.bind(this), 4000);
  }

}
