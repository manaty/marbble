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

var Tile = function() {
    function Tile(id, player, letter, value, number) {
        _classCallCheck(this, Tile);

        this.id = id;
        this.letter = letter;
        this.value = value;
        this.number = number;
        this.isJoker = letter == "";
        this.previousRackIdx = null;
        this.rackIdx = null;
        this.game = player ? player.game : null;
        this.boardX = null;
        this.boardY = null;
        this.player = player;
        this.isPlayed = false;
        this.horizontalWord = null;
        this.horizontalLang = null;
        this.verticalWord = null;
        this.horizontalLang = null;
        this.swapRackIdx = null;
        this.isUnknownWord = false;
    }

    _createClass(Tile, [{
        key: "setRackIdx",
        value: function setRackIdx(rackIdx) {

            if (rackIdx != null) {
                //console.log('A.) Placed tile on player rack - Letter: ' + this.letter.toUpperCase() + ' rackIdx: ' + rackIdx + ' this.rackIdx: ' + this.rackIdx);
                if (this.boardX != null) {
                    //console.log('B.) Removed tile from game board - ' + this.letter.toUpperCase()  + ' rackIdx: ' + rackIdx + ' this.rackIdx: ' + this.rackIdx);
                    this.game.board[(15 - this.boardY) * 15 + this.boardX] = null;
                    if(this.player.tilesOnBoard.length > 0) {
                        var id = this.id;
                        var index=this.player.tilesOnBoard.map(function(x){ return x.id; }).indexOf(id);
                        this.player.tilesOnBoard.splice(index, 1);
                    }
                }
                this.boardX = null;
                this.boardY = null;
                if (this.isJoker) {
                    this.letter = "";
                }
            }
            if (rackIdx != this.rackIdx) {
                if (rackIdx == null) {
                    if(this.swapRackIdx != null) {
                        //console.log('C.) Tile is placed on the swap rack - ' + this.letter.toUpperCase()  + ' rackIdx: ' + rackIdx + ' this.rackIdx: ' + this.rackIdx);
                        //the tile is placed on the swap rack
                        this.player.previousRack[this.rackIdx] = null;
                        this.previousRackIdx = null;
                    }
                    else {
                        //console.log('D.) Place tile on game board - ' + this.letter.toUpperCase()  + ' rackIdx: ' + rackIdx + ' this.rackIdx: ' + this.rackIdx);
                        //the tile is placed on the game board
                        this.player.previousRack[this.rackIdx] = this;
                        this.previousRackIdx = this.rackIdx;
                        this.player.tilesOnBoard.push(this);
                    }

                } else {
                    if (this.rackIdx != null) {
                        if (this.player.previousRack[rackIdx]) {
                            //moving the tile in player rack to an empty position
                            //console.log('E.) Move tile to empty position in player rack - ' + this.letter.toUpperCase()  + ' new position: ' + rackIdx + ' old position: ' + this.rackIdx);
                            this.player.previousRack[rackIdx].previousRackIdx = this.rackIdx;
                        }
                        if (this.player.previousRack[this.rackIdx]) {
                            //console.log('F - ' + this.letter.toUpperCase() + ' rackIdx: ' + rackIdx + ' this.rackIdx: ' + this.rackIdx);
                            this.player.previousRack[this.rackIdx].previousRackIdx = rackIdx;
                            var _ref = [this.player.previousRack[this.rackIdx], this.player.previousRack[rackIdx]];
                            this.player.previousRack[rackIdx] = _ref[0];
                            this.player.previousRack[this.rackIdx] = _ref[1];
                        } else {
                            //console.log('G.) Exchanged player rack position - ' + this.letter.toUpperCase()  + ' new position: ' + rackIdx + ' old position: ' + this.rackIdx);
                            this.player.previousRack[this.rackIdx] = this.player.previousRack[rackIdx];
                            this.player.previousRack[rackIdx] = null;
                            this.previousRackIdx = null;
                        }
                    } else if (this.player) {
                        if (this.previousRackIdx && this.previousRackIdx != rackIdx) {
                            //console.log('H.) Tile came from board but with different rackIdx: ' + this.letter.toUpperCase()  + ' new position: ' + rackIdx + ' old position: ' + this.rackIdx + ' prevRackIdx: ' + this.previousRackIdx);
                            if(this.player.previousRack[rackIdx]) {
                                this.player.previousRack[rackIdx].previousRackIdx = this.previousRackIdx;
                            }

                            this.player.previousRack[this.previousRackIdx] = this.player.previousRack[rackIdx];
                        }
                        this.player.previousRack[rackIdx] = null;
                        this.previousRackIdx = null;

                        this.player.swapRack[rackIdx] = null;
                        this.swapRackIdx = null;

                    }
                }
                this.rackIdx = rackIdx;
            }

        }
    }, {
        key: "setBoardPosition",
        value: function setBoardPosition(x, y) {

            if (this.boardX != null) {
                this.game.board[(15 - this.boardY) * 15 + this.boardX] = null;
            }
            this.boardX = x;
            this.boardY = y;
            if (this.rackIdx != null) {
                this.player.rack[this.rackIdx] = null;
                this.setRackIdx(null);
            }

            this.game.board[(15 - y) * 15 + x] = this;
        }
    }, {
        key: "setSwapRackIdx",
        value: function setSwapRackIdx(swapRackIdx) {
             if (this.rackIdx != null) {
                 this.player.rack[this.rackIdx] = null;
                 this.player.swapRack[swapRackIdx] = this;
                 this.swapRackIdx = swapRackIdx;
                 this.setRackIdx(null);
             }
             else if(this.swapRackIdx != null){
                 //set the previous location to null
                 this.player.swapRack[this.swapRackIdx] = null;
                 //set the new location
                 this.player.swapRack[swapRackIdx] = this;
                 this.swapRackIdx = swapRackIdx;
                 this.setRackIdx(null);

             }
             else {
                 //set the previous location to null
                 this.player.swapRack[this.swapRackIdx] = null;
                 //set the new location
                 this.player.swapRack[swapRackIdx] = this;
                 this.swapRackIdx = swapRackIdx;
                 this.setRackIdx(null);

             }
        }
    }, {
        key: "setPlayer",
        value: function setPlayer(player) {
            this.game = player.game;
            this.player = player;
        }
    }]);

    return Tile;
}();
