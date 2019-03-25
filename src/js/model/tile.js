class Tile {
  constructor(id,player,letter,value,number){
    this.id=id;
    this.letter=letter;
    this.value=value;
    this.number=number;
    this.isJoker=(letter=="*");
    this.previousRackIdx=null;
    this.rackIdx=null;
    this.game=player.game;
    this.boardX=null;
    this.boardY=null;
    this.player=player;
    this.isPlayed=false;
    this.horizontalWord=null;
    this.horizontalLang=null;
    this.verticalWord=null;
    this.horizontalLang=null;
  }

  setRackIdx(rackIdx){
    if(rackIdx!=null){
      if(this.boardX!=null){
        this.game.board[(15-this.boardY)*15+this.boardX]=null;
      }
      this.boardX=null;
      this.boardY=null;
      if(this.isJoker){
        this.letter="*";
      }
    }
    if(rackIdx!=this.rackIdx){
      if(rackIdx==null){
        this.player.previousRack[this.rackIdx]=this;
        this.previousRackIdx=this.rackIdx;
      } else {
        if(this.rackIdx!=null){
          if(this.player.previousRack[rackIdx]){
            this.player.previousRack[rackIdx].previousRackIdx=this.rackIdx;
          }
          if(this.player.previousRack[this.rackIdx]){
            this.player.previousRack[this.rackIdx].previousRackIdx=rackIdx;
            [this.player.previousRack[rackIdx],this.player.previousRack[this.rackIdx]]=
            [this.player.previousRack[this.rackIdx],this.player.previousRack[rackIdx]];
          } else {
            this.player.previousRack[this.rackIdx]=this.player.previousRack[rackIdx];
            this.player.previousRack[rackIdx]=null;
            this.previousRackIdx=null;
          }
        } else if(this.player) {
          if(this.previousRackIdx && this.previousRackIdx!=rackIdx){
            this.player.previousRack[rackIdx].previousRackIdx=this.previousRackIdx;
            this.player.previousRack[this.previousRackIdx]=this.player.previousRack[rackIdx];
          }
          this.player.previousRack[rackIdx]=null;
          this.previousRackIdx=null;
        }
      }
      this.rackIdx=rackIdx;
    }
  }

  setBoardPosition(x,y){
      if(this.boardX!=null){
        this.game.board[(15-this.boardY)*15+this.boardX]=null;
      }
      this.boardX=x;
      this.boardY=y;
      if(this.rackIdx!=null){
        this.player.rack[this.rackIdx]=null;
        this.setRackIdx(null);
      }
      this.game.board[(15-y)*15+x]=this;
  }
}
