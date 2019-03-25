var baseURL = '.wiktionary.org';
var LANG = {
    "en": "English",
    "fr": "Français",
    "es": "Spanish",
    "tl": "Filipino"
}

var appLanguage = window.applanguage[_languageSet];

if (!navigator.onLine) {
    // //console.log("OFFLINE");
    document.getElementsByClassName("wordsDefinitionFlags")[0].style.display = "none";
    document.getElementById("definitionsSection").innerHTML = "<div style='text-align:center' id='offlineDefNotice'>" + appLanguage.noInternet  + "</div>";
}
window.addEventListener('offline', function() {
    // //console.log("OFFLINE");
    document.getElementsByClassName("wordsDefinitionFlags")[0].style.display = "none";
    document.getElementById("definitionsSection").innerHTML = "<div style='text-align:center' id='offlineDefNotice'>" + appLanguage.noInternet + "</div>";
});

window.addEventListener('online', function() {
    if(document.getElementById("offlineDefNotice")){
        document.getElementById("offlineDefNotice").remove();
        document.getElementsByClassName("wordsDefinitionFlags")[0].style.display = "table-row";
    }

});

var fetchWiktionary = function(word, lang, style, type, isDictionary) {
    var appLanguage = window.applanguage[_languageSet];
    if(typeof isDictionary == 'undefined') {
        isDictionary = true;
    }

    document.getElementById("noInternetSection").style.display = "none";


    if(isOnline() == false) {
        document.getElementById("definitionsSection").style.display = "none";
        document.getElementById("noInternetSection").style.display = "block";
        document.getElementById("notInDictionary").style.display = "none";
        return;
    }

    document.getElementById("definitionsSection").innerHTML = "";
    document.getElementById("definitionsSection").style.display = "block";
    try {
        document.getElementById("definitionsSection").innerHTML = "";
        if (!navigator.onLine) {
            // //console.log("OFFLINE");
            document.getElementsByClassName("wordsDefinitionFlags")[0].style.display = "none";
            document.getElementById("definitionsSection").innerHTML = "<div style='text-align:center' id='offlineDefNotice'>" + appLanguage.noInternet +"</div>";
        }

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            try {
                if (this.readyState == 4 && this.status == 200) {
                    // document.getElementById("demo").innerHTML = this.responseText;
                    // var resp = JSON.parse(this.responseText);
                    // var header = type == 1 ? "" : "<h2 class='"+style+"' style='text-align:center;'>"+word.toUpperCase()+"</h2>";
                    // document.getElementById("definitionsSection").innerHTML = header +resp.parse.text["*"];
                    // filterWiktionaryEntry("edit",lang);

                    getDictionaryInfo(word, lang, function(data) {
                        displayDictionaryInfo(data, word, lang, style, type, isDictionary);
                    });
                }
            } catch (e) {
                // //console.log(e);
                if(!isDictionary) {
                    var header = type == 1 ? "" : "<h2 class='" + style + "' style='text-align:center;'> "  + appLanguage.noDefinition + "</h2>";
                    document.getElementById("definitionsSection").innerHTML = header;
                }
                else {
                    var header = type == 1 ? "" : "<h2 class='" + style + "' style='text-align:center;'>" + appLanguage.noDefinition + "</h2>";
                    document.getElementById("definitionsSection").innerHTML = header;
                }

            }
        };
        xhttp.open("GET", 'https://' + lang + baseURL + '/w/api.php?origin=*&format=json&page=' + word, true);
        xhttp.send();
    } catch (e) {
        // //console.log(e);
    }
};

var displayDictionaryInfo = function(data, word, lang, style, type, isDictionary) {

    var appLanguage = window.applanguage[_languageSet];
    try {
        //document.getElementById("definitionsSection").innerHTML = "<h2 id='wikHeader' class='" + style + "' style='text-align:center;'>" + word.toUpperCase() + "</h2>";
        var definitionHeaderContent = isDictionary ? "<h2 id='wikHeader' class='" + style + "' style='text-align:center;'>" + word.toUpperCase() + "</h2>" : "<div style='margin-top: 15px;'><div style='width: 45%; float: left;'><div id='wikHeader' class='" + style + "' style='text-align:right; color: #000000; font-size: 1.5em; font-weight: bold; padding-top: 5px; padding-right: 5%;'>" + word.toUpperCase() + "</div></div><div style='width:50%; float: left;'> <img src='img/flags/" + lang +".png' width='30px' height='30px'/></div> <div class='clearFloat'></div></div>";
        //document.getElementById("definitionsSection").innerHTML = "<div style='width: 50%; float: left;'><h2 id='wikHeader' class='" + style + "' style='text-align:center; color: #000000;'>" + word.toUpperCase() + "</h2></div><div style='width:50%; float: left;'> <img src='img/flags/en.png' width='30px' height='30px'/></div> <div class='clearFloat'></div>";
        document.getElementById("definitionsSection").innerHTML = definitionHeaderContent;
        data.headers.forEach(function(header) {
            document.getElementById("definitionsSection").innerHTML += "<h4>" + header + "</h4>"
            data.definitions[header].forEach(function(meaning) {
                document.getElementById("definitionsSection").innerHTML += "<li style='margin-left:5px'>" + meaning.meaning + "</li>";
            })
        });
        var noDefLang = "en";
        if(lang == "fr") {
            noDefLang = lang;
        }

        var definitionSection = document.getElementById("definitionsSection");
        definitionsSection.innerHTML += "<h5><a target='_blank' href='https://" + lang + baseURL + "/wiki/" + word + "'>" + window.applanguage[noDefLang].retrievedFrom + " wiktionary.org. <span class='underline'>" + window.applanguage[noDefLang].seeMore + "</span></a></h5>";
        definitionsSection.style.display = "block";

        if(!isDictionary) {
            var notInWikiText = document.getElementById('notInWikiText');
            notInWikiText.innerHTML = appLanguage.wordAndTransFoundInWiktionary
        }

    } catch (e) {
        if(!isDictionary) {
            var header = type == 1 ? "" : "<h2 class='" + style + "' style='text-align:center;'> " + appLanguage.noDefinition + " </h2>";
            document.getElementById("definitionsSection").innerHTML = header;
            document.getElementById("definitionsSection").style.display = "none";
            var notInWikiText = document.getElementById('notInWikiText');
            if(notInWikiText) {
                notInWikiText.innerHTML = appLanguage.wordWasNotFoundInDicAndWik;
            }
        }
        else {
            var header = type == 1 ? "" : "<h2 class='" + style + "' style='text-align:center;'>" + appLanguage.noDefinition + "</h2>";
            document.getElementById("definitionsSection").innerHTML = header;
            document.getElementById("definitionsSection").style.display = "block";
        }

    }
}


var checkWiktionary = function(word, lang, style, type, source) {
    var appLanguage = window.applanguage[_languageSet];
    document.getElementById("definitionsSection").innerHTML = "";
    var saveSourceInnerHtml = source.innerHTML;
    source.innerHTML = "<img src='img/loading.gif' height='100%'/> Loading...";
    source.style.textAlign = "center !important";


    try {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                try {
                    // document.getElementById("demo").innerHTML = this.responseText;
                    var resp = JSON.parse(this.responseText);
                    source.innerHTML = saveSourceInnerHtml;
                    source.style.textAlign = "left !important";
                    var header = type == 1 ? "" : "<h2 class='" + style + "' style='text-align:center;'>" + word.toUpperCase() + "</h2>";
                    var test = header + resp.parse.text["*"];
                    source.innerHTML += appLanguage.seeDefinition;
                } catch (e) {
                    // //console.log(e);
                    source.innerHTML = saveSourceInnerHtml;
                    source.style.textAlign = "left !important";
                    var header = type == 1 ? "" : "<h2 class='" + style + "' style='text-align:center;'>" + appLanguage.noDefinition + "</h2>";
                    source.innerHTML += appLanguage.seeDefinition;
                }
            }
        };

        xhttp.open("GET", 'https://' + lang + baseURL + '/w/api.php?action=parse&origin=*&format=json&page=' + word, true);
        xhttp.send();
    } catch (e) {
        //DISPLAY ERROR
        // //console.log(e);

        source.innerHTML = saveSourceInnerHtml;
        source.innerHTML += appLanguage.seeDefinition;
        return false;
    }
};


var parseWikitext = function(lang, text, callback) {
    // //console.log("PROCESS TEXT:", text);
    var xhttp = new XMLHttpRequest();
    if (text.indexOf("* {{rhymes|") != 0 && text.indexOf("* {{homophones|") != 0) {
        // //console.log("PARSE WIKITEXT:", text);
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                callback(this);
            }
        };
    } else {
        // //console.log("DO NOT PARSE WIKITEXT:", text);
        callback(null);
    }
    // https://en.wikipedia.org/w/api.php?action=parse&text=&contentmodel=wikitext
    // //console.log(text);
    xhttp.open("GET", "https://" + lang + ".wikipedia.org/w/api.php?action=parse&origin=*&format=json&contentmodel=wikitext&text=" + encodeURI(text), true);
    xhttp.send();
}

var filterWiktionaryEntry = function(type, lang) {
    if (type == "edit") {
        var paras = document.getElementsByClassName('mw-editsection');
        while (paras[0]) {
            paras[0].parentNode.removeChild(paras[0]);
        }
        var paras = document.getElementsByClassName('toctitle');
        while (paras[0]) {
            paras[0].parentNode.removeChild(paras[0]);
        }
        var paras = document.getElementsByClassName('toc');
        while (paras[0]) {
            paras[0].parentNode.removeChild(paras[0]);
        }
        var paras = document.getElementsByClassName('disambig-see-also-2');
        while (paras[0]) {
            paras[0].parentNode.removeChild(paras[0]);
        }
        var paras = document.getElementsByClassName('disambig-see-also');
        while (paras[0]) {
            paras[0].parentNode.removeChild(paras[0]);
        }
        var paras = document.getElementsByClassName('mw-headline');
        for (var i = 0; i < paras.length; i++) {
            if (paras[i].id == LANG[lang]) {
                paras[i].parentNode.removeChild(paras[i]);
            }
        }

        var paras = document.getElementById("definitionsSection").getElementsByTagName('a');
        for (var i = 0; i < paras.length; i++) {
            paras[i].href = "#";
        }

        var paras = document.getElementById("definitionsSection").getElementsByTagName('source');
        for (var i = 0; i < paras.length; i++) {
            var file = paras[i].src;
            file = file.replace("file://", "http://");
            paras[i].src = file;
            if (file.startsWith("//upload.wikimedia.org")) {
                paras[i].src = "http:" + file;
            }
        }
    }
};


var getDictionaryInfo = function(word, wordLanguage, callback) {

    var xhttp = new XMLHttpRequest();
    var lang = wordLanguage;
    wordLanguage = LANG[wordLanguage];

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // $.getJSON("https://en.wiktionary.org/w/api.php?format=json&action=query&titles={word}&rvprop=content&prop=revisions&redirects=1&origin=*&callback=?".replace("{word}", word), function (data) {
            // //console.log(this);
            var data = JSON.parse(this.response.substring(5, this.response.length - 1));

            var results = {
                title: "",
                definitions: []
            }

            var title, content;

            //no results found

            if (!data || !data.query || !data.query.pages || data.query.pages[-1]) {
                return callback({});
            }

            for (var page in data.query.pages) {
                title = data.query.pages[page].title;
                content = data.query.pages[page].revisions[0]["*"];
            }

            results.title = title;
            results.headers = [];

            var text = content.split("\n");

            if(lang == "fr" && text.includes("== {{langue|fr}} ==") == false) {
                return callback({});
            }

            if(lang == "es" && text.includes("== {{lengua|es}} ==") == false) {
                return callback({});
            }

            var heading1Regex = /^(==)([\w\s]+)(==)$/g;
            var heading2Regex = /^(===)([\w\s]+)(===)$/g;
            var heading3Regex = /^(====)([\w\s]+)(====)$/g;
            var linkRegex = /(\[+)([\w\s-]+)(\]+)/g;
            var type2LinkRegex = /(\[+)(\w+)([#|\w]+)(\]+)/g;
            var wikipediaArticleRegex = /(\[+)(:?w:)([\w\s]+)\|([\w\s]+)(\]+)/g;
            var contextDataRegex = /(\[+)([\w\W]+)(\]+)|({+)([\w\W]+)(}+)/g;
            var contextDataLinkRegex = /(\[+)(\]+)/g;
            var startingAndTrailingCommasRegex = /(^, )|(,$)/g;
            var italicsRegex = /''/g;
            var wordCharactersRegex = /\w/g;

            var heading1, heading2, heading3;

            //newregex
            var langH1Regex = new RegExp("^([=]{2}) \{\{([a-z]+)\|([a-z]{2})\}\} ([=]{2})$", "gm");
            var langH2Regex = new RegExp("^([=]{3}) \{\{S\|([a-zA-Z]+)\|([a-z]{2})\}\} ([=]{3})$", "gm");
            var langH3Regex = new RegExp("^([=]{4}) \{\{\S|([A-Za-z]+)\}\} ([=]{4})$", "gm");


            function normalizeWikidata(text, definitionLanguage) {
                text = text.replace(linkRegex, "$2"); //remove links to other words from definitions;
                text = text.replace(type2LinkRegex, "$2"); //replace links of the form [[information|Information]]
                text = text.replace(wikipediaArticleRegex, "$4"); //replace links to wikipedia articles with the link text
                if(typeof definitionLanguage !== "undefined") {
                    text = text.replace(/(\[+)/, "");
                    text = text.replace(/(\]+)/, "");
                    text = text.replace(/({+)([\w\W]+)(}+)/g, "");
                    text = text.replace("[[","");
                    text = text.replace("]]","");
                    text = text.replace("[[","");
                    text = text.replace("]]","").trim();
                    if(text == ".<br/>" || text == ".") {
                        text = "";
                    }
                }
                else {
                    text = text.replace(contextDataRegex, ""); //get rid of any extra data that is not human-readiable
                }

                return text;
            }

            text.forEach(function(line) {
                //update the current heading if needed
                if (heading1Regex.test(line)) {
                    heading1 = line.replace(heading1Regex, "$2");
                }
                if (heading2Regex.test(line)) {
                    heading2 = line.replace(heading2Regex, "$2");
                }
                if (heading3Regex.test(line)) {
                    heading3 = line.replace(heading3Regex, "$2");
                }

                if(lang == "fr") {

                    if(line.charAt(0) == "=") {
                        if (langH1Regex.test(line)) {
                            var header1Match = line.match(langH1Regex);
                            if(header1Match && header1Match.length > 1) {
                                if(header1Match[1].indexOf(lang) == -1) {
                                    heading1 = "unsupported";
                                }
                                else {
                                    heading1 = LANG[lang];
                                }
                            }
                        }

                        if (langH2Regex.test(line)) {
                            var header2Match = line.match(langH2Regex);
                            if(header2Match && header2Match.length > 2) {
                                if(header2Match[2] == lang && (header2Match[1] == "adjectif" || header2Match[1] == "nom" || header2Match[1] == "verbe")) {
                                    heading2 = header2Match[1];
                                }
                            }
                        }
                    }
                }

                var test0 = line.charAt(1);
                var test = !isNaN(line.charAt(1));
                var test2 = line.charAt(2) == ":"
                if(wordLanguage == "French") {

                    if (((!isNaN(line.charAt(1)) && line.charAt(2) == ":") || (line.indexOf("# ") == 0)) && heading1 !== "unsupported") {
                        try {
                            var newDefinition = line.replace("# ", "");
                            newDefinition = newDefinition.replace(/;\d:/gm, "");

                            var checkDefinition = normalizeWikidata(newDefinition, heading1);
                            checkDefinition = checkDefinition.replace(startingAndTrailingCommasRegex, ""); //remove starting and trailing commas that might occur (since some extra data that is removed occurs at the beginning and ends of definitions)
                            checkDefinition = checkDefinition.replace(italicsRegex, "");
                            newDefinition = wiky.process(newDefinition);
                            newDefinition = normalizeWikidata(newDefinition, heading1);
                            newDefinition = newDefinition.replace(startingAndTrailingCommasRegex, ""); //remove starting and trailing commas that might occur (since some extra data that is removed occurs at the beginning and ends of definitions)
                            newDefinition = newDefinition.replace(italicsRegex, "").trim();



                            var heading = heading2;

                            if ((heading == "adjectif" || heading == "nom" || heading == "verbe") && heading1 != "unsupported" && newDefinition !== ".<br/>") {
                                if (!results.definitions[heading]) {
                                    results.definitions[heading] = [];
                                    results.headers.push(heading);
                                }
                                results.definitions[heading].push({
                                    meaning: newDefinition,
                                    type: heading
                                });
                            }
                        }
                        catch (e) {
                            console.error(e);
                        }
                    }

                } else {
                    if ((!isNaN(line.charAt(1)) && line.charAt(2) == ":") || (line.indexOf("# ") == 0 || line.indexOf("* ") == 0) && (heading1 == wordLanguage || wordLanguage != "English")) {
                        // if (heading1 == wordLanguage) {
                        //console.log(line);
                        try {
                            var newDefinition = line.replace("# ", "");
                            newDefinition = newDefinition.replace(/;\d:/gm, "");

                            var checkDefinition = normalizeWikidata(newDefinition);
                            checkDefinition = checkDefinition.replace(startingAndTrailingCommasRegex, ""); //remove starting and trailing commas that might occur (since some extra data that is removed occurs at the beginning and ends of definitions)
                            checkDefinition = checkDefinition.replace(italicsRegex, "");
                            newDefinition = wiky.process(newDefinition);
                            newDefinition = normalizeWikidata(newDefinition);
                            newDefinition = newDefinition.replace(startingAndTrailingCommasRegex, ""); //remove starting and trailing commas that might occur (since some extra data that is removed occurs at the beginning and ends of definitions)
                            newDefinition = newDefinition.replace(italicsRegex, "");



                            var heading = heading2;


                            //sometimes, the word type will actually be in heading 3. If the heading 2 looks like it isn't a part of speech, use heading 3 instead.

                            if (line != "====Pronunciation===" && line != "====Etymology===") {
                                if (line != "" && (heading2 == "Pronunciation" || heading2 == "Etymology")) {
                                    //console.log("PROCESS:", line);
                                    var parsed = parseWikitext(lang, line, function(text) {
                                        var parsedEl = document.createElement("div");
                                        var parsedText = JSON.parse(text.response).parse.text["*"];
                                        parsedText = parsedText.replace(new RegExp("//upload", 'g'), "https://upload");
                                        parsedText = parsedText.replace(new RegExp("<a", 'g'), "<a-remove");
                                        parsedEl.innerHTML = parsedText;
                                        var href = null;
                                        try {
                                            href = parsedText.match(/href="https:\/\/upload.wikimedia.org([^"]*)/)[1];
                                        } catch (e) {
                                            // //console.error(e);
                                        }

                                        if (href) {
                                            //make item playable
                                            // /wikipedia/commons/d/d9/En-us-lily.ogg
                                            var audioSrc = document.createElement("audio");
                                            audioSrc.id = "";
                                            audioSrc.src = "https://upload.wikimedia.org/" + href;
                                            parsedEl.appendChild(audioSrc);

                                            parsedEl.addEventListener("click", function() {
                                                audioSrc.play();
                                            });

                                            document.getElementById("wikHeader").parentNode.insertBefore(parsedEl, document.getElementById("wikHeader").nextSibling);
                                            // document.getElementById("wikHeader").innerHTML = JSON.parse(text.response).parse.text["*"].replace(new RegExp("//upload", 'g'), "https://upload") + document.getElementById("definitionsSection").innerHTML;
                                        }

                                    });
                                }

                                //make sure there is actually a definition
                                if (wordCharactersRegex.test(checkDefinition) && newDefinition.indexOf("<ul>") != 0) {
                                    try {
                                        if (heading.toLowerCase().indexOf("etymology") != -1 || heading.toLowerCase().indexOf("pronounciation") != -1) {
                                            heading = heading3;
                                        }
                                    } catch (e) {
                                        heading = ""
                                    }

                                    if (heading != "Pronunciation" && heading != "Etymology" && heading != "undefined") {
                                        if (!results.definitions[heading]) {
                                            results.definitions[heading] = [];
                                            results.headers.push(heading);
                                        }
                                        results.definitions[heading].push({
                                            meaning: newDefinition,
                                            type: heading
                                        });
                                    }
                                }
                            }
                            // }
                        } catch (e) {
                            // //console.log(e);
                        }
                        // if (heading1 == wordLanguage || heading1 == "Etymology" || heading2 = "Etymology") {

                    }

                }


            });

            callback(results);
        }
    };

    xhttp.open("GET", "https://" + lang + ".wiktionary.org/w/api.php?format=json&action=query&titles={word}&rvprop=content&prop=revisions&redirects=1&origin=*&callback=?".replace("{word}", word), true);
    xhttp.send();
};

var isOnline = function() {
    var isRunningOnBrowser = window.__cordovaRunningOnBrowser__;

    if(!isRunningOnBrowser) {
        var connectionType = checkConnection();

        if(connectionType =="No network connection") {
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return navigator.onLine;
    }
};


/**
 * Wiky.js - Javascript library to converts Wiki MarkUp language to HTML.
 * You can do whatever with it. Please give me some credits (Apache License)
 * - Tanin Na Nakorn
 */

var wiky = {
    options: {
        'link-image': true //Preserve backward compat
    }
}


wiky.process = function(wikitext, options) {
    wiky.options = options || wiky.options;

    var lines = wikitext.split(/\r?\n/);


    var html = "";

    for (i = 0; i < lines.length; i++) {
        line = lines[i];
        if (line.match(/^===/) != null && line.match(/===$/) != null) {
            html += "<h2>" + line.substring(3, line.length - 3) + "</h2>";
        } else if (line.match(/^==/) != null && line.match(/==$/) != null) {
            html += "<h3>" + line.substring(2, line.length - 2) + "</h3>";
        } else if (line.match(/^:+/) != null) {
            // find start line and ending line
            start = i;
            while (i < lines.length && lines[i].match(/^\:+/) != null) i++;
            i--;

            html += wiky.process_indent(lines, start, i);
        } else if (line.match(/^----+(\s*)$/) != null) {
            html += "<hr/>";
        } else if (line.match(/^(\*+) /) != null) {
            // find start line and ending line
            start = i;
            while (i < lines.length && lines[i].match(/^(\*+|\#\#+)\:? /) != null) i++;
            i--;

            html += wiky.process_bullet_point(lines, start, i);
        } else if (line.match(/^(\#+) /) != null) {
            // find start line and ending line
            start = i;
            while (i < lines.length && lines[i].match(/^(\#+|\*\*+)\:? /) != null) i++;
            i--;

            html += wiky.process_bullet_point(lines, start, i);
        } else {
            html += wiky.process_normal(line);
        }

        html += "<br/>\n";
    }

    return html;
}

wiky.process_indent = function(lines, start, end) {
    var i = start;

    var html = "<dl>";

    for (var i = start; i <= end; i++) {

        html += "<dd>";

        var this_count = lines[i].match(/^(\:+)/)[1].length;

        html += wiky.process_normal(lines[i].substring(this_count));

        var nested_end = i;
        for (var j = i + 1; j <= end; j++) {
            var nested_count = lines[j].match(/^(\:+)/)[1].length;
            if (nested_count <= this_count) break;
            else nested_end = j;
        }

        if (nested_end > i) {
            html += wiky.process_indent(lines, i + 1, nested_end);
            i = nested_end;
        }

        html += "</dd>";
    }

    html += "</dl>";
    return html;
}

wiky.process_bullet_point = function(lines, start, end) {
    var i = start;

    var html = (lines[start].charAt(0) == '*') ? "<ul>" : "<ol>";

    html += '\n';

    for (var i = start; i <= end; i++) {

        html += "<li>";

        var this_count = lines[i].match(/^(\*+|\#+) /)[1].length;

        html += wiky.process_normal(lines[i].substring(this_count + 1));

        // continue previous with #:
        {
            var nested_end = i;
            for (var j = i + 1; j <= end; j++) {
                var nested_count = lines[j].match(/^(\*+|\#+)\:? /)[1].length;

                if (nested_count < this_count)
                    break;
                else {
                    if (lines[j].charAt(nested_count) == ':') {
                        html += "<br/>" + wiky.process_normal(lines[j].substring(nested_count + 2));
                        nested_end = j;
                    } else {
                        break;
                    }
                }

            }

            i = nested_end;
        }

        // nested bullet point
        {
            var nested_end = i;
            for (var j = i + 1; j <= end; j++) {
                var nested_count = lines[j].match(/^(\*+|\#+)\:? /)[1].length;
                if (nested_count <= this_count)
                    break;
                else
                    nested_end = j;
            }

            if (nested_end > i) {
                html += wiky.process_bullet_point(lines, i + 1, nested_end);
                i = nested_end;
            }
        }

        // continue previous with #:
        {
            var nested_end = i;
            for (var j = i + 1; j <= end; j++) {
                var nested_count = lines[j].match(/^(\*+|\#+)\:? /)[1].length;

                if (nested_count < this_count)
                    break;
                else {
                    if (lines[j].charAt(nested_count) == ':') {
                        html += wiky.process_normal(lines[j].substring(nested_count + 2));
                        nested_end = j;
                    } else {
                        break;
                    }
                }

            }

            i = nested_end;
        }

        html += "</li>\n";
    }

    html += (lines[start].charAt(0) == '*') ? "</ul>" : "</ol>";
    html += '\n';
    return html;
}

wiky.process_url = function(txt) {

    var index = txt.indexOf(" "),
        url = txt,
        label = txt,
        css = ' style="background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAFZJREFUeF59z4EJADEIQ1F36k7u5E7ZKXeUQPACJ3wK7UNokVxVk9kHnQH7bY9hbDyDhNXgjpRLqFlo4M2GgfyJHhjq8V4agfrgPQX3JtJQGbofmCHgA/nAKks+JAjFAAAAAElFTkSuQmCC\") no-repeat scroll right center transparent;padding-right: 13px;"';

    if (index !== -1) {
        url = txt.substring(0, index);
        label = txt.substring(index + 1);
    }
    return '<a href="' + url + '"' + (wiky.options['link-image'] ? css : '') + '>' + label + '</a>';
};

wiky.process_image = function(txt) {
    var index = txt.indexOf(" ");
    url = txt;
    label = "";

    if (index > -1) {
        url = txt.substring(0, index);
        label = txt.substring(index + 1);
    }


    return "<img src='" + url + "' alt=\"" + label + "\" />";
}

wiky.process_video = function(url) {

    if (url.match(/^(https?:\/\/)?(www.)?youtube.com\//) == null) {
        return "<b>" + url + " is an invalid YouTube URL</b>";
    }

    if ((result = url.match(/^(https?:\/\/)?(www.)?youtube.com\/watch\?(.*)v=([^&]+)/)) != null) {
        url = "http://www.youtube.com/embed/" + result[4];
    }


    return '<iframe width="480" height="390" src="' + url + '" frameborder="0" allowfullscreen></iframe>';
}

wiky.process_normal = function(wikitext) {

    // Image
    {
        var index = wikitext.indexOf("[[File:");
        var end_index = wikitext.indexOf("]]", index + 7);
        while (index > -1 && end_index > -1) {

            wikitext = wikitext.substring(0, index) +
                wiky.process_image(wikitext.substring(index + 7, end_index)) +
                wikitext.substring(end_index + 2);

            index = wikitext.indexOf("[[File:");
            end_index = wikitext.indexOf("]]", index + 7);
        }
    }

    // Video
    {
        var index = wikitext.indexOf("[[Video:");
        var end_index = wikitext.indexOf("]]", index + 8);
        while (index > -1 && end_index > -1) {

            wikitext = wikitext.substring(0, index) +
                wiky.process_video(wikitext.substring(index + 8, end_index)) +
                wikitext.substring(end_index + 2);

            index = wikitext.indexOf("[[Video:");
            end_index = wikitext.indexOf("]]", index + 8);
        }
    }


    // URL
    var protocols = ["http", "ftp", "news"];

    for (var i = 0; i < protocols.length; i++) {
        var index = wikitext.indexOf("[" + protocols[i] + "://");
        var end_index = wikitext.indexOf("]", index + 1);
        while (index > -1 && end_index > -1) {

            wikitext = wikitext.substring(0, index) +
                wiky.process_url(wikitext.substring(index + 1, end_index)) +
                wikitext.substring(end_index + 1);

            index = wikitext.indexOf("[" + protocols[i] + "://", end_index + 1);
            end_index = wikitext.indexOf("]", index + 1);

        }
    }

    var count_b = 0;
    var index = wikitext.indexOf("'''");
    while (index > -1) {

        if ((count_b % 2) == 0) wikitext = wikitext.replace(/'''/, "<b>");
        else wikitext = wikitext.replace(/'''/, "</b>");

        count_b++;

        index = wikitext.indexOf("'''", index);
    }

    var count_i = 0;
    var index = wikitext.indexOf("''");
    while (index > -1) {

        if ((count_i % 2) == 0) wikitext = wikitext.replace(/''/, "<i>");
        else wikitext = wikitext.replace(/''/, "</i>");

        count_i++;

        index = wikitext.indexOf("''", index);
    }

    wikitext = wikitext.replace(/<\/b><\/i>/g, "</i></b>");

    return wikitext;
}

if (typeof exports === 'object') {
    for (var i in wiky) {
        exports[i] = wiky[i];
    }
}
