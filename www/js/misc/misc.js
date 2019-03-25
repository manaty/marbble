var LANG = { "en": "English", "fr": "French", "es": "Spanish", "tl": "Tagalog"};

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    console.log("TRANSPACK");
    console.log(JSON.stringify(cordova.file));
}

function hasClass(el, className) {
  if (el.classList)
    return el.classList.contains(className)
  else
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

function addClass(el, className) {
  if (el.classList)
    el.classList.add(className)
  else if (!hasClass(el, className)) el.className += " " + className
}

function removeClass(el, className) {
  if (el.classList)
    el.classList.remove(className)
  else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    el.className=el.className.replace(reg, ' ')
  }
}

function downloadTranslationPack(lang,lang2) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      try {
          var dataPack = this.response;
          var path = 	cordova.file.cacheDirectory;
          if (this.readyState == 4 && this.status == 200) {
            // iOS
            var filename = "full_"+lang+"_"+lang2+".js";
            var resp = this.response;
            console.log(path);
            window.resolveLocalFileSystemURL(path, function(dir) {
              console.log("resolveLocalFileSystemURL");
              dir.getFile(filename, {create:true}, function(fileEntry) {
                console.log("getFile");
                // Create a FileWriter object for our FileEntry (log.txt).
                fileEntry.createWriter(function (fileWriter) {
                  var dataObj = new Blob([JSON.stringify(resp)], { type: 'text/plain' });
                    fileWriter.onwriteend = function() {
                        console.log("Successful file write...");
                        //mainInterface.showErrorMessage("Game file exported as " + filename);
                        getTranslationPack(lang,lang2);
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
            }, function(e) {console.log(JSON.stringify(e))});
          }
      } catch (e) {
          console.log(e);
      }
  };
  xhttp.open("GET", "https://dev.marbble.net/js/dic/full_"+lang+"_"+lang2+".js", true);
  xhttp.send();
}

function getTranslationPack(lang,lang2) {
  try {
      var dataPack = this.response;
      var path = 	cordova.file.cacheDirectory;
        // iOS
        var filename = "full_"+lang+"_"+lang2+".js";
        console.log(path + filename);
        window.resolveLocalFileSystemURL(path + "/" + filename, function(dir) {
          console.log(path + filename);
          console.log(JSON.stringify(dir));
          // dir.getFile(filename, {create:false}, function(fileEntry) {
            dir.file(function (fileEntry) {
                var reader = new FileReader();
                // console.log(JSON.stringify(fileEntry));
                reader.onloadend = function() {
                    // console.log(JSON.stringify(this));
                    console.log("Successful file read: ");
                    var result = JSON.parse(this.result);
                    result += "console.log('language loaded!')";
                    eval(result);
                    // console.log(window.marbbleDic.tl.es)
                    // console.log(result);
                    // console.log(fileEntry.fullPath);
                    // displayFileData(fileEntry.fullPath + ": " + this.result);
                };

                reader.readAsText(fileEntry);

            // }, function(e) { console.log(e);});
          }, function(e) { console.log(e);});
        }, function(e) {console.log(JSON.stringify(e))});
  } catch (e) {
      console.log(e);
  }
}


function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    return states[networkState];
}
