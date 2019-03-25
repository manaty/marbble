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

var TYPE_CLASSIC = 0;
var TYPE_MARBBLE_CLASSIC = 1;
var TYPE_MARBBLE_SPECIAL = 2;

var Bag = (function() {
  function Bag() {
    _classCallCheck(this, Bag);

    this.type = TYPE_MARBBLE_CLASSIC;

    this.gameMode = "MarbbleClassic";
    this.language = "en";
    this.bag = new Array();
    this.bagSize = 0;
  }

  _createClass(Bag, [
    {
      key: "shuffleBag",
      value: function shuffleBag() {
          for (var i = this.bag.length; i; i--) {
              var j = Math.floor(Math.random() * i);
              var _ref = [this.bag[j], this.bag[i - 1]];
              this.bag[i - 1] = _ref[0];
              this.bag[j] = _ref[1];
          }
      }
    }    
  ]);

  return Bag;
})();
