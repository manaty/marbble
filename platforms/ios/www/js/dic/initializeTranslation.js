setTimeout(function(){
console.log("initialize translation");
var lang1 = window.localStorage.getItem("player1Language");
var lang2 = window.localStorage.getItem("player2Language");


if(!window.marbbleDic[lang1][lang2]){
  console.log("NO TRANSLATION FILE AVAILABLE!");
  getTranslationPack(lang1,lang2)
} else {
  var script = document.createElement('script'),
  scripts = document.getElementsByTagName('script')[0];
  script.src = "js/dic/full_"+lang1+"_"+lang2+".js";
  scripts.parentNode.insertBefore(script, scripts);

  var script = document.createElement('script'),
  scripts = document.getElementsByTagName('script')[0];
  script.src = "js/dic/full_"+lang2+"_"+lang1+".js";
  scripts.parentNode.insertBefore(script, scripts);

  var script = document.createElement('script'),
  scripts = document.getElementsByTagName('script')[0];
  script.src = "js/wordlist/full/"+lang1+"_wordlist.js";
  scripts.parentNode.insertBefore(script, scripts);

  var script = document.createElement('script'),
  scripts = document.getElementsByTagName('script')[0];
  script.src = "js/wordlist/full/"+lang2+"_wordlist.js";
  scripts.parentNode.insertBefore(script, scripts);
}

}, 1);

// var xhr = new XMLHttpRequest();
// xhr.open('GET', 'js/dic/full_en_fr.js');
// xhr.onload = function() {
//     if (xhr.status === 200) {
//         window.marbbleDic.en.fr = JSON.parse(xhr.responseText);
//     }
//     else {
//         alert('Request failed.  Returned status of ' + xhr.status);
//     }
// };
// xhr.send();
//
// var xhr = new XMLHttpRequest();
// xhr.open('GET', 'js/dic/full_fr_en.js');
// xhr.onload = function() {
//     if (xhr.status === 200) {
//         window.marbbleDic.fr.en = JSON.parse(xhr.responseText);
//     }
//     else {
//         alert('Request failed.  Returned status of ' + xhr.status);
//     }
// };
// xhr.send();

// var request = new Request(
//     'js/dic/full_fr_en.js',
//     {
//       'method': 'GET',
//       'Content-Type': 'application/json'
//     });
// fetch(request).then(function(response) {
//   return response.json();
// }).then(function(data) {
//   window.marbbleDic.fr.en = data;
// });
