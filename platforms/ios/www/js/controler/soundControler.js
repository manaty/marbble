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

var SoundControler = (function() {
    function SoundControler() {
        _classCallCheck(this, SoundControler);

        this.model = new Sound();
    }

    _createClass(SoundControler, [{
        key: "plungerPopTileOff",
        value: function plungerPopTileOff() {
            this.playSound(this.model.plungerPopTileOff);
        }
    }, {
        key: "bubblePopTileOn",
        value: function bubblePopTileOn() {
            this.playSound(this.model.bubblePopTileOn);
        }
    }, {
        key: "tilesDistribution",
        value: function tilesDistribution() {
            this.playSound(this.model.tilesDistribution);
        }
    }, {
        key: "bubblePopTilesRecall",
        value: function bubblePopTilesRecall() {
            this.playSound(this.model.bubblePopTilesRecall);
        }
    }, {
        key: "shuffleTiles",
        value: function shuffleTiles() {
            this.playSound(this.model.shuffleTiles);
        }
    }, {
        key: "playingWord",
        value: function playingWord() {
            this.playSound(this.model.playingWord);
        }
    }, {
        key: "openPopupInGame",
        value: function openPopupInGame() {
            this.playSound(this.model.openPopupInGame);
        }
    }, {
        key: "gameLost",
        value: function gameLost() {
            this.playSound(this.model.gameLost);
        }
    }, {
        key: "gameWon",
        value: function gameWon() {
            this.playSound(this.model.gameWon);
        }
    }, {
        key: "challengeNotification",
        value: function challengeNotification() {
            this.playSound(this.model.challengeNotification);
        }
    }, {
        key: "newMessageChatBox",
        value: function newMessageChatBox() {
            this.playSound(this.model.newMessageChatBox);
        }
    }, {
        key: "gameDraw",
        value: function gameDraw() {
            this.playSound(this.model.gameDraw);
        }
    },
    {
        key: "playSound",
        value: function playSound(sound) {
            var isSoundEnabled = this.isSoundEnabled();
            if(sound && (isSoundEnabled == true || isSoundEnabled == "true")) {
                sound.play();
            }
        }
    }, {
        key: "isSoundEnabled",
        value: function isSoundEnabled() {

            var localStorage = null;
            var isSoundEnabled = true;

            try {
            	localStorage = window.localStorage;
            	var testKey = 'isLocalStorageSupported';
            	localStorage.setItem(testKey, '1');
            	localStorage.removeItem(testKey);
            }
            catch (error)
            {
            	console.log(error);
            	console.log("Local storage may not be supported");
            }

            if(localStorage) {
                var soundButtonValueKey = 'soundButtonKey';
                isSoundEnabled = localStorage.getItem(soundButtonValueKey);
            }

            return isSoundEnabled;

        }
    }
]);

    return SoundControler;
})();
