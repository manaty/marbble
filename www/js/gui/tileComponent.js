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

var tileImg = ["", "DL.png", "TL.png", "DW.png", "TW.png", "ST.png"];
var svgNS = "http://www.w3.org/2000/svg";

var TileComponent = function() {
    function TileComponent(tile, playerControler) {
        _classCallCheck(this, TileComponent);

        this.model = tile;
        tile.component = this;
        this.playerControler = playerControler;
        this.isToSwap = false;
        this.tileSizeInPx = 10;
        this.tileDiv = document.createElement('div');
        this.tileDiv.className = "tile";
        this.tileScoreDiv = document.createElement('div');
        this.tileScoreDiv.id = 'tileScore';
        this.tileScoreDiv.className = 'tileScore';
        this.tileScoreDiv.classList.add('redCircle');
        this.tileScoreText = document.createTextNode('0');
        this.tileScoreDiv.appendChild(this.tileScoreText);
        this.tileScoreDiv.style.display = "none";
        this.textGroupContainerDiv = document.createElement('div');
        this.textGroupContainerDiv.id = 'textGroupContainer';
        this.textGroupContainerDiv.className = "tileElementContainer";
        this.tileValueContainer = document.createElement('div');
        this.tileValueContainer.id = 'tileValueContainer';
        this.tileValueContainer.className = 'tileValueContainer';
        //create tile value text
        this.valueElement = document.createTextNode('');
        this.tileValueContainer.appendChild(this.valueElement);

        var playerToPlay = this.playerControler.model.idx;
        var nextPlayer = playerToPlay == 0 ? 1 : 0;
        this.tileValueContainer.classList.add("tileValue-p" + (playerToPlay + 1));
        this.tileValueContainer.classList.add("active");
        this.textGroupContainerDiv.appendChild(this.tileValueContainer);

        //tile value for other player
        this.tileValueContainerP2 = document.createElement('div');
        this.tileValueContainerP2.id = 'tileValueContainerP2';
        this.tileValueContainerP2.className = 'tileValueContainer';
        //create tile value text
        this.valueElementP2 = document.createTextNode('');
        this.tileValueContainerP2.appendChild(this.valueElementP2);
        this.tileValueContainerP2.classList.add("tileValue-p" + (nextPlayer + 1));
        this.textGroupContainerDiv.appendChild(this.tileValueContainerP2);

        this.tileTextContainer = document.createElement('div');
        this.tileTextContainer.id = 'tileTextContainer';
        this.tileTextContainer.className = 'tileTextContainer';
        //create tile letter text
        this.textElement = document.createTextNode('');
        this.tileTextContainer.appendChild(this.textElement);
        this.textGroupContainerDiv.appendChild(this.tileTextContainer);

        this.tileTextContainerSpecial = document.createElement('div');
        this.tileTextContainerSpecial.id = 'tileTextContainer';
        this.tileTextContainerSpecial.className = 'tileTextContainer';
        //create tile letter text
        this.textElementSpecial = document.createTextNode('');
        this.tileTextContainerSpecial.appendChild(this.textElementSpecial);
        this.textGroupContainerDiv.appendChild(this.tileTextContainerSpecial);

        this.textGroupContainerDiv.appendChild(this.tileScoreDiv);
        this.tileDiv.appendChild(this.textGroupContainerDiv);
        this.tileDiv.id = tile.id;
        this.tileDiv.component = this;
        this.tileDiv.draggable = true;
        this.tileDiv.classList.add("playerTile" + this.playerControler.model.idx);
        this.tileDiv.setAttribute('isDragging', false);


        this.tileDiv.addEventListener("click", this.click.bind(this), true);
        if (this.model.isJoker) {
            this.tileDiv.addEventListener("dblclick", this.dblclick.bind(this), true);
        }

        this.tileDiv.addEventListener("long-press", this.longPress.bind(this), true);
    }

    _createClass(TileComponent, [{
        key: "onDragged",
        value: function onDragged(el, source) {
            var tileSizeInPx = this.playerControler.gameControler.component.boardDiv.clientWidth / 15;
            this.draw(tileSizeInPx, el);
            this.tileScoreDiv.style.display = "none";
            this.tileDiv.setAttribute('isDragging', true);
            gameControler.setPanning(false);
        }
    }, {
        key: "onDropped",
        value: function onDropped(el, target, source, sibling) {
            var tileSizeInPx = target.clientWidth;
            this.draw(tileSizeInPx, el, target);
            var tileDiv = this.tileDiv;
            //Delay setting of isDragging to false
            setTimeout(function(){
                tileDiv.setAttribute('isDragging', false);
            }, 300);
            gameControler.setPanning(true);
            //check if tile is blank
            if(this.textElement.textContent == "" && source.classList.contains("playerTileBg") && target.classList.contains("boardTileBg")) {
              var letters = letterValues[this.playerControler.model.lang];
              gameControler.component.showBlankTileSelect(letters, this, target);
            }
        }
    }, {
        key: "onCanceled",
        value: function onCanceled(el, target, source) {
            var tileSizeInPx = target.clientWidth;
            this.draw(tileSizeInPx, el);
            this.tileDiv.setAttribute('isDragging', false);
            gameControler.setPanning(false);
        }
    }, {
      key: "dblclick",
      value: function dblclick(ev) {
        var node = ev.target;
        while (node.id.indexOf("_tileBg_") == -1) {
          node = node.parentNode;
        }
        var tileComponent = node.firstChild.component;
        var playerControler = tileComponent.playerControler;
        var gameControler = playerControler.gameControler;
        var tile = tileComponent.model;
        if (playerControler.currentAction == null && node.id.indexOf("board_tileBg_") == 0 && !tile.isPlayed) {
          var letters = letterValues[playerControler.model.lang];
          gameControler.component.showBlankTileSelect(letters, this, node);

          // var s = prompt("Joker letter:");
          // if (s.length > 0) {
          //   tile.letter = s.substr(0, 1).toLowerCase();
          //   gameControler.play(false);
          //   tileComponent.draw();
          // }
        }
      }
    }, {
        key: "click",
        value: function click(ev) {
            var node = ev.target;
            if(node.id != 'undefined') {
                while (node.id.indexOf("_tileBg_") == -1) {
                    node = node.parentNode;
                }
                var tileComponent = node.firstChild.component;
                var playerControler = tileComponent.playerControler;
                var gameControler = playerControler.gameControler;
                var tile = tileComponent.model;
                if (gameControler.currentAction == "swapTiles") {
                    gameControler.swapTilesOnClick(tile);
                }
            }
        }
    },
    {
        key: "longPress",
        value: function click(ev) {
            var node = ev.target;
            if(node.id != 'undefined') {
                while (node.id.indexOf("_tileBg_") == -1) {
                    node = node.parentNode;
                }
                var tileComponent = node.firstChild.component;
                var playerControler = tileComponent.playerControler;
                var gameControler = playerControler.gameControler;
                var tile = tileComponent.model;
                if (gameControler.currentAction == "swapTiles") {
                    gameControler.swapTilesOnClick(tile);
                } else if (tile.isPlayed) {
                    gameControler.setTranslation(tile.horizontalWord, tile.horizontalLang, tile.verticalWord, tile.verticalLang);
                    //refactor
                    if(tile.verticalWord) {
                      console.log("vert");
                      var lang = tile.verticalLang;
                      var targetLang = tile.player == this.playerControler.gameControler.model.getNextPlayer() ? this.playerControler.gameControler.model.getPlayer().lang : this.playerControler.gameControler.model.getNextPlayer().lang;
                      this.playerControler.gameControler.component.showConfirmation({word: tile.verticalWord, type: "translation", lang: lang, targetLang: targetLang}, "displayTranslation", true);
                      // console.log(gameControler.model.getNextPlayer().lang);
                      //   this.playerControler.gameControler.component.getDefinition(tile.verticalWord, "translation", lang, targetLang);
                    } else {
                      var lang = tile.horizontalLang;
                      // console.log("HOR");
                      // console.log(tile.player);
                      // console.log(this.playerControler.model);
                      // console.log(this.playerControler.gameControler.model.getNextPlayer());
                      // console.log(tile.player == this.playerControler.gameControler.model.getNextPlayer());
                      var targetLang = tile.player == this.playerControler.gameControler.model.getNextPlayer() ? this.playerControler.gameControler.model.getPlayer().lang : this.playerControler.gameControler.model.getNextPlayer().lang;
                      this.playerControler.gameControler.component.showConfirmation({word: tile.horizontalWord, type: "translation", lang: lang, targetLang: targetLang}, "displayTranslation", true);
                      //   this.playerControler.gameControler.component.getDefinition(tile.horizontalWord, "translation", lang, targetLang);
                    }
                }
            }
        }
    }, {
        key: "toggleSwap",
        value: function toggleSwap() {
            this.isToSwap = !this.isToSwap;
            // if (this.isToSwap) {
            //     this.tileDiv.style.transform = "translateY(" + this.tileDiv.parentNode.tileSizeInPx / 3 + "px)";
            // } else {
            //     this.tileDiv.style.transform = "none";
            // }
        }
    }, {
        key: "setLetter",
        value: function setLetter(letter) {
            if (this.isJoker) {
                var letters = letterValues[this.player.lang];
                for (var l in letters) {
                    if (l == letter) {
                        this.letter = letter;
                        this.textElement.nodeValue = letter.toUpperCase();
                    }
                }
            }
        }
    }, {
        key: "draw",
        value: function draw(tileSizeInPx, tileDiv, target) {

            if (!tileSizeInPx) {
                tileSizeInPx = this.tileSizeInPx;
            } else {
                this.tileSizeInPx = tileSizeInPx;
            }
            var tilePosOffset = 0.1;
            var tileSizeOffset = 0.8;


            this.tileDiv.style.left = tileSizeInPx * tilePosOffset + "px";
            this.tileDiv.style.top = tileSizeInPx * tilePosOffset + "px";
            this.tileDiv.style.width = tileSizeInPx * tileSizeOffset + "px";
            this.tileDiv.style.height = tileSizeInPx * tileSizeOffset + "px";
            this.tileDiv.style.borderBottomWidth = tileSizeInPx * tilePosOffset + "px";


            var textSizeOffset = 0.6;
            this.tileTextContainer.style.fontSize = tileSizeInPx * textSizeOffset + 'px';
            this.textElement.nodeValue = this.model.letter.toUpperCase();

            var isRunningOnBrowser = window.__cordovaRunningOnBrowser__;
            if(!isRunningOnBrowser && /Android/i.test(navigator.userAgent)) {
                //workaround for android device
                if(target && target.classList.contains("boardTileBg")) {
                    this.tileDiv.style.marginTop = '1px';
                    var tileClass = "v" + this.model.value;
                    this.tileValueContainer.innerHTML = '<div class="tileValueImage ' + tileClass +'"></div>';
                }
                else {
                    if(this.tileValueContainer.children.length > 0) {
                        this.tileValueContainer.innerHTML = '';
                        this.tileValueContainer.appendChild(this.valueElement);
                    }

                    if(this.tileValueContainerP2.children.length > 0) {
                        this.tileValueContainerP2.innerHTML = '';
                        this.tileValueContainerP2.appendChild(this.valueElementP2);
                    }
                }
            }
            else {
                if(target && target.classList.contains("boardTileBg")) {
                    this.tileDiv.style.marginTop = '1px';
                }
            }

            if (this.model.value >= 10 && this.tileValueContainer.children.length == 0) {
                this.tileValueContainer.style.marginLeft = "68%";
            }
            else {
                this.tileValueContainer.style.marginLeft = "75%";
            }

            var valueSizeOffset = 0.19;
            this.tileValueContainer.style.fontSize = tileSizeInPx * valueSizeOffset + 'px';

            var tileScoreBubbleSizeOffset = 0.40;
            var tileScoreTextSizeOffset = 0.25;
            this.tileScoreDiv.style.width = tileSizeInPx * tileScoreBubbleSizeOffset + 'px';
            this.tileScoreDiv.style.height = tileSizeInPx * tileScoreBubbleSizeOffset + 'px';
            this.tileScoreDiv.style.fontSize = tileSizeInPx * tileScoreTextSizeOffset + 'px';
            this.tileScoreDiv.style.right = "-3px";
            this.tileScoreDiv.style.bottom = "-3px";
            var playerToPlay = this.playerControler.model.idx;
            var nextPlayer = playerToPlay == 0 ? 1 : 0;
            var sourceLang = this.playerControler.gameControler.playerControlers[playerToPlay].model.lang;
            var targetLang = this.playerControler.gameControler.playerControlers[nextPlayer].model.lang;
            this.valueElement.nodeValue = this.model.value;
            var gameType = this.model.game.gameMode;
            var altValue = 0;

            try {
              altValue = window.letterValues[targetLang][gameType][this.model.letter]["v"];
              altValue = "";
            } catch(e) {
              //Letter does not exist, use base letter if there are any.
              console.log(this.model.letter);
              try {
                var baseLetter = window.letterValues[sourceLang][gameType][this.model.letter]["b"];
                this.textElementSpecial.nodeValue = baseLetter.toUpperCase();
                this.tileTextContainerSpecial.style.fontSize = tileSizeInPx * textSizeOffset + 'px';
                this.tileTextContainer.style.color = "red";
                console.log(baseLetter);
                altValue = window.letterValues[targetLang][gameType][baseLetter]["v"];
              } catch(e) {
                altValue = 0;
              }
            }

            if(!isRunningOnBrowser && /Android/i.test(navigator.userAgent)) {

                if(altValue == this.model.value || altValue == "") {
                    altValue = "";
                } else {
                    var red = "v" + this.model.value + "r";
                    var black = "v" + altValue;
                    this.tileValueContainer.innerHTML = '<div class="tileValueImage ' + red +'"></div>';
                    this.tileValueContainerP2.innerHTML = '<div class="tileValueImage ' + black +'"></div>';
                }
            }
            else {
                if(altValue == this.model.value || altValue == "") {
                    altValue = "";
                } else {
                    this.tileValueContainerP2.style.color = "black";
                    this.tileValueContainer.style.color = "red";
                }
                this.valueElementP2.nodeValue = altValue;
                this.tileValueContainerP2.style.fontSize = tileSizeInPx * valueSizeOffset + 'px';
            }

            return this.tileDiv;
        }
    }]);

    return TileComponent;
}();
