"use strict";

var _typeof =
  typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
    ? function(obj) {
        return typeof obj;
      }
    : function(obj) {
        return obj &&
        typeof Symbol === "function" &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
          ? "symbol"
          : typeof obj;
      };

var importInput = document.getElementById("importInput");

var importFile = function(event) {

    var appLanguage = window.applanguage[_languageSet];
    if(event.target.files && event.target.files[0]) {

        var extension = event.target.files[0].name.split('.').pop().toLowerCase();
        if(extension == "json") {
            var fileLoc = URL.createObjectURL(event.target.files[0]);

            try {

              var read = new FileReader();

              read.readAsBinaryString(event.target.files[0]);

              read.onloadend = function(){
                  try {
                      var game = JSON.retrocycle(JSON.parse(read.result));
                      window.localStorage.setItem("tempGame", read.result);
                      mainInterface.showImportGameScreen(game);
                  }
                  catch(e) {
                      mainInterface.showErrorMessage(appLanguage.incorrectFile);
                      window.localStorage.removeItem("tempGame");
                      console.error(e);
                  }

                  importInput.value = "";
              }
            } catch(e) {
              console.error(e);
              mainInterface.showErrorMessage("Oops! Something wrong happened, please try again");
            }
        }
        else {
            mainInterface.showErrorMessage(appLanguage.incorrectFile);
        }

    }
    else {
        mainInterface.showErrorMessage("Oops! Something wrong happened, please try again");
    }

};


importInput.addEventListener("change", importFile);

var saveState = function saveState(data) {
  var storage = window.localStorage;


  var state = data;
  data.g_matches_cache = {};
  console.log( " -- Saving game -- : " + data.gameId);

  var gameList = getGamesList() ? getGamesList() : [];
  if(gameList && gameList.length > 0) {

      if(gameList.indexOf(data.gameId) == -1) {
          //Game id does not match. Save new game
          gameList.push(data.gameId);
          saveGameList(gameList);
      }
  }
  else {
      //Game list is empty. Saving new game data
      gameList.push(data.gameId);
      saveGameList(gameList);
  }

  saveGame(data);

};

var exportGameState = function(data) {
  var path = "file:///storage/emulated/0";
  // if(device.platform == "iPad" || device.platform == "iPhone") {
  //   path = "Documents/"
  // }
  var filename = "Marbble-" + data.players[0].username + "-vs-" + data.players[1].username + "-" +data.gameId+ ".json";
  console.log("write", filename);
  try {
    // iOS
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
    fs.root.getFile("player_data.txt", { create: true }, function (fileEntry) {
      // Create a FileWriter object for our FileEntry (log.txt).
      fileEntry.createWriter(function (fileWriter) {
        var dataObj = new Blob([JSON.stringify(JSON.decycle(data))], { type: 'text/plain' });
          fileWriter.onwriteend = function() {
              console.log("Successful file write...");
              mainInterface.showMessage("Game file exported as " + filename);
              readFile(fileEntry);
          };

          fileWriter.onerror = function (e) {
              console.log("Failed file write: " + e.toString());
              mainInterface.showErrorMessage("Oops! Something wrong happened, please try again");
          };

          // If data object is not passed in,
          // create a new Blob instead.
          if (!dataObj) {
              dataObj = new Blob(['some file data'], { type: 'text/plain' });
          }
          nativeURL: "file:///Users/janmanaloto/Library/Developer/CoreSimulator/Devices/82CF8BBC-F046-43D7-93BA-6343D9E50660/data/Containers/Data/Application/D5EF…"

          fileWriter.write(dataObj);
      });
    });
}, function(fs) {console.log(fs);});
    // iOS
    window.resolveLocalFileSystemURL(path, function(dir) {
      console.log("resolveLocalFileSystemURL");
      dir.getFile(filename, {create:true}, function(fileEntry) {
        console.log("getFile");

        // Create a FileWriter object for our FileEntry (log.txt).
        fileEntry.createWriter(function (fileWriter) {
          var dataObj = new Blob([JSON.stringify(JSON.decycle(data))], { type: 'text/plain' });
            fileWriter.onwriteend = function() {
                console.log("Successful file write...");
                //mainInterface.showErrorMessage("Game file exported as " + filename);
                readFile(fileEntry);
            };

            fileWriter.onerror = function (e) {
                console.log("Failed file write: " + e.toString());
                mainInterface.showErrorMessage("Oops! Something wrong happened, please try again");
            };

            // If data object is not passed in,
            // create a new Blob instead.
            if (!dataObj) {
                dataObj = new Blob(['some file data'], { type: 'text/plain' });
            }

            fileWriter.write(dataObj);
        });
      });
    });
  } catch(e) {
    console.log("ERROR",e);
    console.log("TRY DOWNLOAD");
    // Start file download.
    download(filename,JSON.stringify(JSON.decycle(data)));
    mainInterface.showMessage("Game file exported as " + filename);
  }
};

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

var decircularise = function decircularise(v) {
  var cache = new Map();
  return JSON.stringify(v, function(key, value) {
    if (
      (typeof value === "undefined" ? "undefined" : _typeof(value)) ===
        "object" &&
      value !== null
    ) {
      if (cache.get(value)) {
        // Circular reference found, discard key
        return;
      }
    }
    return value;
  });
};

/*
    cycle.js
    2018-05-15
    Public Domain.
    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html
    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
*/

// The file uses the WeakMap feature of ES6.

/*jslint eval */

/*property
    $ref, decycle, forEach, get, indexOf, isArray, keys, length, push,
    retrocycle, set, stringify, test
*/

if (typeof JSON.decycle !== "function") {
  JSON.decycle = function decycle(object, replacer) {
    "use strict";

    // Make a deep copy of an object or array, assuring that there is at most
    // one instance of each object or array in the resulting structure. The
    // duplicate references (which might be forming cycles) are replaced with
    // an object of the form

    //      {"$ref": PATH}

    // where the PATH is a JSONPath string that locates the first occurance.

    // So,

    //      var a = [];
    //      a[0] = a;
    //      return JSON.stringify(JSON.decycle(a));

    // produces the string '[{"$ref":"$"}]'.

    // If a replacer function is provided, then it will be called for each value.
    // A replacer function receives a value and returns a replacement value.

    // JSONPath is used to locate the unique object. $ indicates the top level of
    // the object or array. [NUMBER] or [STRING] indicates a child element or
    // property.

    var objects = new WeakMap(); // object to path mappings

    return (function derez(value, path) {
      // The derez function recurses through the object, producing the deep copy.

      var old_path; // The path of an earlier occurance of value
      var nu; // The new object or array

      // If a replacer function was provided, then call it to get a replacement value.

      if (replacer !== undefined) {
        value = replacer(value);
      }

      // typeof null === "object", so go on if this value is really an object but not
      // one of the weird builtin objects.

      if (
        (typeof value === "undefined" ? "undefined" : _typeof(value)) ===
          "object" &&
        value !== null &&
        !(value instanceof Boolean) &&
        !(value instanceof Date) &&
        !(value instanceof Number) &&
        !(value instanceof RegExp) &&
        !(value instanceof String)
      ) {
        // If the value is an object or array, look to see if we have already
        // encountered it. If so, return a {"$ref":PATH} object. This uses an
        // ES6 WeakMap.

        old_path = objects.get(value);
        if (old_path !== undefined) {
          return { $ref: old_path };
        }

        // Otherwise, accumulate the unique value and its path.

        objects.set(value, path);

        // If it is an array, replicate the array.

        if (Array.isArray(value)) {
          nu = [];
          try {
              value.forEach(function(element, i) {
                nu[i] = derez(element, path + "[" + i + "]");
              });
          } catch(e) {
              console.error(e);
          }

        } else {
          // If it is an object, replicate the object.

          nu = {};
          try {
              Object.keys(value).forEach(function(name) {
                nu[name] = derez(
                  value[name],
                  path + "[" + JSON.stringify(name) + "]"
                );
              });
          } catch(e) {
              console.error(e);
          }

        }
        return nu;
      }
      return value;
    })(object, "$");
  };
}

if (typeof JSON.retrocycle !== "function") {
  JSON.retrocycle = function retrocycle($) {
    "use strict";

    // Restore an object that was reduced by decycle. Members whose values are
    // objects of the form
    //      {$ref: PATH}
    // are replaced with references to the value found by the PATH. This will
    // restore cycles. The object will be mutated.

    // The eval function is used to locate the values described by a PATH. The
    // root object is kept in a $ variable. A regular expression is used to
    // assure that the PATH is extremely well formed. The regexp contains nested
    // * quantifiers. That has been known to have extremely bad performance
    // problems on some browsers for very long strings. A PATH is expected to be
    // reasonably short. A PATH is allowed to belong to a very restricted subset of
    // Goessner's JSONPath.

    // So,
    //      var s = '[{"$ref":"$"}]';
    //      return JSON.retrocycle(JSON.parse(s));
    // produces an array containing a single element which is the array itself.

    var px = /^\$(?:\[(?:\d+|"(?:[^\\"\u0000-\u001f]|\\(?:[\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*")\])*$/;

    (function rez(value) {
      // The rez function walks recursively through the object looking for $ref
      // properties. When it finds one that has a value that is a path, then it
      // replaces the $ref object with a reference to the value that is found by
      // the path.

      if (
        value &&
        (typeof value === "undefined" ? "undefined" : _typeof(value)) ===
          "object"
      ) {
        if (Array.isArray(value)) {
          value.forEach(function(element, i) {
            if (
              (typeof element === "undefined"
                ? "undefined"
                : _typeof(element)) === "object" &&
              element !== null
            ) {
              var path = element.$ref;
              if (typeof path === "string" && px.test(path)) {
                value[i] = eval(path);
              } else {
                rez(element);
              }
            }
          });
        } else {
          Object.keys(value).forEach(function(name) {
            var item = value[name];
            if (
              (typeof item === "undefined" ? "undefined" : _typeof(item)) ===
                "object" &&
              item !== null
            ) {
              var path = item.$ref;
              if (typeof path === "string" && px.test(path)) {
                value[name] = eval(path);
              } else {
                rez(item);
              }
            }
          });
        }
      }
    })($);
    return $;
  };
}
