const tileImg=["","DL.png","TL.png","DW.png","TW.png","ST.png"];
const svgNS = "http://www.w3.org/2000/svg";
class TileComponent{

  constructor(tile,playerControler){
    this.model = tile;
    tile.component=this;
    this.playerControler=playerControler;
    this.isToSwap=false;
    this.tileSizeInPx=10;
    this.tileDiv = document.createElement('div');
    this.tileDiv.className="tile";
    this.svg = document.createElementNS(svgNS, "svg");
    this.group = document.createElementNS(svgNS, "g");
    this.textElement = document.createElementNS(svgNS,'text');
    this.group.appendChild(this.textElement);
    this.valueElement = document.createElementNS(svgNS,'text');
    this.group.appendChild(this.valueElement);
    this.svg.appendChild(this.group);
    this.tileDiv.append(this.svg);
    this.tileDiv.id=tile.id;
    this.tileDiv.component=this;
    this.tileDiv.draggable=true;
    this.tileDiv.addEventListener("click",this.click.bind(this),true);
       if(this.model.isJoker){
         this.tileDiv.addEventListener("dblclick",this.dblclick.bind(this),true);
    }
  }

  onDragged(el,source){
    let tileSizeInPx = this.playerControler.gameControler.component.boardDiv.clientWidth/15;
    this.draw(tileSizeInPx,el)
  }

  onDropped(el, target, source, sibling){
    let tileSizeInPx = target.clientWidth;
    this.draw(tileSizeInPx,el)
  }

  onCanceled(el, target, source){
    let tileSizeInPx = target.clientWidth;
    this.draw(tileSizeInPx,el)
  }


  dblclick(ev) {
    let node=ev.target;
    while(node.id.indexOf("_tileBg_")==-1){
      node=node.parentNode;
    }
    let tileComponent=node.firstChild.component;
    let playerControler = tileComponent.playerControler;
    let gameControler = playerControler.gameControler;
    let tile=tileComponent.model;
    if(playerControler.currentAction==null && node.id.indexOf("board_tileBg_")==0){
      let s=prompt("Joker letter:");
      if(s.length>0){
         tile.letter = s.substr(0,1).toLowerCase();
         gameControler.play(false);
         tileComponent.draw();
      }
    }
  }

  click(ev) {
    let node=ev.target;
    while(node.id.indexOf("_tileBg_")==-1){
      node=node.parentNode;
    }
    let tileComponent=node.firstChild.component;
    let playerControler = tileComponent.playerControler;
    let gameControler = playerControler.gameControler;
    let tile=tileComponent.model;
    if(gameControler.currentAction=="swapTiles"){
      if(tile.rackIdx!=null){
        tile.component.toggleSwap();
      }
    } else if(tile.isPlayed){
      gameControler.setTranslation(tile.horizontalWord,tile.horizontalLang,tile.verticalWord,tile.verticalLang);
    }
  }

  toggleSwap(){
      this.isToSwap=!this.isToSwap;
      if(this.isToSwap){
        this.tileDiv.style.transform="translateY("+(this.tileDiv.parentNode.tileSizeInPx/3)+"px)";
      } else {
        this.tileDiv.style.transform="none";
      }
  }

  setLetter(letter){
    if(this.isJoker){
      let letters=letterValues[this.player.lang];
      for (let l in letters) {
        if(l==letter){
          this.letter=letter;
          this.textElement.innerHTML=letter.toUpperCase();
        }
      }
    }
  }

  draw(tileSizeInPx,tileDiv){
    if(!tileSizeInPx){
      tileSizeInPx=this.tileSizeInPx;

    } else {
     this.tileSizeInPx=tileSizeInPx;
    }
      this.tileDiv.style.left=tileSizeInPx*0.1+"px";
      this.tileDiv.style.top=tileSizeInPx*0.1+"px";
      this.tileDiv.style.width=tileSizeInPx*0.8+"px";
      this.tileDiv.style.height=tileSizeInPx*0.8+"px";
      this.tileDiv.style.height=tileSizeInPx*0.8+"px";
      this.tileDiv.style.borderBottomWidth=tileSizeInPx*0.1+"px";
      this.svg.setAttribute('width',tileSizeInPx*0.8);
      this.svg.setAttribute('height',tileSizeInPx*0.8);

      this.textElement.innerHTML=this.model.letter.toUpperCase();
      this.textElement.setAttribute('x',tileSizeInPx*0.15+"px");
      this.textElement.setAttribute('y',tileSizeInPx*0.65+"px");
      this.textElement.setAttribute('width',tileSizeInPx*0.6+"px");
      this.textElement.setAttribute('height',tileSizeInPx*0.6+"px");
      this.textElement.setAttribute('style','font-family:Verdana;font-size:'
      +tileSizeInPx*0.6+'px;fill:rgb(67,49,39);stroke:rgb(67,49,39)');

      this.valueElement.innerHTML=this.model.value;
      if(this.model.value<10){
        this.valueElement.setAttribute('x',tileSizeInPx*0.6+"px");
      } else {
        this.valueElement.setAttribute('x',tileSizeInPx*0.53+"px");
      }
      this.valueElement.setAttribute('y',tileSizeInPx*0.19+"px");
      this.valueElement.setAttribute('width',tileSizeInPx*0.15+"px");
      this.valueElement.setAttribute('height',tileSizeInPx*0.15+"px");
      this.valueElement.setAttribute('style','font-family:Verdana;font-size:'
      +tileSizeInPx*0.2+'px;fill:rgb(67,49,39);stroke:rgb(67,49,39)');
      return this.tileDiv;
    }


}
