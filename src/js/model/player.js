class Player {

    constructor(game,idx,username,lang){
      this.game=game;
      this.idx=idx;
      this.username=username;
      this.lang=lang
      this.score=0;
      this.bag=new Array();
      this.bagSize=0;
      this.previousRack=new Array(7);
      this.rack=new Array(7);
      this.passed=false;
    }

  shuffleBag(){
    for (let i = this.bag.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [this.bag[i - 1], this.bag[j]] = [this.bag[j], this.bag[i - 1]];
    }
  }

  shuffleRackTiles(){
    let origin=this.getRandomInt(0,6);
    let destination=this.getRandomInt(origin+1,7);
    let tileOrigin=this.rack[origin];
    let tileDestination=this.rack[destination];
    if(tileOrigin && tileDestination){
      tileOrigin.rackIdx=destination;
      tileDestination.rackIdx=origin;
      this.rack[origin]=tileDestination;
      this.rack[destination]=tileOrigin;
    }
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
