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

var Player = function() {
    function Player(game, idx, username, lang, isComputer) {
        _classCallCheck(this, Player);

        this.game = game;
        this.idx = idx;
        this.username = username;
        this.lang = lang;
        this.score = 0;
        this.bag = new Array();
        this.bagSize = 0;
        this.previousRack = new Array(7);
        this.rack = new Array(7);
        this.swapRack = new Array(7);
        this.passed = false;
        this.lastWord = "";
        this.isComputer = isComputer; //true if player is ai
        this.tilesOnBoard = new Array();
    }

    _createClass(Player, [{
        key: "shuffleBag",
        value: function shuffleBag() {
            for (var i = this.bag.length; i; i--) {
                var j = Math.floor(Math.random() * i);
                var _ref = [this.bag[j], this.bag[i - 1]];
                this.bag[i - 1] = _ref[0];
                this.bag[j] = _ref[1];
            }
        }
    }, {
        key: "shuffleRackTiles",
        value: function shuffleRackTiles() {
            var origin = this.getRandomInt(0, 6);
            var destination = this.getRandomInt(origin + 1, 7);
            var tileOrigin = this.rack[origin];
            var tileDestination = this.rack[destination];
            if (tileOrigin && tileDestination) {
                tileOrigin.rackIdx = destination;
                tileDestination.rackIdx = origin;
                this.rack[origin] = tileDestination;
                this.rack[destination] = tileOrigin;

                //this ensures that the parent div has the correct tileId
                this.rack[origin].component.tileDiv.parentNode.tileId = tileOrigin.id;
                this.rack[destination].component.tileDiv.parentNode.tileId = tileDestination.id;
            }
        }
    }, {
        key: "getRandomInt",
        value: function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }
    }, {
        key: "getLastWord",
        value: function getLastWord() {
            return this.lastWord;
        }
    }, {
        key: "setLastWord",
        value: function setLastWord(word) {
            this.lastWord = word;
        }
    }]);

    return Player;
}();
