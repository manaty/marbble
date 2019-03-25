"use strict";

var _createClass = function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var PlayerControler = function() {
    function PlayerControler(playerIndex, username, lang, isComputer, gameControler, bag, rack) {
        _classCallCheck(this, PlayerControler);


        this.playerIndex = playerIndex;
        this.gameControler = gameControler;
        this.model = new Player(gameControler.model, playerIndex, username, lang, isComputer, gameControler.gameType);
        this.component = new PlayerComponent(this);

        this.model.bag = bag;
        this.model.bagSize = bag.length;


        this.fillRack(rack);

    }

    _createClass(PlayerControler, [{
        key: "draw",
        value: function draw(playerWidthInPx, playerHeightInPx, rackWidthInPx, rackHeightInPx) {
            this.component.draw(playerWidthInPx, playerHeightInPx);
            this.component.drawRack(rackWidthInPx, rackHeightInPx);
        }
    }, {
        key: "initBag",
        value: function initBag() {
            //FIXME move in game controler
            var tileId = 0;
            this.model.bag = new Array();
            this.model.bagSize = 0;
            var letters = letterValues[this.model.lang][this.gameControler.gameMode];
            for (var property in letters) {
                if (letters.hasOwnProperty(property)) {
                    for (var i = 0; i < letters[property].n; i++) {
                        //v = value, n = number
                        var v = letters[property].v,
                            n = letters[property].n;
                        var tile = new Tile(this.playerIndex + "_" + tileId, this.model, property, v, n);
                        var tileComponent = new TileComponent(tile, this);
                        this.model.bag.push(tile);
                        this.model.bagSize++;
                        tileId++;
                    }
                }
            }
            this.model.shuffleBag();
        }
    }, {
        key: "fillRack",
        value: function fillRack(rack) {
          var rackNum = 0;
          var isBagEmpty = false;
          if(rack) {

              isBagEmpty = this.model.bag.length == 0 ? true : false;

              for(var i=0;i<rack.length;i++) {
                  if(rack[i] !== null) {
                      var tile = new Tile(rack[i].id, null, rack[i].letter, rack[i].value, rack[i].number);

                      if(tile) {
                          tile.setPlayer(this.model);
                          var tileComponent = new TileComponent(tile, this);
                          this.model.rack[i] = tile;
                          tile.player = this.model;
                          tile.setRackIdx(i);
                          this.component.rackBgDivs[i].tileId = tile.id;
                          rackNum++;
                      }                                            
                  }
              }
          } else {
              for (var i = 0; i < this.model.rack.length; i++) {
                  if (this.model.rack[i] == null) {
                    try {
                      var tile = this.model.bag.pop();
                      tile.setPlayer(this.model);
                      var tileComponent = new TileComponent(tile, this);
                      this.model.rack[i] = tile;
                      tile.player = this.model;
                      tile.setRackIdx(i);
                      this.component.rackBgDivs[i].tileId = tile.id;
                    } catch(e) {
                      console.error(e);
                      isBagEmpty = true;
                    }
                } else {
                    console.log("rack not yet empty");
                    rackNum++;
                 }

                  // play sound
                  sound.tilesDistribution();
              }
          }

         if(isBagEmpty && rackNum == 0) {

           isEndGame = true;
           this.gameControler.endGame();
         }
        }
    }, {
        key: "swapRackTiles",
        value: function swapRackTiles() {
            var exchanged = false;
            var swapRackContainer = gameControler.component.letterRackHolder;

            if (swapRackContainer) {
                for (var i = 0; i < swapRackContainer.children.length; i++) {

                    var tileBg = swapRackContainer.childNodes[i];
                    var tile = tileBg.hasChildNodes() ? tileBg.childNodes[0].component.model : null;

                    if (tile && tileBg) {
                        var tileDiv = tileBg.childNodes[0];
                        tileBg.tileId = null;
                        tileDiv.style.transform = "none";
                        tileDiv.remove();
                        this.model.bag.push(tile);
                        this.model.shuffleBag();
                        this.model.swapRack[i] = null;
                        exchanged = true;
                    }
                }
            }

            return exchanged;
        }
      }, {
          key: "swapAIRackTiles",
          value: function swapAIRackTiles() {
            console.log("SWAP AI");
              var exchanged = false;
                  for (var i = 0; i < this.model.rack.length; i++) {

                          var tile = this.model.rack[i];
                          // tileBg.tileId = null;
                          // tileDiv.style.transform = "none";
                          tile.component.tileDiv.remove();
                          this.model.bag.push(tile);
                          this.model.rack[i] = null;
                          this.model.shuffleBag();
                          this.model.swapRack[i] = null;
                          exchanged = true;
                  }

              return exchanged;
          }
    }, {
        key: "gatherRackTiles",
        value: function gatherRackTiles(currentAction) {
            if (currentAction == "gather") {

                var playerRackNullIndexes = [];

                var isSwapRackEmpty = true;

                var swapRackContainer = gameControler.component.letterRackHolder;

                for(var i=0;i<swapRackContainer.children.length;i++) {
                    if(swapRackContainer.childNodes[i].hasChildNodes())  {
                        isSwapRackEmpty = false;
                        break;
                    }
                }

                if(isSwapRackEmpty == false) {
                    for(var i=0;i<this.model.rack.length;i++) {
                        if(this.model.rack[i] == null) {
                            playerRackNullIndexes.push(i);
                        }
                    }
                }

                var playerRack = this.component.playerRackDiv;
                var playerRackHideDiv = this.component.hideDiv;

                //BEGIN OLD IMPLEMENTATION
                /*for (var i = 0; i < 7; i++) {
                    if (this.model.previousRack[i] != null) {
                        var tileBg1 = this.model.previousRack[i].component.tileDiv.parentNode;
                        var _tileBg = document.getElementById("player_tileBg_" + this.playerIndex + "_" + i);
                        var tile1 = tileBg1.removeChild(tileBg1.childNodes[0]);
                        this.model.rack[i] = tile1.component.model;
                        _tileBg.tileId = tile1.id;
                        //set this to null to allow tile drop
                        tileBg1.tileId = null;
                        tile1.component.model.setRackIdx(i);
                        this.model.previousRack[i] = null;

                    }

                    if (this.model.rack[i] != null && this.model.rack[i].component.isToSwap == true) {
                        this.model.rack[i].component.toggleSwap();
                    }
                }

                console.log(this.model.rack);
                console.log(this.model.previousRack);
                */
                //END OLD IMPLEMENTATION

                if(isSwapRackEmpty == false) {
                    for(var i=0;i<swapRackContainer.children.length;i++) {
                        if(swapRackContainer.childNodes[i].hasChildNodes())  {
                            var index = playerRackNullIndexes.shift();

                            if(index != null) {
                                var tileBg1 = swapRackContainer.childNodes[i];

                                var _tileBg = document.getElementById("player_tileBg_" + this.playerIndex + "_" + index);

                                var tile1 = tileBg1.removeChild(tileBg1.childNodes[0]);

                                this.model.rack[index] = tile1.component.model;
                                _tileBg.tileId = tile1.id;

                                //set this to null to allow tile drop
                                tileBg1.tileId = null;
                                tile1.component.model.setRackIdx(index);
                                this.model.previousRack[i] = null;
                                this.model.swapRack[i] = null;
                            }

                        }
                    }

                }
                //BEGIN NEW IMPLEMENTATION
                else {
                    if(playerRack && playerRackHideDiv) {

                        if(this.model.tilesOnBoard.length == 0) {
                            //
                            return;
                        }
                        //Begin gather tiles

                        for(var i=0;i<playerRack.children.length;i++) {
                            if(playerRack.childNodes[i].id != playerRackHideDiv.id) {
                                var previousRackIndex = i-1;
                                if(!playerRack.childNodes[i].hasChildNodes()) {
                                    var tile = null;
                                    if(this.model.tilesOnBoard.length > 0) {
                                        tile = this.model.tilesOnBoard.shift();
                                    }
                                    if(tile) {
                                        var tileBg1 = tile.component.tileDiv.parentNode;
                                        var _tileBg = document.getElementById("player_tileBg_" + this.playerIndex + "_" + previousRackIndex);
                                        tileBg1.removeChild(tileBg1.childNodes[0]);
                                        this.model.rack[previousRackIndex] = tile;
                                        _tileBg.tileId = tile.id;
                                        //set this to null to allow tile drop
                                        tileBg1.tileId = null;
                                        tile.previousRackIdx = null;
                                        this.gameControler.model.board[(15 - tile.boardY) * 15 + tile.boardX] = null;
                                        if (tile.isJoker) {
                                            tile.letter = "";
                                        }
                                        tile.boardX = null;
                                        tile.boardY = null;
                                        tile.rackIdx = previousRackIndex;
                                        this.model.previousRack[previousRackIndex] = null;

                                        if (this.model.rack[previousRackIndex] != null && this.model.rack[previousRackIndex].component.isToSwap == true) {
                                            this.model.rack[previousRackIndex].component.toggleSwap();
                                        }
                                    }
                                }

                            }

                            if(this.model.tilesOnBoard.length == 0) {
                                //if there are no more tiles exit from loop
                                break;
                            }
                        }
                        //all previous rack should be set to empty as the tiles are recalled
                        var previousRackNotEmpty = this.model.previousRack.some(function (el) {
                            return el !== null;
                        });

                        if(previousRackNotEmpty) {
                            //emptying previous rack
                            for(var j=0;j<this.model.previousRack.length;j++) {
                                this.model.previousRack[j] = null;
                            }
                        }
                    }
                }
                //END NEW IMPLEMENTATION


                currentAction = null;
                var tileBg2 = document.getElementById("player_tileBg_" + this.playerIndex + "_" + 0);
                this.draw(null, null, null, tileBg2.style.height);
                this.hideScoreBubble();

                //uncomment this to display rack content in debug
                /*console.log(' === TILE GATHERED === ');
                for(var i=0;i<this.model.rack.length;i++) {
                    if(this.model.rack[i]) {
                        var div = this.model.rack[i].component.tileDiv.parentNode;
                        console.log(i + ': Tile RackIdx: ' + this.model.rack[i].rackIdx + ' Letter: ' + this.model.rack[i].letter.toUpperCase() + ' Tile.id: ' + this.model.rack[i].id + ' div.tileId: ' + div.tileId);
                    }
                }
                console.log(' === SWAP TILE LEFT === ');
                for(var i=0;i<this.model.swapRack.length;i++) {
                    console.log(this.model.swapRack[i]);
                }*/




            }
        }
    }, {
        key: "shuffleRackTiles",
        value: function shuffleRackTiles() {
            this.model.shuffleRackTiles();
            this.draw();
        }
    }, {
        key: "getRandomInt",
        value: function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }
    }, {
        key: "getTranslatedWord",
        value: function getTranslatedWord(originLang, word) {
            if (originLang != currentPlayer.lang && window.marbbleDic[originLang][currentPlayer.lang][word]) {
                return window.marbbleDic[originLang][currentPlayer.lang][word];
            } else {
                return word;
            }
        }
    }, {
        key: "hideScoreBubble",
        value: function hideScoreBubble() {

            var rack = this.model.rack;

            for (var i = 0; i < rack.length; i++) {

                if (rack[i] != null) {
                    var tile = rack[i].component.tileDiv;
                    if (tile.children.length > 0 && tile.childNodes[0].id == 'textGroupContainer') {
                        var textGroupContainer = tile.childNodes[0];
                        var tileScore = null;

                        for (var j = 0; j < textGroupContainer.children.length; j++) {
                            if (textGroupContainer.childNodes[j].id == 'tileScore') {
                                tileScore = textGroupContainer.childNodes[j];
                                tileScore.style.display = "none";
                            }
                        }
                    }
                }
            }
        }
    }]);

    return PlayerControler;
}();
