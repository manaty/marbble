const TYPE_CLASSIC = 0;
const TYPE_MARBBLE = 1;

const STATUS_NEW = 0;
const STATUS_ONGOING = 1;
const STATUS_ENDED = 2;


function allowDrop(ev) {
  ev.preventDefault();
}

class Game {

  constructor(){
    this.type = TYPE_CLASSIC;
    this.status = STATUS_NEW;
    this.players=[];
    this.movesHistory=[];
    this.playerToPlay=0;
    this.lastMove=null;
    this.board = new Array(225);
    this.round=1;
    this.online = false;
  }

  getPlayer(){
    return this.players[this.playerToPlay];
  }


   setType(type){
    if(type!=TYPE_CLASSIC && type!=TYPE_MARBBLE){
      throw new Exception("invalid game type");
    }
    this.type = type;
  }

   addPlayer(player){
    this.players.push(player);
  }

   computeWordScore(xmin,ymin,xmax,ymax,forGood=true){
    let score=0;
    let tilesInWord = [];
    if(xmin==xmax && ymin==ymax){
      return -1;
    }
    let word="";
    let wordMultiplicator=1;
    if(ymin==ymax){
      for(let i=xmin;i<=xmax;i++){
        score+=this.board[(15-ymin)*15+i].value*boardBgLetterValue[boardBg[(15-ymin)*15+i]];
        let localWordMultiplicator=boardBgWordValue[boardBg[(15-ymin)*15+i]];
        if(localWordMultiplicator>wordMultiplicator){
          wordMultiplicator=localWordMultiplicator;
        }
        word+=this.board[(15-ymin)*15+i].letter;
        tilesInWord.push(this.board[(15-ymin)*15+i]);
      }
    } else {
      for(let j=ymin;j<=ymax;j++){
        score+=this.board[(15-j)*15+xmin].value*boardBgLetterValue[boardBg[(15-j)*15+xmin]];
        let localWordMultiplicator=boardBgWordValue[boardBg[(15-j)*15+xmin]];
        if(localWordMultiplicator>wordMultiplicator){
          wordMultiplicator=localWordMultiplicator;
        }
        word=this.board[(15-j)*15+xmin].letter+word;
        tilesInWord.push(this.board[(15-j)*15+xmin]);
      }
    }
    score*=wordMultiplicator;
    if(forGood && window.marbbleWordmap[this.getPlayer().lang][word]==undefined){
      throw "word "+word+" doesnt exist";
    }
    console.log("word "+word+" as score "+score+" (multi="+wordMultiplicator+")");
    if(forGood){
      for(let i=0;i<tilesInWord.length;i++){
        if(ymin==ymax){
          tilesInWord[i].horizontalWord=word;
          tilesInWord[i].horizontalLang=this.getPlayer().lang;
        } else {
          tilesInWord[i].verticalWord=word;
          tilesInWord[i].verticalLang=this.getPlayer().lang;
        }
      }
    }
    return score;
  }

   computeScore(xmin,ymin,xmax,ymax,forGood=true){
    let score=this.computeWordScore(xmin,ymin,xmax,ymax,forGood);
    if(score>=0){
      if(ymin==ymax){
        for(let i=xmin;i<=xmax;i++){
          if(!this.board[(15-ymin)*15+i].isPlayed){
            let wordYmin=ymin;
            let wordYmax=ymax;
            while(wordYmin>0 && this.board[(15-wordYmin+1)*15+i]!=null){
              wordYmin--;
            }
            while(wordYmax<14 && this.board[(15-wordYmax-1)*15+i]!=null){
              wordYmax++;
            }
            if(wordYmax>wordYmin){
              let wordScore=this.computeWordScore(i,wordYmin,i,wordYmax,forGood);
              if(wordScore>0){
                score+=wordScore;
              } else {
                return wordScore;
              }
            }
          }
        }
      } else {
        for(let j=ymin;j<=ymax;j++){
          if(!this.board[(15-j)*15+xmin].isPlayed){
            let wordXmin=xmin;
            let wordXmax=xmax;
            while(wordXmin>0 && this.board[(15-j)*15+wordXmin-1]!=null){
              wordXmin--;
            }
            while(wordXmax<14 && this.board[(15-j)*15+wordXmax+1]!=null){
              wordXmax++;
            }
            if(wordXmax>wordXmin){
              let wordScore=this.computeWordScore(wordXmin,j,wordXmax,j,forGood);
              if(wordScore>0){
                score+=wordScore;
              } else {
                return wordScore;
              }
            }
          }
        }
      }

    }
    return score;
  }

  play(forGood,isFirstRound){
    let lettersPlayed = [];
    for(let i=0;i<7;i++){
      if(this.getPlayer().previousRack[i]){
          lettersPlayed.push(this.getPlayer().previousRack[i]);
      }
    }
    if(lettersPlayed.length==0){ //nothing has been played
      return "NOTHING_PLAYED";
    }
    let xmin=15,ymin=15,xmax=0,ymax=0;

    for(let i=0;i<lettersPlayed.length;i++){
      let tile=lettersPlayed[i];
      if(tile.boardX>xmax){
        xmax=tile.boardX;
      }
      if(tile.boardX<xmin){
        xmin=tile.boardX;
      }
      if(tile.boardY>ymax){
        ymax=tile.boardY;
      }
      if(tile.boardY<ymin){
        ymin=tile.boardY;
      }
    }
    if(ymax>ymin && xmax>xmin){
      //letters not aligned
        return "LETTERS_NOT_ALIGNED";
        this.currentAction=null;
        return;
      }
      if(isFirstRound && (7<xmin || 7>xmax || 8<ymin || 8>ymax )){
          return "STAR_NOT_COVERED";
      }
      if(ymin==ymax){
        for(let j=xmin;j<=xmax;j++){
          if(this.board[(15-ymin)*15+j]==null){
            return "HOLES_EXIST";
          }
        }
        //complete xmin and xmax of the full word
        while(xmin>0 && this.board[(15-ymin)*15+xmin-1]!=null){
          xmin--;
        }
        while(xmax<14 && this.board[(15-ymin)*15+xmax+1]!=null){
          xmax++;
        }
      }
      if(ymin<ymax || (xmin==xmax)) {
        for(let j=ymin;j<=ymax;j++){
          if(this.board[(15-j)*15+xmin]==null){
            return "HOLES_EXIST";
          }
        }
        //complete ymin and ymax of the full word
        while(ymin>0 && this.board[(15-ymin+1)*15+xmin]!=null){
          ymin--;
        }
        while(ymax<14 && this.board[(15-ymax-1)*15+xmin]!=null){
          ymax++;
        }
      }
      if(this.round>1) {
        let reuseLetters = false;
        for(let i=xmin;!reuseLetters && i<=xmax;i++){
          for(let j=ymin;!reuseLetters && j<=ymax;j++){
            reuseLetters = reuseLetters || (i>0?(this.board[(15-j)*15+i-1]!=null&&this.board[(15-j)*15+i-1].isPlayed):reuseLetters);
            reuseLetters = reuseLetters || (i<15?(this.board[(15-j)*15+i+1]!=null&&this.board[(15-j)*15+i+1].isPlayed):reuseLetters);
            reuseLetters = reuseLetters || (j>0?(this.board[(15-j+1)*15+i]!=null&&this.board[(15-j+1)*15+i].isPlayed):reuseLetters);
            reuseLetters = reuseLetters || (j<15?(this.board[(15-j-1)*15+i]!=null&&this.board[(15-j-1)*15+i].isPlayed):reuseLetters);
            reuseLetters = reuseLetters || (this.board[(15-j)*15+i].isPlayed);
          }
        }
        if(!reuseLetters){
          return "MUST_REUSE_LETTER";
        }
      }
      //compute points
      let wordScore=-1;
      try{
        wordScore = this.computeScore(xmin,ymin,xmax,ymax,forGood);
      } catch(e){
        return "INVALID_WORD";
      }
        if(wordScore<0){
          return "NO_POINT";
        }
        if(lettersPlayed.length==7){
          wordScore+=50;
        }

      if(forGood){
          this.getPlayer().score+=wordScore;
      }
      return wordScore;
  }

  getTranslatedWord(originLang,word){
      return window.marbbleDic[originLang][this.getPlayer().lang][word];
  }

  nextTurn(){
    this.playerToPlay++;
    this.playerToPlay%=this.players.length;
    if(this.playerToPlay==0){
      let endGame=true;
      for(let player in this.players){
        endGame = endGame && this.players[player].passed;
        this.players[player].passed=false;
      }
      if(endGame){
        return "END_GAME";
      }
    }
    return "OK";
  }

}
