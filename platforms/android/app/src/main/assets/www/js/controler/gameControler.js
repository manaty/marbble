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

var GameControler = function() {
    function GameControler(screenDivId, gameMode, gameId) {
        _classCallCheck(this, GameControler);

        if(typeof gameId == 'undefined') {
            gameId = null;
        }

        this.currentAction = null;
        this.appLanguage = window.applanguage[_languageSet];
        this.model = new Game(gameId);
        this.component = new GameComponent(screenDivId, this);
        this.gameMode = gameMode;
        this.playerControlers = [];
        this.showDebug = false;
        this.tempScore = 0;
        this.lastScore = 0;
        this.horizontalTilePlayed = null;
        this.verticalTilePlayed = null;
        this.lastTilePlayed = null;
        this.horizontalTilesArray = [];
        this.verticalTilesArray = [];
        this.isDirectionHorizontal = true;
        this.isPanning = false;
        this.isPlayerResigned = false;
        this.model.setGameMode(gameMode);
        this.component.updateGameButtonLocale();
        this.isMenuButtonDisabled = false;
        this.allowInvalidWord = false;
        this.unknownWordsPlayed = [];
    }

    _createClass(GameControler, [{
            key: "addPlayer",
            value: function addPlayer(name, lang, isComputer, bag, rack) {
                var playerControler = new PlayerControler(this.playerControlers.length, name, lang, isComputer, this, bag, rack);
                this.playerControlers.push(playerControler);
                this.model.players.push(playerControler.model);
                this.component.playerContainerMid.appendChild(playerControler.component.playerDiv);
                this.component.playerRacksDiv.appendChild(playerControler.component.playerRackDiv);
            }
        }, {
            key: "drawDivider",
            value: function drawDivider() {
                this.component.drawDivider();
            }
        }, {
            key: "draw",
            value: function draw(isFirstTurn) {
                if(typeof isFirstTurn == 'undefined') {
                    isFirstTurn = false;
                }

                this.isMenuButtonDisabled = false;
                this.component.draw(isFirstTurn);
                this.updateRemainingTileCount();

                this.component.enableMenuButtons();
            }
        }, {
            key: "setTranslation",
            value: function setTranslation(horizontalWord, horizontalLang, verticalWord, verticalLang) {
                var translationHTML = "";
                var lang = this.model.getPlayer().lang;
                if (horizontalWord != null && lang != horizontalLang) {
                    translationHTML = horizontalWord + ":" + this.model.getTranslatedWord(horizontalLang, horizontalWord);
                }
                if (verticalWord != null && lang != verticalLang) {
                    translationHTML += "<br/>" + verticalWord + ":" + this.model.getTranslatedWord(verticalLang, verticalWord);
                }
                this.component.translationDiv.innerHTML = translationHTML;
            }
        }, {
            key: "shuffleRack",
            value: function shuffleRack() {
                if (this.currentAction == null) {
                    if (!this.component.getMenuEnabled()) {
                        return;
                    }

                    if(this.isMenuButtonDisabled) {
                        console.log("MENU DISABLED PASS NOT ALLOWED");
                        return;
                    }

                    var playerControler = this.playerControlers[this.model.playerToPlay];

                    for (var i = 0; i < 10; i++) {
                        playerControler.shuffleRackTiles();
                    }

                    //play sound
                    sound.shuffleTiles();
                    this.currentAction = null;
                }


            }
        }, {
            key: "gatherTiles",
            value: function gatherTiles() {
                var playerControler = this.playerControlers[this.model.playerToPlay];
                if (this.currentAction == null) {
                    if (!this.component.getMenuEnabled()) {
                        return;
                    }
                    this.currentAction = "gather";
                    playerControler.gatherRackTiles(this.currentAction);
                    this.currentAction = null;
                    this.updateMenuButtons();
                    this.hideTempScore();
                    this.setTempScore(0);
                    this.setHorizontalTilePlayed(null);
                    this.setVerticalTilePlayed(null);
                    this.setHorizontalTilesArray([]);
                    this.setVerticalTilesArray([]);
                    this.showLastScore();

                    //play sound
                    sound.bubblePopTilesRecall();

                } else if (this.currentAction == "swapTiles") {
                    playerControler.gatherRackTiles(this.currentAction);
                }
            }
        }, {
            key: "swapTiles",
            value: function swapTiles() {

                var playerControler = this.playerControlers[this.model.playerToPlay];
                if (playerControler.swapRackTiles() == true) {
                    var lastActionText = this.model.getPlayer().username + " " + this.appLanguage.swappedTiles;
                    this.component.saveAction(lastActionText, lastActionText);
                    this.component.displayLastAction(lastActionText);
                    playerControler.fillRack();
                    this.model.getPlayer().passed = false;
                    this.updatePlayerRack(playerControler);
                    this.nextTurn();
                }
                this.hideSwap();
            }
        }, {
            key: "playForGood",
            value: function playForGood() {

                if(this.isMenuButtonDisabled) {
                    console.log("MENU DISABLED PASS NOT ALLOWED");
                    return;
                }

              if(this.model.online) {
                this.model.challenger = true;
              }
                this.play(true);
            }
        }, {
            key: "play",
            value: function play(forGood) {
              var horizontalTilesArray = this.getHorizontalTilesArray();
              var verticalTilesArray = this.getVerticalTilesArray();
              var horizontalTilePlayed = this.getHorizontalTilePlayed();
              var verticalTilePlayed = this.getVerticalTilePlayed();

                if (this.currentAction == null) {
                    if (!this.component.getMenuEnabled()) {
                        return;
                    }
                    this.currentAction = "play";
                    var result = this.model.play(forGood, this.model.round == 1);
                    this.debug("GameControler", "result: " + result);

                    if(forGood) {

                        //play sound
                        sound.playingWord();
                    }


                    var lastTilePlayed = this.getLastTilePlayed();
                    var horizontalTilePlayed = this.getHorizontalTilePlayed();
                    var verticalTilePlayed = this.getVerticalTilePlayed();

                    if (result == "NOTHING_PLAYED") {
                        //nothing has been played
                        this.debug("GameControler", "Nothing played: " + result);
                        this.showMessage("Nothing played");
                        this.currentAction = null;
                        return;
                    }
                    if (result == "LETTERS_NOT_ALIGNED") {
                        if (forGood) {
                            this.debug("GameControler", "Letters not aligned: " + result);
                            this.showMessage(this.appLanguage.lettersNotAligned);
                        } else {
                            this.hideTempScore();
                        }
                        this.showLastScore();
                        this.currentAction = null;
                        return;
                    }
                    if (result == "STAR_NOT_COVERED") {
                        if (forGood) {
                            this.debug("GameControler", "First word must cover the star in the middle of the board: " + result);
                            this.showMessage(this.appLanguage.starNotCovered);
                        } else {
                            this.hideTempScore();
                        }
                        this.showLastScore();
                        this.currentAction = null;
                        return;
                    }
                    if (result == "HOLES_EXIST") {
                        if (forGood) {
                            this.debug("GameControler", "There are holes: " + result);
                            this.showMessage("There are holes");
                        } else {
                            this.hideTempScore();
                        }
                        this.showLastScore();
                        this.currentAction = null;
                        return;
                    }
                    if (result == "NO_POINT") {
                        if (forGood) {
                            this.debug("GameControler", "One tile word not allowed: " + result);
                            this.showMessage(this.appLanguage.oneTileWord);
                        } else {
                            this.hideTempScore();
                        }
                        this.showLastScore();
                        this.currentAction = null;
                        return;
                    }
                    if (result == "MUST_REUSE_LETTER") {
                        if (forGood) {
                            this.debug("GameControler", "The word must reuse letters of the board: " + result);
                            this.showMessage("The word must reuse letters of the board");
                        }
                        this.currentAction = null;
                        return;
                    }
                    if (result == "INVALID_WORD") {
                        if (forGood) {
                            this.debug("GameControler", "The word doesn't exist: " + result);
                            var invalidWord = this.model.getInvalidWordPlayed();


                            var language = LANG[this.model.getPlayer().lang.toLowerCase()];
                            if(this.model.playerToPlay == 1 && this.model.isSoloPlay) {
                              this.confirmPass();
                              //console.log("PASS. WORD DOES NOT EXIST");
                            } else {
                               this.showMessage(this.appLanguage.theWord + " <font color='blue'><strong>" + invalidWord + "</strong></font> " + this.appLanguage.doesNotExist + " <strong><font color='blue'>" + this.appLanguage[language] + "</font></strong>");
                            }

                        }
                        this.currentAction = null;
                        return;
                    }

                    if(result == "OPEN_MODE") {
                        if (forGood) {
                            var invalidWord = this.model.getInvalidWordPlayed();
                            //console.log(this.unknownWordsPlayed);
                            this.showUnknownWordDialog(this.unknownWordsPlayed);
                        }
                        this.currentAction = null;
                        return;
                    }

                    if (!forGood) {
                        if (result != "NO_POINT") {
                            //tile action should happen here
                            this.debug("GameControler", "Temp score: " + result);
                            this.setTempScore(result);
                            if (horizontalTilePlayed && !verticalTilePlayed && lastTilePlayed) {
                                this.showTempScore();
                                if (horizontalTilePlayed.id != lastTilePlayed.id) {
                                    this.showLastScore();
                                }
                            } else if (!horizontalTilePlayed && verticalTilePlayed && lastTilePlayed) {
                                this.showTempScore();
                                if (verticalTilePlayed.id != lastTilePlayed.id) {
                                    this.showLastScore();
                                }
                            } else if (horizontalTilePlayed && verticalTilePlayed && lastTilePlayed) {
                                this.showTempScore();
                                if (horizontalTilePlayed.id != lastTilePlayed.id) {
                                    this.showLastScore();
                                } else if (verticalTilePlayed.id != lastTilePlayed.id) {
                                    this.showLastScore();
                                }

                            } else {
                                this.showTempScore();
                            }

                        }
                        this.currentAction = null;
                        // window.localStorage.setItem("game", JSON.stringify(this.model));
                        return;
                    }

                    //EXECUTES WHEN A PLAY IS SUCCESSFUL

                    this.model.ai_pass = 0; //reset
                    var lastWord = this.getLastWord();
                    var currentPlayerLang = this.model.getPlayer().lang;
                    var nextPlayerLang = this.model.getNextPlayer().lang;
                    var mainStyle = "player-"+this.model.playerToPlay+"-color";
                    var secondaryStyle = this.model.playerToPlay == 0 ? "player-1-color" : "player-0-color";

                    //set the tilesOnBoard to empty
                    this.model.getPlayer().tilesOnBoard = [];


                    var playedWord = this.appLanguage.played + " <span class='"+mainStyle+"'>" + lastWord.toUpperCase()+ "</span>";

                    try {
                      if(currentPlayerLang != nextPlayerLang && window.marbbleDic[currentPlayerLang][nextPlayerLang]) {
                        var translation = window.marbbleDic[currentPlayerLang][nextPlayerLang][lastWord];
                        if(typeof translation != "undefined") {
                            playedWord += " <span class='"+secondaryStyle+"'>(= "+translation+")</span>";
                        }
                      }
                    } catch(e) {
                      console.log("unable to add translation to action line");
                    }


                    if(this.getDoNotAskValue() == true || this.allowInvalidWord == true) {
                        playedWord += " <span style='color:#5b5b5b;'>(= " + this.appLanguage.unknown + ")</span>";
                    }


                    //add translation to each horizontal tile
                    var lastActionText = this.model.getPlayer().username + " " +playedWord + " " + this.appLanguage.for + " <font color='red'>" + result + "</font> " + this.appLanguage.points ;
                    var lastActionTextWithoutPoint = this.model.getPlayer().username + " " + playedWord;
                    // SAVE ACTION
                    var model = this.model;
                    var turnNo = model.movesHistory.length + 1;
                    var style = { main: mainStyle, secondary: secondaryStyle, result: result, turn: turnNo};

                    for(var i = 0; i < model.wordsPlayed.length; i++) {
                      var wordPlayed = model.wordsPlayed[i];
                      this.component.saveAction(wordPlayed, lastActionTextWithoutPoint, "word", this.model.getPlayer().lang, this.model.getNextPlayer().lang, style);
                    }

                    this.component.displayLastAction(lastActionText);
                    this.setLastScore(result);

                    this.component.zoomOutGameBoard();

                    var playerControler = this.playerControlers[this.model.playerToPlay];
                    for (var i = 0; i < 7; i++) {
                        if (this.model.getPlayer().previousRack[i]) {
                            var tile = this.model.getPlayer().previousRack[i];
                            tile.isPlayed = true;
                            tile.component.tileDiv.draggable = false;
                            tile.component.tileDiv.parentNode.removeEventListener("dragover", this.component.allowDrop);
                        }
                    }

                    for (var _i = 0; _i < 7; _i++) {
                        this.model.getPlayer().previousRack[_i] = null;
                    }
                    this.model.round++;
                    playerControler.fillRack();
                    this.currentAction = null;

                    //set allow invalid word to false;
                    this.allowInvalidWord = false;

                    //set the last tile played
                    if (this.getDirectionHorizontal()) {
                        if (horizontalTilePlayed) {
                            this.setLastTilePlayed(horizontalTilePlayed);
                        }
                    } else {
                        if (verticalTilePlayed) {
                            this.setLastTilePlayed(verticalTilePlayed);
                        }
                    }

                    this.model.getPlayer().passed = false;

                    this.showLastScore();
                    this.updatePlayerRack(playerControler);
                    //console.log(this.model.getPlayer());

                    this.nextTurn();

                    this.updateMenuButtons();
                    // window.locaalStorage.setItem("game", JSON.stringify(this.model));

                } else if (this.currentAction == "swapTiles") {
                    if (!this.component.getMenuEnabled()) {
                      // window.localStorage.setItem("game", JSON.stringify(this.model));
                        return;
                    }
                }
            }
        }, {
            key: "pass",
            value: function pass() {
                if (this.currentAction == null) {
                    if (!this.component.getMenuEnabled()) {
                        return;
                    }
                    if(this.isMenuButtonDisabled) {
                        console.log("MENU DISABLED PASS NOT ALLOWED");
                        return;
                    }

                    var type = "pass";
                    var passText = this.appLanguage.passYourMove;
                    this.showConfirmation(passText, type, this.confirmPass.bind(this));
                }
            }
        }, {
            key: "confirmPass",
            value: function confirmPass() {
                if (this.currentAction == null) {
                    this.gatherTiles();

                    var lastActionText = this.model.getPlayer().username + " " + this.appLanguage.passed;;

                    this.component.saveAction(lastActionText, lastActionText);
                    this.component.displayLastAction(lastActionText);
                    this.debug("GameControler", lastActionText);

                    this.model.getPlayer().passed = true;

                    this.hideDialog();
                    this.nextTurn();
                    // window.localStorage.setItem("game", JSON.stringify(this.model));

                }
            }
        }, {
            key: "leave",
            value: function leave() {
                if (this.currentAction == null) {
                    if (!this.component.getMenuEnabled()) {
                        return;
                    }
                    var type = "leave";
                    var leaveText = this.appLanguage.wouldYouLikeToQuit;
                    this.showConfirmation(leaveText, type, this.confirmLeave.bind(this));
                }
            }
        }, {
            key: "confirmLeave",
            value: function confirmLeave() {

                if (this.currentAction == null) {
                    if (!this.component.getMenuEnabled()) {
                        return;
                    }

                    this.isPlayerResigned = true;
                    this.gatherTiles();
                    // window.localStorage.setItem("game", null);
                    this.endGame();
                }
            }
        }, {
            key: "nextTurn",
            value: function nextTurn() {
                //console.log(" --- GameControler.js NEXT TURN ===== ");
                var result = this.model.nextTurn();

                this.setTempScore(0);
                this.setHorizontalTilePlayed(null);
                this.setVerticalTilePlayed(null);
                this.setHorizontalTilesArray([]);
                this.setVerticalTilesArray([]);



                if (result == "END_GAME" || isEndGame == true) {
                    this.endGame();
                } else {

                    //Save after turn
                    //console.log("*** Call save state *** " + result);
                    saveState(this.model);


                    this.draw();
                    var model = this.model;
                    var playerToPlay = model.playerToPlay;

                    // //signal other player
                    // if(model.online) {
                    //   onlineEndTurn(this.model);
                    // }
                    if(!model.online) {
                        this.component.showNextTurnDialog(model.players[playerToPlay].username);
                    }
                    else {
                        this.hideOpponentRack();
                    }
                    //this.hideOpponentRack();

                    var allTiles = document.getElementsByClassName("tileValueContainer"),
                          len = allTiles !== null ? allTiles.length : 0,
                          i = 0;
                      for(i; i < len; i++) {
                          if(!allTiles[i].classList.contains("tileValue-p"+(parseInt(playerToPlay)+1))) {
                              allTiles[i].classList.remove("active");
                          }
                      }
                    var tiles = document.getElementsByClassName("tileValue-p"+(parseInt(playerToPlay)+1)),
                          len = tiles !== null ? tiles.length : 0,
                          i = 0;
                      for(i; i < len; i++) {
                          tiles[i].classList.add("active");
                      }

                    if(playerToPlay == 1 && model.isSoloPlay) {
                      //TODO change hard coded player to play to determine computer
                      document.getElementById("playerRack_0").style.display =  "block";
                      document.getElementById("playerRack_1").style.display = "none";
                      this.aiAction();
                    }
                    //send invite on first move
                    if(this.model.online && this.model.round == 2) {
                        var data = {};
                        data.type = "invite";
                        data.lang = this.model.players[0].lang;
                        data.targetLang = this.model.players[1].lang;
                        data.username = this.model.players[0].username;
                        data.id = this.model.gameId;
                        this.model.challenger = false; //send model that is not a challenger (CHANGE LATER)
                        data.game = JSON.stringify(JSON.decycle(this.model));
                        sendResponse(data);
                        this.model.challenger = true;
                    }

                    if(this.model.online && this.model.round > 2) {
                      var data = {};
                      data.type = "endTurn";
                      data.username = this.model.players[0].username;
                      data.game = JSON.stringify(JSON.decycle(this.model));
                      try {
                        sendResponse(data);
                      } catch(e) {
                        //console.log(e);
                      }
                    }
                }
            }
          }, {
            key: "aiPass",
            value: function aiPass() {
              if(this.model.playerToPlay == 1 && this.model.isSoloPlay) {
                if(this.model.ai_pass < 5) {
                  //console.log("SWAP", this.model.ai_pass);
                  var playerControler = this.playerControlers[this.model.playerToPlay];
                  if (playerControler.swapAIRackTiles() == true) {
                      var lastActionText = this.model.getPlayer().username + " swapped tiles";
                      this.component.saveAction(lastActionText, lastActionText);
                      this.component.displayLastAction(lastActionText);
                      playerControler.fillRack();
                      this.model.getPlayer().passed = false;
                      this.model.ai_pass++;
                      this.nextTurn();
                  }
                } else {
                  //console.log("PASS", this.model.ai_pass);
                  // this.model.ai_pass = 0;
                  this.confirmPass();
                }
                  // this.confirmPass();
                // } else {
                //   //swap for the first 2
                // }
                return true;
              } else {
                return false;
              }
            }
          }, {
            key: "aiAction",
            value: function aiAction() {
              var controller = this;
              document.getElementById("playerRack_0").style.display =  "block";
              document.getElementById("playerRack_1").style.display = "none";
              document.getElementById("overlay").style.display = "block";
              setTimeout(function() {
                controller.aiPerformAction();
                document.getElementById("overlay").style.display = "none";
              }, 1000);
            }
          }, {
            key: "aiPerformAction",
            value: function aiPerformAction() {
              try {
                var bestWord = this.aiGetBestWord();
                if( /[^a-zA-Z_]/.test( bestWord.word ) ) {
                  //not valid, we should skip
                  this.aiPass();
                } else {
                  var rack = this.model.players[this.model.playerToPlay].rack;
                  var usedBoard = [];
                  var ax = bestWord.ax;
                  var ay = bestWord.ay;
                  this.buildAIBoard();
                  for(var l = 0; l < bestWord.word.length; l++) {
                    //figure out which letter to exclude
                    var boardTile = document.getElementById("board_tileBg_"+ay+"_"+ax);
                      //search letter from rack
                      for(var tileI = 0; tileI < rack.length; tileI++) {
                        if(rack[tileI] != null && rack[tileI].letter == bestWord.word[l]) {
                          //REGULAR TILE
                          if(bestWord.word[l] != "_") {
                            this.aiPlaceTile(rack[tileI], ay, ax);
                          }
                          break;
                        } else if(tileI >= rack.length -1) {
                          //if tile is not matched we should look for a blank tile
                          for(var tileIB = 0; tileIB < rack.length; tileIB++) {
                            if(rack[tileIB] != null && rack[tileIB].letter == "*") {
                              //BLANK TILE
                              if(bestWord.word[l] != "_") {
                                this.aiPlaceBlankTile(rack[tileIB], ay, ax, bestWord.word[l]);
                              }
                              break;
                            }
                          }
                        }

                      }
                      if(bestWord.xy == "y") {
                        ay++;
                      } else {
                        ax++
                      }
                  }
                  this.play(true);
                }
              } catch(e) {
                console.log(e);
                this.aiPass();
              }

            }
          }, {
            key: "aiPlaceTile",
            value: function aiPlaceTile(tileId, ax, ay) {
              // var rack = this.model.players[this.model.playerToPlay].rack;
              // //console.log("PLACE",rack[tileI].letter,ax,ay);
              var tile = document.getElementById(tileId.id);
              var boardTile = document.getElementById("board_tileBg_"+ay+"_"+ax);
              var tileComp = tileId.component;
              tileId.component.draw(22, tile, boardTile);
              var tileModel = tileComp.model;
              tileModel.setBoardPosition(ax, 15 - ay);
              tileComp.playerControler.gameControler.play(false);
              boardTile.appendChild(tile);
              tileDragula.containers.forEach(function(el, index) {
                if(el == boardTile) {
                  tileDragula.containers.splice(index, 1);
                }
              });
              //end place tile
            }
          }, {
            key: "aiPlaceBlankTile",
            value: function aiPlaceTile(tileId, ax, ay, letter) {
              // var rack = this.model.players[this.model.playerToPlay].rack;
              // //console.log("PLACE BLANK TILE",rack[tileIB].letter,ax,ay);
              var tile = document.getElementById(tileId.id);
              tile.letter = letter.toLowerCase();
              var boardTile = document.getElementById("board_tileBg_"+ay+"_"+ax);
              var tileComp = tileId.component;
              tileComp.letter = letter.toLowerCase();
              tileId.component.draw(22, tile, boardTile);
              var tileModel = tileComp.model;
              tileModel.letter = letter.toLowerCase();
              tile.innertext = letter.toUpperCase();
              tileModel.setBoardPosition(ax, 15 - ay);
              tileComp.playerControler.gameControler.play(false);
              boardTile.appendChild(tile);
              tileDragula.containers.forEach(function(el, index) {
                if(el == boardTile) {
                  tileDragula.containers.splice(index, 1);
                }
              });
              //end place tile
            }
          }, {
          key: "aiGetBestWord",
          value: function aiGetBestWord() {
            var bestWord;
            this.buildAIBoard();
            var more = Math.ceil(Math.random()*5);
            var maxwpoints = this.model.g_maxwpoints[this.model.g_playlevel] + more;
            //if first move do not scan board
            if(this.model.g_board[7][7] == "") {
              bestWord = this.aiBuildAltPossibleMove(this.getAIRack().opponent_rack, null, null, null, null, null);
            } else {
              // bestWord = this.aiComplexMove();
              // if(typeof bestWord == "undefined") {


              var moveType = this.model.getNextPlayer().lang == this.model.getPlayer().lang ? "" : "common";
              var tempBestWord = {};
              //   //console.log(this.model.getNextPlayer().lang);
              //   //console.log("MOVE TYPE:", moveType);
                try {
                  ////console.log("NORMAL MOVE Y");
                  bestWord = this.aiAltPossibleMoveY(moveType);
                  // //console.log(bestword);
                } catch(e) {
                  //console.log(e);
                }
                // if(typeof bestWord == "undefined") {
                // if((typeof bestWord == "undefined") || (typeof bestWord != "undefined" && bestWord.score < maxwpoints)) {
                //   try {
                //     bestWord = this.aiAltPossibleMoveY();
                //   } catch(e) {
                //     //console.log(e);
                //   }
                // }
                if((typeof bestWord == "undefined") && bestWord.word.length > 2) {
                  try {
                    tempBestWord = this.aiAltPossibleMove(moveType);
                    //console.log("NORMAL MOVE X");
                    // //console.log(bestword);
                    if(typeof tempBestWord != "undefined" &&
                      (typeof bestWord == "undefined" || tempBestWord.score > bestWord.score)) {
                      bestWord = tempBestWord;
                    }
                  } catch(e) {
                    //console.log(e);
                  }
                }
                if((typeof bestWord == "undefined" || this.model.g_playlevel > 1 ) && bestWord.word.length > 2) {
                  //console.log("REG ALT");
                  tempBestWord = this.aiAltPossibleMoveY("");
                  if(typeof tempBestWord != "undefined" &&
                    (typeof bestWord == "undefined" || tempBestWord.score > bestWord.score)) {
                    bestWord = tempBestWord;
                  }
                }
                if((typeof bestWord == "undefined" || this.model.g_playlevel > 2) && bestWord.word.length > 2) {
                  //console.log("REG ALT");
                  tempBestWord = this.aiAltPossibleMove("");
                  if(typeof tempBestWord != "undefined" &&
                    (typeof bestWord == "undefined" || tempBestWord.score > bestWord.score)) {
                    bestWord = tempBestWord;
                  }
                }
                if((typeof bestWord == "undefined" || this.model.g_playlevel > 2) && bestWord.word.length > 2) {
                  //console.log("Complex");
                  tempBestWord = this.aiComplexMove("");
                  if(typeof tempBestWord != "undefined" &&
                    (typeof bestWord == "undefined" || tempBestWord.score > bestWord.score)) {
                    bestWord = tempBestWord;
                  }
                }
                if((typeof bestWord == "undefined" && this.model.g_playlevel > 1) && bestWord.word.length > 2) {
                  try {
                    //console.log("EXTEND X");
                    tempBestWord = this.aiMoveWordExtendX();
                    if(typeof tempBestWord != "undefined" &&
                      (typeof bestWord == "undefined" || tempBestWord.score > bestWord.score)) {
                      bestWord = tempBestWord;
                    }
                  } catch(e) {
                    //console.log(e);
                  }
                }
                  // }
            }
            return bestWord;
          }
        }, {
          key: "buildAIBoard",
          value: function buildAIBoard() {
            this.model.g_board = [];
            var model = this.model;
            var board_best_score = 0;
            var board_best_word;
            var bestWord = "";
            //get best word

            for(var by = 0; by < 15; by++) {
              var columnArray = [];
              for(var bx = 0; bx < 15; bx++) {
                try {
                  var pos = document.getElementById("board_tileBg_"+by+"_"+bx);
                  var tile = pos.getElementsByClassName("tile")[0];
                  var letter = tile.getElementsByClassName("tileTextContainer")[0].innerHTML;
                  columnArray.push(letter);
                } catch(e) {
                  columnArray.push("");
                }
              }
              model.g_board.push(columnArray);
            }
          }
        }, {
            key: "aiComplexMove",
            value: function aiComplexMove(type) {
              var letters = "";
              var opponent_rack = [];
              var model = this.model;
              var board_best_score = 0;
              var board_best_word;
              var bestWord = "";
              this.buildAIBoard();
              for(var i=0; i<model.players[model.playerToPlay].rack.length; i++) {
                letters += model.players[model.playerToPlay].rack[i].letter;
                opponent_rack.push(model.players[model.playerToPlay].rack[i].letter);
              }

              for(var ax = 0; ax < 15; ax++) {
                for(var ay = 0; ay < 15; ay++) {
                  if (model.g_board[ax][ay] !== "")
                  continue;

                  var word = this.findBestWord( opponent_rack, letters, ax, ay );
                  if (word.score > -1)
                      //console.log( "found word: "+word.word+" ("+letters+")" );

                  if (board_best_score < word.score) {
                      // If this is better than all the board placements
                      // so far, update the best word information
                      board_best_score = word.score;
                      board_best_word = word;
                  }
                }
              }
              //console.log("COMPLEX MOVE:", board_best_word);
              //end get best word
              return board_best_word;
            }
        },{
            key: "findBestWord",
            value: function findBestWord( rack, letters, ax, ay )
            {
                //var t1 = +new Date();
                var model = this.model;
                var numlets = letters.length;
                var bestscore = -1;
                var bestword = {score:-1};
                var dirs = ["x","y"];
                for (var dir in dirs) {
                    var xy = dirs[dir];
                    //logit( "direction:" + xy );
                    //g_timers.begin( "getRegex" );
                    var regex = this.model.getRegEx( xy, ax, ay, rack );
                    //g_timers.pause( "getRegex" );
                    //logit( regex );
                    if (regex !== null) {
                        //g_timers.begin( "getBestScore" );
                        var word = this.model.getBestScore( regex, letters, ax, ay );
                        //g_timers.pause( "getBestScore" );
                        if (bestscore < word.score) {
                            bestscore = word.score;
                            bestword = word;
                            //logit( "new best:" );
                            //logit( bestword );
                        }
                    }
                }

                // var t2 = +new Date();
                // logit( "Time for findBestWord:"+(t2-t1) );
                return bestword;
            }
        }, {
          key: "aiAltPossibleMove",
          value: function aiAltPossibleMove(type) {
            // //console.log("get alternative possible move. ", ax, ay, letters);
            // //console.log("Reference tile: ", this.g_board[ax][ay].letter);
            var rack = this.getAIRack();
            var model = this.model;
            var moves = [];
            var letters = "";
            var opponent_rack = [];
            var wordinfo;
            var wordMove ={word: ""};
            var match; //remove
            var ay = 0;
            var ax = 0;
            var bestscore = 0;

            var aiRack = this.getAIRack();
            var letters = aiRack.letters;
            var opponent_rack = aiRack.opponent_rack;

            for(ay = 0; ay < 15; ay++) {
              for(ax = 0; ax < 15; ax++) {
                if (model.g_board[ay][ax] !== "" && ay > 0 && ay < 14)
                  //if not blank check if we can add
                  if(model.g_board[ay + 1][ax] == "" &&
                     model.g_board[ay - 1][ax] == "") {
                    //can be used for x orientation
                    //check negative and positive spaces available
                    var ayN = ay-1;
                    var ayP = ay+1;
                    while(model.g_board[ayN][ax] == "" && ayN > 0) {
                      // //console.log(ayN);
                      // //console.log(model.g_board[ayN][ax]);
                      if((
                          (0 < ax < 15) && ((model.g_board[ayN][ax - 1] == "" && model.g_board[ayN][ax + 1] == "") && model.g_board[ayN - 1][ax] == "")
                          ) ||
                          (ax == 0 && model.g_board[ayN][ax - 1] == "") ||
                          (ax == 14 && model.g_board[ayN][ax + 1] == "")) {
                            ayN--;
                         }
                      else {
                        break;
                      }
                      //check if space does not have neighbors
                    }
                    while(model.g_board[ayP][ax] == "" && ayP < 14) {
                      //check if space does not have neighbors
                      if((
                          (0 < ax < 15) && ((model.g_board[ayP][ax - 1] == "" && model.g_board[ayP][ax + 1] == "") && model.g_board[ayP + 1][ax] == "")
                          ) ||
                          (ax == 0 && model.g_board[ayP][ax - 1] == "") ||
                          (ax == 14 && model.g_board[ayP][ax + 1] == "")) {
                            ayP++;
                         }
                      else {
                        break;
                      }
                    }
                    //console.log("prepare move");
                    var move = {};
                    move.tile = {letter: model.g_board[ay][ax], y: ay, x: ax};
                    move.yN = ay - ayN;
                    move.yP = ayP - ay;
                    move.orientation = "x";
                    // moves.push(move);
                    var moveLetter = model.g_board[ay][ax].toLowerCase()
                    var regex = new RegExp("_(["+opponent_rack+","+moveLetter+"]{0,7})_", "g");
                    // var regex1 = new RegExp("_"+model.g_board[ay][ax]+"(["+opponent_rack+"]{0,7})_", "g");
                    // var regex2 = new RegExp("_(["+opponent_rack+"]{0,7})"+model.g_board[ay][ax]+"(["+opponent_rack+"]{0,7})_", "g");
                    // var regex3 = new RegExp("_(["+opponent_rack+"]{0,7})"+model.g_board[ay][ax]+"_", "g");
                    while(match=regex.exec(g_wstr[model.players[model.playerToPlay].lang])) {
                      // //console.log(match[1]);
                      var isValid = match[1].indexOf(moveLetter) > -1;
                       var matchCheck = match[1].split("");
                      //  //console.log(match[1].indexOf(moveLetter),"<",move.yN);
                      //  //console.log(match[1].length - match[1].indexOf(moveLetter),"<",move.yP);
                      if (isValid &&
                          match[1].indexOf(moveLetter) < move.yN &&
                          (match[1].length - match[1].indexOf(moveLetter)) < move.yP &&
                          !matchCheck.some(function(v,i,a){return a.lastIndexOf(v)!=i;}))
                      {
                        var word = match[1];

                        //replace reference tile with _ so computer wont try to place it in the board
                        word = word.split('');
                        word[match[1].indexOf(moveLetter)] = '_';
                        word = word.join('');

                        regex.px = {ax:ax, ay:ay - match[1].indexOf(moveLetter)};
                        var word = match[1];
                        word = word.split('');
                        word[match[1].indexOf(moveLetter)] = '_';
                        word = word.join('');
                        wordinfo   = { word:word, ay:ax, ax:ay - match[1].indexOf(moveLetter) };
                        wordinfo.seq   = word;     // sequence to put on board
                        // wordinfo.lscrs = seq_lscrs;   // sequence letter scores
                        wordinfo.ps    = regex.ps;    // index of word start
                        wordinfo.xy    = "x";    // direction of scan
                        wordinfo.prec  = ay - match[1].indexOf(moveLetter);  // letters before anchor // letters before anchor
                        wordinfo.exlude = true; //exclude from placing reference tile
                        wordinfo.score = 0;
                        var score = 0;

                        for(var si = 0; si < match[1].length; si++) {
                          score += window.letterValues[this.model.getPlayer().lang][this.model.gameMode][match[1][si]]["v"];
                        }
                        wordinfo.score = score;
                        // //console.log(wordinfo);
                        var more = Math.ceil(Math.random()*5);
                        var maxwpoints = this.model.g_maxwpoints[this.model.g_playlevel] + more;
                        //console.log(match[1],"SCORE:",score,"<",maxwpoints);
                        var trans = "";
                        var transPackValid = false;
                        try {
                          var transPack = window.marbbleDic[this.model.getPlayer().lang][this.model.getNextPlayer().lang];
                          transPackValid = true;
                          trans = transPack[match[1]];
                        } catch(e) {
                          if(!transPackValid) {
                            console.log("NO TRANS PACK - AI MOVE");
                            trans = "BYPASS";
                          } else {
                              trans = "";
                          }
                        }
                        if (score < maxwpoints && (type != "common" || (trans != match[1] && typeof trans != "undefined" && trans != ""))) {
                            wordMove = wordinfo;
                        }
                      }
                    }
                  }
              }
            }
            // //console.log(moves);
            if(wordMove.word.length > 0) {
              return wordMove;
            } else {
              return undefined;
            }
          }
        }, {
          key: "aiAltPossibleMoveY",
          value: function aiAltPossibleMoveY(type) {
            // //console.log("get alternative possible move. ", ax, ay, letters);
            // //console.log("Reference tile: ", this.g_board[ax][ay].letter);
            var rack = this.getAIRack();
            var model = this.model;
            var moves = [];
            var letters = "";
            var opponent_rack = [];
            var wordinfo;
            var wordMove ={word: ""};
            var match; //remove
            var ay = 0;
            var ax = 0;
            var bestscore = 0;

            var aiRack = this.getAIRack();
            var letters = aiRack.letters;
            var opponent_rack = aiRack.opponent_rack;

            for(ay = 0; ay < 15; ay++) {
              for(ax = 0; ax < 15; ax++) {
                if (model.g_board[ay][ax] !== "" && ax > 0 && ax < 14)
                  //if not blank check if we can add
                  if(model.g_board[ay][ax + 1] == "" &&
                     model.g_board[ay][ax - 1] == "") {
                    //can be used for x orientation
                    //check negative and positive spaces available
                    var axN = ax-1;
                    var axP = ax+1;
                    while(model.g_board[ay][axN] == "" && axN > 0) {
                      // //console.log(axN);
                      // //console.log(model.g_board[ay][axN]);
                      try {
                        if((
                            (0 < ay < 15) && (   model.g_board[ay - 1][axN] == "" &&
                                                 model.g_board[ay + 1][axN] == "" &&
                                                 model.g_board[ay][axN - 1] == ""
                                            )
                            ) ||
                            (ay == 0 && model.g_board[ay - 1][axN] == "") ||
                            (ay == 14 && model.g_board[ay + 1][axN] == "")) {
                              axN--;
                           }
                        else {
                          break;
                        }
                      }
                      catch(e) {
                        break;
                      }
                      //check if space does not have neighbors
                    }
                    while(model.g_board[ay][axP] == "" && axP < 14) {
                      //check if space does not have neighbors
                      try {
                        if((
                            (0 < ay < 15) && (
                                              model.g_board[ay - 1][axP] == "" &&
                                              model.g_board[ay + 1][axP] == "" &&
                                              model.g_board[ay][axP + 1] == ""
                                            )
                            ) ||
                            (ax == 0 && model.g_board[ay - 1][axP] == "") ||
                            (ax == 14 && model.g_board[ay + 1][axP] == "")) {
                              axP++;
                           }
                        else {
                          break;
                        }
                      } catch(e) {
                        break;
                      }
                    }
                    // //console.log("prepare move");
                    var move = {};
                    move.tile = {letter: model.g_board[ay][ax], y: ay, x: ax};
                    move.xN = ax - axN;
                    move.xP = axP - ax;
                    move.orientation = "y";
                    // moves.push(move);
                    var moveLetter = model.g_board[ay][ax].toLowerCase()
                    var regex = new RegExp("_(["+opponent_rack+","+moveLetter+"]{0,7})_", "g");
                    // var regex1 = new RegExp("_"+model.g_board[ay][ax]+"(["+opponent_rack+"]{0,7})_", "g");
                    // var regex2 = new RegExp("_(["+opponent_rack+"]{0,7})"+model.g_board[ay][ax]+"(["+opponent_rack+"]{0,7})_", "g");
                    // var regex3 = new RegExp("_(["+opponent_rack+"]{0,7})"+model.g_board[ay][ax]+"_", "g");
                    while(match=regex.exec(g_wstr[model.players[model.playerToPlay].lang])) {
                      // //console.log(match[1]);
                      var isValid = match[1].indexOf(moveLetter) > -1;
                       var matchCheck = match[1].split("");
                      //  //console.log(match[1].indexOf(moveLetter),"<",move.xN);
                      //  //console.log(match[1].length - match[1].indexOf(moveLetter),"<",move.xP);
                      if (isValid &&
                          match[1].indexOf(moveLetter) < move.xN &&
                          (match[1].length - match[1].indexOf(moveLetter)) < move.xP &&
                          !matchCheck.some(function(v,i,a){return a.lastIndexOf(v)!=i;}))
                      {
                        regex.px = {ax:ax, ay:ay - match[1].indexOf(moveLetter)};
                        var word = match[1];
                        word = word.split('');
                        word[match[1].indexOf(moveLetter)] = '_';
                        word = word.join('');
                        wordinfo   = { word:word, ay:ax - match[1].indexOf(moveLetter), ax:ay };
                        // var score = this.model.getWordScore( wordinfo );
                        wordinfo.seq   = word;     // sequence to put on board
                        // wordinfo.lscrs = seq_lsxncrs;   // sequence letter scores
                        wordinfo.ps    = regex.ps;    // index of word start
                        wordinfo.xy    = "y";    // direction of scan
                        wordinfo.prec  = ax - match[1].indexOf(moveLetter);  // letters before anchor
                        wordinfo.exlude = true; //exclude from placing reference tile
                        //console.log(wordinfo);
                        wordinfo.score = 0;
                        var score = 0;
                        for(var si = 0; si < match[1].length; si++) {
                          score += window.letterValues[this.model.getPlayer().lang][this.model.gameMode][match[1][si]]["v"];
                        }
                        wordinfo.score = score;
                        // //console.log(wordinfo);
                        var more = Math.ceil(Math.random()*5);
                        var maxwpoints = this.model.g_maxwpoints[this.model.g_playlevel] + more;
                        //console.log(match[1],"SCORE:",score,"<",maxwpoints);
                        var trans = "";
                        var transPackValid = false;
                        try {
                          var transPack = window.marbbleDic[this.model.getPlayer().lang][this.model.getNextPlayer().lang];
                          transPackValid = true;
                          trans = transPack[match[1]];
                        } catch(e) {
                          if(!transPackValid) {
                            console.log("NO TRANS PACK - AI MOVE");
                            trans = "BYPASS";
                          } else {
                              trans = "";
                          }
                        }
                        if (score < maxwpoints  && (type != "common" || (trans != match[1] && typeof trans != "undefined"))) {
                            wordMove = wordinfo;
                        }
                      }
                    }
                  }
                  // document.getElementById("board_tileBg_"+ay+"_"+ax).style.border = "solid black 1px";
              }
            }
            // //console.log(moves);
            if(wordMove.word.length > 0) {
              return wordMove;
            } else {
              return undefined;
            }
          }
        }, {
          key: "aiBuildAltPossibleMove",
          value: function aiBuildAltPossibleMove(opponent_rack, moveLetter, ax, ay, ayN, ayP) {
            var move = {};
            var model = this.model;
            var letterSet = moveLetter == null ? opponent_rack : opponent_rack.push(moveLetter.toLowerCase());
            var wordinfo;
            var match;
            var firstWord = false;
            var wordMove ={word: ""};

            //if first move
            if(ax == null && ay == null && moveLetter == null) {
              ax = 7; ay = 7; ayN = 0; ayP = 14;
              firstWord = true;
            }

            move.tile = {letter: model.g_board[ay][ax], y: ay, x: ax};
            move.yN = ay - ayN;
            move.yP = ayP - ay;
            move.orientation = "x";
            // moves.push(move);
            // var moveLetter = model.g_board[ay][ax].toLowerCase()
            var regex = new RegExp("_(["+letterSet+"]{0,7})_", "g");
            // var regex1 = new RegExp("_"+model.g_board[ay][ax]+"(["+opponent_rack+"]{0,7})_", "g");
            // var regex2 = new RegExp("_(["+opponent_rack+"]{0,7})"+model.g_board[ay][ax]+"(["+opponent_rack+"]{0,7})_", "g");
            // var regex3 = new RegExp("_(["+opponent_rack+"]{0,7})"+model.g_board[ay][ax]+"_", "g");
            while(match=regex.exec(g_wstr[model.players[model.playerToPlay].lang])) {
              var matchCheck = match[1].split("");
              if ((moveLetter == null && !matchCheck.some(function(v,i,a){return a.lastIndexOf(v)!=i;}))  ||
                    (match[1].indexOf(moveLetter) > -1 &&
                      match[1].indexOf(moveLetter) < move.yN &&
                      (match[1].length - match[1].indexOf(moveLetter)) < move.yP &&
                      !matchCheck.some(function(v,i,a){return a.lastIndexOf(v)!=i;})
                    )
                  )
              {
                regex.px = {ax:ax, ay:ay - match[1].indexOf(moveLetter)};
                var word = match[1];
                word = word.split('');
                word[match[1].indexOf(moveLetter)] = '_';
                word = word.join('');
                var ayStep = firstWord ? 7 : ay - match[1].indexOf(moveLetter);
                var axStep = firstWord ? 7 : ax;
                wordinfo   = { word:word, ay:axStep, ax:ayStep };
                wordinfo.seq   = word;     // sequence to put on board
                // wordinfo.lscrs = seq_lscrs;   // sequence letter scores
                wordinfo.ps    = regex.ps;    // index of word start
                wordinfo.xy    = "x";    // direction of scan
                wordinfo.prec  = ay - match[1].indexOf(moveLetter);  // letters before anchor
                wordinfo.exlude = true; //exclude from placing reference tile
                // //console.log(wordinfo);
                wordinfo.score = 0;
                var score = 0;
                if( /[^a-zA-Z_]/.test( word ) ) {
                  continue;
                }
                for(var si = 0; si < match[1].length; si++) {
                  score += window.letterValues[this.model.getPlayer().lang][this.model.gameMode][match[1][si]]["v"];
                }
                wordinfo.score = score;
                // //console.log(wordinfo);
                var more = Math.ceil(Math.random()*5);
                var maxwpoints = this.model.g_maxwpoints[this.model.g_playlevel] + more;
                //console.log(match[1],"SCORE:",score,"<",maxwpoints);
                var trans = "";
                var transPackValid = false;
                try {
                  var transPack = window.marbbleDic[this.model.getPlayer().lang][this.model.getNextPlayer().lang];
                  transPackValid = true;
                  trans = transPack[match[1]];
                } catch(e) {
                  if(!transPackValid) {
                    console.log("NO TRANS PACK - AI MOVE");
                    trans = "BYPASS";
                  } else {
                      trans = "";
                  }
                }
                if (score < maxwpoints  && wordinfo.word.length > 1 && ((trans != match[1] && typeof trans != "undefined")) || (this.model.getPlayer().lang ==  this.model.getNextPlayer().lang)) {
                    wordMove = wordinfo;
                }
              }
            }
            // //console.log(moves);
            if(wordMove.word.length > 0) {
              return wordMove;
            } else {
              return undefined;
            }
          }
        }, {
          key: "aiMoveWordExtendX",
          value: function aiMoveWordExtendX(type) {
            // checks if played words can still be extended

            // //console.log("get alternative possible move. ", ax, ay, letters);
            // //console.log("Reference tile: ", this.g_board[ax][ay].letter);
            var rack = this.getAIRack();
            var model = this.model;
            var moves = [];
            var letters = "";
            var opponent_rack = [];
            var wordinfo;
            var wordMove ={word: ""};
            var match; //remove
            var ay = 0;
            var ax = 0;
            var bestscore = 0;

            var aiRack = this.getAIRack();
            var letters = aiRack.letters;
            var opponent_rack = aiRack.opponent_rack;

            for(ay = 0; ay < 15; ay++) {
              for(ax = 0; ax < 15; ax++) {
                if (model.g_board[ay][ax] !== "" && ay > 0 && ay < 14) {
                    //if not blank check if we can extend
                    //scan to the left of x
                    var axSN = ax;
                    var axSNBlank = ax;
                    var hasNEncounteredBlank = false;
                    var axSNTemp = ax;
                    for(0; axSNBlank > 0 && axSNBlank < 14; axSNBlank--) {
                      if(model.g_board[ay][axSNTemp - 1] == "") {
                        hasNEncounteredBlank = true;
                        if(model.g_board[ay - 1][axSNTemp - 1] != "" ||
                           model.g_board[ay + 1][axSNTemp - 1] != "") {
                             axSNBlank++;
                             break;
                           }
                      } else if(!hasNEncounteredBlank){
                        axSN--;
                      } else {
                        break;
                      }
                      axSNTemp--;
                    }

                    //scan to the right of x
                    var axSP = ax;
                    var axSPBlank = ax;
                    var hasPEncounteredBlank = false;
                    var axSPTemp = ax;
                    for(0; axSPBlank > 0 && axSPBlank < 14; axSPBlank++) {
                      if(model.g_board[ay][axSPTemp + 1] == "") {
                        hasPEncounteredBlank = true;
                        if(model.g_board[ay - 1][axSPTemp + 1] != "" ||
                           model.g_board[ay + 1][axSPTemp + 1] != "") {
                             axSPBlank--;
                             break;
                           }
                      } else if(!hasPEncounteredBlank) {
                        axSP++;
                      } else {
                        break;
                      }
                      axSPTemp++;
                    }

                    //build word
                    var wordArray = [];
                    var word = "";
                    for(var i = axSN; i <= axSP; i++) {
                      wordArray.push(model.g_board[ay][i].toLowerCase());
                      word += model.g_board[ay][i].toLowerCase();
                    }

                    //start and end of word
                    var xStart = axSN;
                    var xEnd = axSP;
                    var xBlankStart = axSNBlank;
                    var xBlankEnd = axSPBlank;

                    var aiRack = this.getAIRack();
                    var letters = aiRack.letters;
                    var opponent_rack = aiRack.opponent_rack;

                    //search dictionary for valid words
                    var regex = new RegExp("_(["+opponent_rack+"]{0,7})("+word+"{1})(["+opponent_rack+"]{0,7})_", "g");
                    while(match=regex.exec(g_wstr[model.players[model.playerToPlay].lang])) {
                      var wordMatch = match[0];
                      // consolew.log(wordMatch);
                      //remove underscore
                      wordMatch = wordMatch.replace(/_/g,"");

                      //check if letters can fill available board space
                      // //console.log(xStart,wordMatch.indexOf(word),(xStart - wordMatch.indexOf(word)),xBlankStart);
                      var xStartValid = (xStart - wordMatch.indexOf(word)) > xBlankStart;
                      // //console.log(xBlankEnd,xEnd,(xBlankEnd - xEnd),(wordMatch.length - ((word.length-1) + wordMatch.indexOf(word))));
                      var xEndValid = (xBlankEnd - xEnd) > (wordMatch.length - ((word.length-1) + wordMatch.indexOf(word)));
                      // //console.log("xStartValid",xStartValid);
                      // //console.log("xEndValid", xEndValid);

                      //check if rack can provide letters needed
                      var tempRack = opponent_rack;
                      var rackValid = true;
                      var lettersNeeded = wordMatch.replace(word,"");
                      for(var iT=0;iT<lettersNeeded.length;iT++) {
                        for(var jT=0;jT<opponent_rack.length;jT++) {
                          if(lettersNeeded[iT] == tempRack[jT]) {
                            tempRack[jT] = ""; //set as blank so we know tile is allotted
                            break;
                          }
                          if((opponent_rack.length - 1) == jT) {
                            rackValid = false;
                          }
                        }
                      }

                      //check if the match is not equal the word and can be extended
                      if(wordMatch != word && rackValid && xStartValid && xEndValid) {
                        // //console.log("ENTER");
                        var wordStart = wordMatch.indexOf(word);
                        var wordEnd = wordStart + (word.length - 1);

                        var filteredWord = "";
                        for(var i = 0; i < wordMatch.length; i++) {
                          if(i < wordStart || i > wordEnd) {
                            filteredWord += wordMatch[i];
                          } else {
                            filteredWord += "_";
                          }
                        }

                        //SCORE
                        var score = 0;
                        for(var si = 0; si < wordMatch.length; si++) {
                          score += window.letterValues[this.model.getPlayer().lang][this.model.gameMode][wordMatch[si]]["v"];
                        }
                        var more = Math.ceil(Math.random()*5);
                        var maxwpoints = this.model.g_maxwpoints[this.model.g_playlevel] + more;
                        var trans = "";
                        var transPackValid = false;
                        try {
                          var transPack = window.marbbleDic[this.model.getPlayer().lang][this.model.getNextPlayer().lang];
                          transPackValid = true;
                          trans = transPack[match[1]];
                        } catch(e) {
                          if(!transPackValid) {
                            console.log("NO TRANS PACK - AI MOVE");
                            trans = "BYPASS";
                          } else {
                              trans = "";
                          }
                        }
                        if (score <= maxwpoints && (type != "common" || (trans != wordMatch && typeof trans != "undefined" && trans != ""))) {
                            // wordMove = wordinfo;
                            // //console.log("SET WORDMOVE");
                            wordMove = { word: filteredWord,
                                         ay: xStart - wordMatch.indexOf(word),
                                         ax: ay,
                                         xy: "y",
                                         exclude: true};
                        }
                        //END SCORE
                      }
                    }
                }
              }
            }
            // //console.log(moves);
            if(wordMove.word.length > 0) {
              return wordMove;
            } else {
              return undefined;
            }
          }
        },{ key: "aiMoveWordExtendY",
        value: function aiMoveWordExtendY(type) {
          // checks if played words can still be extended

          // //console.log("get alternative possible move. ", ax, ay, letters);
          // //console.log("Reference tile: ", this.g_board[ax][ay].letter);
          var rack = this.getAIRack();
          var model = this.model;
          var moves = [];
          var letters = "";
          var opponent_rack = [];
          var wordinfo;
          var wordMove ={word: ""};
          var match; //remove
          var ay = 0;
          var ax = 0;
          var bestscore = 0;

          var aiRack = this.getAIRack();
          var letters = aiRack.letters;
          var opponent_rack = aiRack.opponent_rack;

          for(ay = 0; ay < 15; ay++) {
            for(ax = 0; ax < 15; ax++) {
              if (model.g_board[ay][ax] !== "" && ay > 0 && ay < 14) {
                  //if not blank check if we can extend
                  //scan to the up of y
                  var aySN = ay;
                  var aySNBlank = ay;
                  var hasNEncounteredBlank = false;
                  var aySNTemp = ay;
                  for(0; aySNBlank > 0 && aySNBlank < 14; aySNBlank--) {
                    if(model.g_board[aySNTemp -1 ][ax] == "") {
                      hasNEncounteredBlank = true;
                      if(model.g_board[aySNTemp - 1][ax - 1] != "" ||
                         model.g_board[aySNTemp + 1][ax - 1] != "") {
                           aySNBlank++;
                           break;
                         }
                    } else if(!hasNEncounteredBlank){
                      aySN--;
                    } else {
                      break;
                    }
                    aySNTemp--;
                  }

                  //scan to the right of x
                  var aySP = ay;
                  var aySPBlank = ay;
                  var hasPEncounteredBlank = false;
                  var aySPTemp = ay;
                  for(0; aySPBlank > 0 && aySPBlank < 14; aySPBlank++) {
                    if(model.g_board[aySPTemp + 1][ax] == "") {
                      hasPEncounteredBlank = true;
                      if(model.g_board[aySPTemp - 1][ax + 1] != "" ||
                         model.g_board[aySPTemp + 1][ax + 1] != "") {
                           aySPBlank--;
                           break;
                         }
                    } else if(!hasPEncounteredBlank) {
                      aySP++;
                    } else {
                      break;
                    }
                    aySPTemp++;
                  }

                  //build word
                  var wordArray = [];
                  var word = "";
                  for(var i = aySN; i <= aySP; i++) {
                    wordArray.push(model.g_board[i][ax].toLowerCase());
                    word += model.g_board[i][ax].toLowerCase();
                  }

                  //start and end of word
                  var yStart = aySN;
                  var yEnd = aySP;
                  var yBlankStart = aySNBlank;
                  var yBlankEnd = aySPBlank;

                  var aiRack = this.getAIRack();
                  var letters = aiRack.letters;
                  var opponent_rack = aiRack.opponent_rack;

                  //search dictionary for valid words
                  var regex = new RegExp("_(["+opponent_rack+"]{0,7})("+word+"{1})(["+opponent_rack+"]{0,7})_", "g");
                  while(match=regex.exec(g_wstr[model.players[model.playerToPlay].lang])) {
                    var wordMatch = match[0];
                    // //console.log(wordMatch);
                    //remove underscore
                    wordMatch = wordMatch.replace(/_/g,"");

                    //check if letters can fill available board space
                    // //console.log(yStart,wordMatch.indexOf(word),(yStart - wordMatch.indexOf(word)),yBlankStart);
                    var yStartValid = (yStart - wordMatch.indexOf(word)) < yBlankStart;
                    // //console.log(yBlankEnd,yEnd,(yBlankEnd - yEnd),(wordMatch.length - ((word.length-1) + wordMatch.indexOf(word))));
                    var yEndValid = (yBlankEnd - yEnd) > (wordMatch.length - ((word.length-1) + wordMatch.indexOf(word)));
                    // //console.log("yStartValid",yStartValid);
                    // //console.log("yEndValid", yEndValid);

                    //check if rack can provide letters needed
                    var tempRack = opponent_rack;
                    var rackValid = true;
                    var lettersNeeded = wordMatch.replace(word,"");
                    for(var iT=0;iT<lettersNeeded.length;iT++) {
                      for(var jT=0;jT<opponent_rack.length;jT++) {
                        if(lettersNeeded[iT] == tempRack[jT]) {
                          tempRack[jT] = ""; //set as blank so we know tile is allotted
                          break;
                        }
                        if((opponent_rack.length - 1) == jT) {
                          rackValid = false;
                        }
                      }
                    }

                    //check if the match is not equal the word and can be extended
                    if(wordMatch != word && rackValid && yStartValid && yEndValid) {
                      // //console.log("ENTER");
                      var wordStart = wordMatch.indexOf(word);
                      var wordEnd = wordStart + (word.length - 1);

                      var filteredWord = "";
                      for(var i = 0; i < wordMatch.length; i++) {
                        if(i < wordStart || i > wordEnd) {
                          filteredWord += wordMatch[i];
                        } else {
                          filteredWord += "_";
                        }
                      }

                      //SCORE
                      var score = 0;
                      for(var si = 0; si < wordMatch.length; si++) {
                        score += window.letterValues[this.model.getPlayer().lang][this.model.gameMode][wordMatch[si]]["v"];
                      }

                      var more = Math.ceil(Math.random()*5);
                      var maxwpoints = this.model.g_maxwpoints[this.model.g_playlevel] + more;
                      var trans = "";
                      var transPackValid = false;
                      try {
                        var transPack = window.marbbleDic[this.model.getPlayer().lang][this.model.getNextPlayer().lang];
                        transPackValid = true;
                        trans = transPack[match[1]];
                      } catch(e) {
                        if(!transPackValid) {
                          console.log("NO TRANS PACK - AI MOVE");
                          trans = "BYPASS";
                        } else {
                            trans = "";
                        }
                      }
                      if (score <= maxwpoints && (type != "common" || (trans != wordMatch && typeof trans != "undefined" && trans != ""))) {
                          // wordMove = wordinfo;
                          // //console.log("SET WORDMOVE");
                          wordMove = { word: filteredWord,
                                       ax: yStart - wordMatch.indexOf(word),
                                       ay: ax,
                                       xy: "x",
                                       exclude: true};
                      }
                      //END SCORE
                    }
                  }
              }
            }
          }
          // //console.log(moves);
          if(wordMove.word.length > 0) {
            return wordMove;
          } else {
            return undefined;
          }
        }
      }, {
          key: "getAIRack",
          value: function getAIRack() {
            var aiRack = {};
            aiRack.letters = "";
            aiRack.opponent_rack = [];
            var model = this.model;
            for(var i=0; i<model.players[model.playerToPlay].rack.length; i++) {
              aiRack.letters += model.players[model.playerToPlay].rack[i].letter;
              aiRack.opponent_rack.push(model.players[model.playerToPlay].rack[i].letter);
            }
            return aiRack;
          }
        }, {
            key: "endGame",
            value: function endGame() {
                var result = this.model.endGame();
                if (result == "END_GAME") {
                    this.setTempScore(0);
                    this.setHorizontalTilePlayed(null);
                    this.setVerticalTilePlayed(null);
                    this.setHorizontalTilesArray([]);
                    this.setVerticalTilesArray([]);
                    this.setLastTilePlayed(null);
                    this.debug("GameControler", result);

                    //console.log('removing game ' + this.model.gameId + ' from list');
                    removeFromGamesList(this.model.gameId);

                    this.hideDialog();

                    this.showGameOver(this.playerControlers);
                }
            }
        },
        {
            key: "confirmEndGame",
            value: function confirmEndGame() {
                this.hideDialog();
                this.component.screenDiv.removeChild(this.component.gameScreenDiv);
                window.localStorage.removeItem("game");
                initMarbble('marbblescreen', this.gameMode, "en");
            }
        },
        {
            key: "isDragging",
            value: function isDragging() {
                //this doesn't work as expected in ios devices
                var isDragging = false;
                for (var i = 0; i < 7; i++) {
                    if (this.model.getPlayer().previousRack[i]) {
                        var tile = this.model.getPlayer().previousRack[i];
                        isDragging = tile.component.tileDiv.getAttribute('isDragging');
                        if (isDragging == "true") {
                            //return true if there is a tile being dragged
                            return isDragging;
                        }
                    }
                }

                return isDragging;

            }
        },
        {
            key: "updateMenuButtons",
            value: function updateMenuButtons() {

                var isTilePlayed = false;

                for (var j = 0; j < this.model.getPlayer().previousRack.length; j++) {
                    if (this.model.getPlayer().previousRack[j] != null) {
                        isTilePlayed = true;
                        break;
                    }
                }

                this.component.updateMenuButtons(isTilePlayed);
            }
        },
        {
            key: "zoomInGameBoard",
            value: function zoomInGameBoard(mousePos) {
                this.component.zoomInGameBoard(mousePos);
            }
        }, {
            key: "debug",
            value: function debug(title, message) {
                if (typeof title == "undefined") {
                    title = "GameController";
                }
                title += ".js --- ";

                if (typeof message == "undefined") {
                    message = "";
                }

                if (this.showDebug == true) {
                    //console.log(title + message);
                }

            }
        }, {
            key: "setTempScore",
            value: function setTempScore(score) {
                this.tempScore = score;
                this.debug('GameControler', 'Setting temp score: ' + score);
            }
        }, {
            key: "setLastScore",
            value: function setLastScore(score) {
                this.lastScore = score;
                this.debug('GameControler', 'Setting last score: ' + score);
            }
        }, {
            key: "getLastScore",
            value: function getLastScore() {
                this.debug('GameControler', 'Getting last Score: ' + this.lastScore);
                return this.lastScore;
            }
        }, {
            key: "getTempScore",
            value: function getTempScore() {
                this.debug('GameControler', 'Getting temp Score: ' + this.tempScore);
                return this.tempScore;
            }
        }, {
            key: "setHorizontalTilesArray",
            value: function setHorizontalTilesArray(tiles) {
                this.horizontalTilesArray = tiles;
            }
        }, {
            key: "getHorizontalTilesArray",
            value: function getHorizontalTilesArray() {
                return this.horizontalTilesArray;
            }
        }, {
            key: "setVerticalTilesArray",
            value: function setVerticalTilesArray(tiles) {
                this.verticalTilesArray = tiles;
            }
        }, {
            key: "getVerticalTilesArray",
            value: function getVerticalTilesArray() {
                return this.verticalTilesArray;
            }
        }, {
            key: "setHorizontalTilePlayed",
            value: function setHorizontalTilePlayed(tile) {
                this.horizontalTilePlayed = tile;
            }
        }, {
            key: "getHorizontalTilePlayed",
            value: function getHorizontalTilePlayed() {
                return this.horizontalTilePlayed;
            }
        }, {
            key: "getVerticalTilePlayed",
            value: function getVerticalTilePlayed() {
                return this.verticalTilePlayed;
            }
        }, {
            key: "setVerticalTilePlayed",
            value: function setVerticalTilePlayed(tile) {
                this.verticalTilePlayed = tile;
            }
        }, {
            key: "setLastTilePlayed",
            value: function setLastTilePlayed(tile) {
                this.hideLastScore();
                this.lastTilePlayed = tile;
            }
        }, {
            key: "getLastTilePlayed",
            value: function getLastTilePlayed() {
                return this.lastTilePlayed;
            }
        }, {
            key: "showScoreBubble",
            value: function showScoreBubble(div, isTempScore, score) {

                this.component.showScoreBubble(div, isTempScore, score);
            }
        }, {
            key: "hideScoreBubble",
            value: function hideScoreBubble(div) {
                if (div) {
                    this.component.hideScoreBubble(div);
                }
            }
        }, {
            key: "showMessage",
            value: function showMessage(message) {
                if (message) {
                    this.component.showMessage(message);
                }
            }
        }, {
            key: "hideDialog",
            value: function hideDialog() {
                this.component.hideDialog();
            }
        }, {
            key: "showConfirmation",
            value: function showConfirmation(message, type) {
                if (typeof type == 'undefined') {
                    type = 'success';
                }

                if (message) {
                    //console.log('type: ' + type + ' message: ' + message);
                    this.component.showConfirmation(message, type);
                }
            }
        }, {
            key: "showGameOver",
            value: function showGameOver(winner) {
                this.component.showGameOver(winner);
            }
        }, {
            key: "showTempScore",
            value: function showTempScore() {
                var horizontalTilesArray = this.getHorizontalTilesArray();
                var verticalTilesArray = this.getVerticalTilesArray();
                var horizontalTilePlayed = this.getHorizontalTilePlayed();
                var verticalTilePlayed = this.getVerticalTilePlayed();

                var score = this.getTempScore();
                if (horizontalTilePlayed && !verticalTilePlayed) {
                    if (horizontalTilesArray.length > 0) {
                        for (var i = 0; i < horizontalTilesArray.length; i++) {
                            var tileScoreDiv = horizontalTilesArray[i].component.tileScoreDiv;
                            this.hideScoreBubble(tileScoreDiv);
                            if (horizontalTilePlayed.id == horizontalTilesArray[i].id) {
                                var isTempScore = true;
                                this.showScoreBubble(tileScoreDiv, isTempScore, score);
                            }
                        }
                    }
                } else if (!horizontalTilePlayed && verticalTilePlayed) {
                    if (verticalTilesArray.length > 0) {
                        for (var i = 0; i < verticalTilesArray.length; i++) {
                            var tileScoreDiv = verticalTilesArray[i].component.tileScoreDiv;
                            this.hideScoreBubble(tileScoreDiv);
                            if (verticalTilePlayed.id == verticalTilesArray[i].id) {
                                var isTempScore = true;
                                this.showScoreBubble(tileScoreDiv, isTempScore, score);
                            }
                        }
                    }
                } else if (horizontalTilePlayed && verticalTilePlayed) {

                    if (this.getDirectionHorizontal()) {
                        if (horizontalTilesArray.length > 0) {
                            for (var j = 0; j < horizontalTilesArray.length; j++) {
                                var tileScoreDiv = horizontalTilesArray[j].component.tileScoreDiv;
                                this.hideScoreBubble(tileScoreDiv);
                                if (horizontalTilePlayed.id == horizontalTilesArray[j].id) {
                                    var isTempScore = true;
                                    this.showScoreBubble(tileScoreDiv, isTempScore, score);
                                }
                            }
                        }
                    } else {
                        for (var i = 0; i < verticalTilesArray.length; i++) {
                            var tileScoreDiv = verticalTilesArray[i].component.tileScoreDiv;
                            this.hideScoreBubble(tileScoreDiv);

                            if (verticalTilePlayed.id == verticalTilesArray[i].id) {
                                var isTempScore = true;
                                this.showScoreBubble(tileScoreDiv, isTempScore, score);
                            }
                        }
                    }
                }
            }
        }, {
            key: "hideTempScore",
            value: function hideTempScore() {

                var horizontalTilePlayed = this.getHorizontalTilePlayed();
                var verticalTilePlayed = this.getVerticalTilePlayed();
                var horizontalTilesArray = this.getHorizontalTilesArray();
                var verticalTilesArray = this.getVerticalTilesArray();

                if (horizontalTilePlayed) {
                    this.hideScoreBubble(horizontalTilePlayed.component.tileScoreDiv);
                }
                if (verticalTilePlayed) {
                    this.hideScoreBubble(verticalTilePlayed.component.tileScoreDiv);
                }
            }
        }, {
            key: "showLastScore",
            value: function showLastScore() {
                var lastTilePlayed = this.getLastTilePlayed();
                var score = this.getLastScore();

                if (lastTilePlayed) {
                    var tileScoreDiv = lastTilePlayed.component.tileScoreDiv;
                    var isTempScore = false; //play has been committed
                    this.showScoreBubble(tileScoreDiv, isTempScore, score);
                }
            }
        }, {
            key: "hideLastScore",
            value: function hideLastScore() {
                var lastTilePlayed = this.getLastTilePlayed();
                if (lastTilePlayed) {
                    var tileScoreDiv = lastTilePlayed.component.tileScoreDiv;
                    this.hideScoreBubble(tileScoreDiv);
                }
            }
        }, {
            key: "getDirectionHorizontal",
            value: function getDirectionHorizontal() {
                return this.isDirectionHorizontal;
            }
        }, {
            key: "setDirectionHorizontal",
            value: function setDirectionHorizontal(isDirectionHorizontal) {
                this.isDirectionHorizontal = isDirectionHorizontal;
            }
        }, {
            key: "getLastWord",
            value: function getLastWord() {
                var lastWord = this.model.getPlayer().getLastWord();

                var horizontalTilePlayed = this.getHorizontalTilePlayed();
                var verticalTilePlayed = this.getVerticalTilePlayed();

                //perform this check when user forms a horizontal and vertical word
                if (horizontalTilePlayed && verticalTilePlayed) {
                    if (this.getDirectionHorizontal()) {
                        var string = "";
                        var horizontalTilesArray = this.getHorizontalTilesArray();
                        if (horizontalTilesArray.length > 0) {
                            for (var i = 0; i < horizontalTilesArray.length; i++) {
                                string += horizontalTilesArray[i].letter;
                            }
                            lastWord = string;
                        }
                    } else {
                        var verticalTilesArray = this.getVerticalTilesArray();
                        if (verticalTilesArray.length > 0) {
                            var string = "";
                            for (var i = verticalTilesArray.length - 1; i >= 0; i--) {
                                string += verticalTilesArray[i].letter;
                            }
                            lastWord = string;

                        }
                    }
                }

                return lastWord;
            }
        }, {
            key: "hideSwap",
            value: function hideSwap() {
                var action = "gather";
                var playerControler = this.playerControlers[this.model.playerToPlay];
                playerControler.gatherRackTiles(action);
                this.currentAction = null;
                this.updateMenuButtons();
                this.component.hideSwapTile();
                if(this.model.playerToPlay == 1 && this.model.isSoloPlay) {
                  document.getElementById("playerRack_0").style.display =  "block";
                  document.getElementById("playerRack_1").style.display = "none";
                }
            }
        }, {
            key: "showSwapTile",
            value: function showSwapTile() {

                var bagSize = this.model.getPlayer().bag.length;
                //disable swapping if tile bag is empty
                if(bagSize <= 0) {
                    return;
                }

                if(this.isMenuButtonDisabled) {
                    console.log("MENU DISABLED PASS NOT ALLOWED");
                    return;
                }

                if (this.currentAction == null) {
                    this.currentAction = "swapTiles"
                    var action = "gather";
                    var playerControler = this.playerControlers[this.model.playerToPlay];
                    playerControler.gatherRackTiles(action);
                    this.component.showSwapTile();
                }
                else {
                    this.hideSwap();
                }
            }
        }, {
            key: "updateRemainingTileCount",
            value: function updateRemainingTileCount() {

                var availableLetters = {};

                for (var i = 0; i < this.model.getPlayer().bag.length; i++) {
                    var obj = this.model.getPlayer().bag[i];
                    var letter = obj.letter;
                    var totalLetterCount = obj.number;

                    if (!(letter in availableLetters)) {
                        availableLetters[letter] = {
                            letter: letter,
                            totalLetterCount: totalLetterCount,
                            availableLetterCount: 0
                        };
                    }

                    availableLetters[letter]['availableLetterCount'] += 1;
                }


                for (var letter in availableLetters) {
                    var availableLetterCount = availableLetters[letter].availableLetterCount;
                    var totalLetterCount = availableLetters[letter].totalLetterCount;
                    this.component.updateRemainingTileCount(letter, availableLetterCount);
                }

            }
        }, {
            key: "getPanning",
            value: function getPanning() {
                return this.isPanning;
            }
        }, {
            key: "setPanning",
            value: function setPanning(value) {
                this.isPanning = value;
            }
        }, {
            key: "closeInvalidWordDialog",
            value: function closeInvalidWordDialog() {
                this.gatherTiles();
                this.component.hideDialog();
            }
        },  {
            key: "showNextTurnDialog",
            value: function showNextTurnDialog(name) {
                this.component.showNextTurnDialog(name);
            }
        }, {
            key: "hideNextTurnDialog",
            value: function hideNextTurnDialog() {
                this.component.hideNextTurnDialog();
            }
        }, {
            key: "backToMain",
            value: function backToMain() {
                if(isGameSaved) {
                    this.confirmBackToMain(this);
                } else {
                    var type = "backToMain";

                    var backToMainText = this.appLanguage.exitWithoutSave;
                    this.showConfirmation(backToMainText, type, this.confirmBackToMain.bind(this));
                }

            }
        }, {
            key: "confirmBackToMain",
            value: function confirmBackToMain() {
                this.component.hideDialog();
                window.localStorage.removeItem("game");
                this.component.screenDiv.removeChild(this.component.gameScreenDiv);

                var mainMenuDiv = document.getElementById("mainMenu");

                this.component.screenDiv.appendChild(mainMenuDiv);
                mainMenuDiv.style.display = 'block';
                _windowOpened = 'mainMenuWindow';
                mainInterface.reloadGamesList();

            }
        }, {
            key: "swapTilesOnClick",
            value: function swapTilesOnClick(tile) {
                var isDragging = tile.component.tileDiv.getAttribute('isDragging');
                if(isDragging === false || isDragging === "false") {
                    this.drawSwapRack(tile);
                }
            }
        }, {
            key: "drawSwapRack",
            value: function drawSwapRack(tile) {
                this.component.drawSwapRack(tile);
            }
        }, {
            key: "updatePlayerRack",
            value: function updatePlayerRack(playerControler) {

                var docW = document.getElementById('marbblescreen').clientWidth;
                var docH = document.getElementById('marbblescreen').clientHeight;
                var rackHeight = document.getElementById('playerRack').clientHeight;
                var menuHeight = document.getElementById('mbb_menu').clientHeight;

                playerControler.draw(docW, menuHeight, docW, rackHeight);
            }
        }, {
            key: "hideOpponentRack",
            value: function hideOpponentRack() {
                this.isMenuButtonDisabled = true;
                this.component.hideOpponentRack(this.model.playerToPlay);
            }
        },  {
            key: "showUnknownWordDialog",
            value: function showUnknownWordDialog(word) {
                this.component.showUnknownWordDialog(word);
            }
        }, {
            key: "hideUnknownWordDialog",
            value: function hideUnknownWordDialog() {
                this.component.hideUnknownWordDialog();
                this.unknownWordsPlayed = [];
            }
        }, {
            key: "cancelInvalidWord",
            value: function cancelInvalidWord() {
                this.gatherTiles();
                this.hideUnknownWordDialog();
            }
        }, {
            key: "confirmPlayUnknownWord",
            value: function confirmPlayUnknownWord() {
                this.allowInvalidWord = true;
                this.hideUnknownWordDialog();
                this.playForGood();
                this.unknownWordsPlayed = [];
            }
        }, {
            key: "getDoNotAskValue",
            value: function getDoNotAskValue() {
                var isAllowed = document.getElementById('unknownWordAllowed').checked;
                return (/true/i).test(isAllowed);
            }
        }, {
            key: "setTileAsUnknownWord",
            value: function setTileAsUnknownWord(tile) {
                this.component.setTileAsUnknownWord(tile);
            }
        }
    ]);

    return GameControler;
}();
