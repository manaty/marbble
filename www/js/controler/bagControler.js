"use strict";

var _createClass = (function() {
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
})();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var BagControler = (function() {
    function BagControler(language, gameMode, gameId) {
        _classCallCheck(this, BagControler);

        if (typeof gameId == 'undefined') {
            gameId = null;
        }

        this.model = new Bag(gameMode);
        this.model.gameMode = gameMode;
        this.model.language = language;
        this.gameId = gameId;
    }

    _createClass(BagControler, [{
        key: "initBag",
        value: function initBag(index) {
            var playerIndex = index;

            if (this.model.gameMode == "Classic" || typeof playerIndex == 'undefined') {
                playerIndex = "";
            } else {
                playerIndex += "_";
            }
            var tileId = 0;
            this.model.bag = new Array();
            this.model.bagSize = 0;
            var letters = letterValues[this.model.language][this.model.gameMode];

            var game = getActiveGame(this.gameId);

            if (game) {
                var savedBag = null;

                if(game.gameMode == "MarbbleClassic") {
                    savedBag = game.players[index].bag;
                }
                else {
                    savedBag = game.players[0].bag;                                        
                }

                for (var i = 0; i < savedBag.length; i++) {
                    var tileId = savedBag[i].id;
                    var v = savedBag[i].value;
                    var n = savedBag[i].number;
                    var property = savedBag[i].letter;

                    var tile = new Tile(tileId, null, property, v, n);
                    this.model.bag.push(tile);
                    this.model.bagSize++;
                }

            } else {
                for (var property in letters) {
                    if (letters.hasOwnProperty(property)) {
                        for (var i = 0; i < letters[property].n; i++) {
                            //v = value, n = number
                            var v = letters[property].v;
                            var n = letters[property].n;
                            var finalTileId = playerIndex + "" + tileId;
                            var valid = true;
                            if (game != null) {
                                var savedBoard = game.board;
                                for (var ix = 0; ix < savedBoard.length; ix++) {
                                    if (savedBoard[ix] != null && savedBoard[ix].id == finalTileId) {
                                        valid = false;
                                    }
                                }
                            }

                            if (valid) {
                                var tile = new Tile(finalTileId, null, property, v, n);
                                this.model.bag.push(tile);
                                this.model.bagSize++;
                            }
                            tileId++;
                        }
                    }
                }
            }

            this.model.shuffleBag();
        }
    }, {
        key: "getBag",
        value: function getBag() {
            return this.model.bag;
        }
    }, {
        key: "getBagSize",
        value: function getBagSize() {
            return this.model.bagSize;
        }
    }]);

    return BagControler;
})();
