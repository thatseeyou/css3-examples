"use strict";
var Utils = (function () {
    function Utils() {
    }
    Utils.camelCase = function (input) {
        return input.toLowerCase().replace(/-(.)/g, function (match, group1) {
            return group1.toUpperCase();
        });
    };
    Utils.diffComputedStyleForElements = function (element1, element2) {
        var style1 = window.getComputedStyle(element1);
        var style2 = window.getComputedStyle(element2);
        var id1 = element1.id ? " id=\"" + element1.id + "\"" : '';
        var id2 = element2.id ? " id=\"" + element2.id + "\"" : '';
        var desc1 = "<" + element1.tagName + id1 + ">";
        var desc2 = "<" + element2.tagName + id2 + ">";
        Utils.diffComputedStyle(style1, style2, desc1, desc2);
    };
    Utils.diffComputedStyle = function (style1, style2, desc1, desc2) {
        console.log("BEGIN diff " + desc1 + " | " + desc2);
        for (var i = 0; i < style1.length; i++) {
            var styleKey1 = style1[i];
            var styleKey2 = style2[i];
            if (styleKey1 != styleKey2) {
                console.warn("[" + i + "] " + styleKey1 + " | " + styleKey2 + " ; Key is different");
            }
            else {
                var value1 = style1.getPropertyValue(styleKey1);
                var value2 = style2.getPropertyValue(styleKey1);
                if (value1 != value2) {
                    console.log("[" + i + "] " + styleKey1 + " : " + value1 + " | " + value2);
                }
            }
        }
        console.log("END   diff " + desc1 + " | " + desc2);
        console.log('');
    };
    Utils.showPreviousSiblingCSS = function (showVerbose) {
        if (showVerbose === void 0) { showVerbose = false; }
        var currentContainer = document.currentScript.parentElement;
        var styleElement = document.currentScript.previousElementSibling;
        var cssBox = document.createElement("pre");
        currentContainer.insertBefore(cssBox, document.currentScript);
        cssBox.className = 'cssBox';
        updateCssBox(showVerbose, cssBox, styleElement);
        function updateCssBox(showVerbose, cssBox, styleElement) {
            var rulesString = getRulesString(showVerbose, styleElement);
            cssBox.innerText = rulesString;
            addButtons(cssBox);
        }
        function getRulesString(showVerbose, styleElement) {
            var rulesString = '';
            if (showVerbose) {
                var cssRules = styleElement.sheet.cssRules;
                for (var i = 0; i < cssRules.length; i++) {
                    var cssRule = cssRules[i];
                    if (cssRule.type == CSSRule.STYLE_RULE) {
                        var cssStyleRule = cssRule;
                        var selector = cssStyleRule.selectorText;
                        var styles = '';
                        for (var j = 0; j < cssStyleRule.style.length; j++) {
                            var styleKey = cssStyleRule.style[j];
                            var value = cssStyleRule.style.getPropertyValue(styleKey);
                            if (cssStyleRule.style.length > 1)
                                styles += "    " + styleKey + ": " + value + ";\n";
                            else
                                styles += styleKey + ": " + value + "; ";
                        }
                        if (cssStyleRule.style.length > 1)
                            rulesString += selector + " {\n" + styles + "}\n";
                        else
                            rulesString += selector + " { " + styles + "}\n";
                    }
                }
            }
            else {
                var textContent = styleElement.textContent;
                // let leadingSpace = rulesString.match(/^\s+/);
                var numFirstIndentation = textContent.search(/[^\s]+/);
                if (numFirstIndentation < 0)
                    numFirstIndentation = 0;
                var lines = textContent.split('\n');
                for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                    var line = lines_1[_i];
                    var numIndentation = line.search(/[^\s]+/);
                    /* skip blank line */
                    if (numIndentation < 0)
                        continue;
                    var trimLength = numIndentation > numFirstIndentation ? numFirstIndentation : numIndentation;
                    rulesString += line.substr(trimLength) + '\n';
                }
                rulesString = rulesString.trim();
            }
            return rulesString;
        }
        function addButtons(container) {
            var div = document.createElement('div');
            var button = document.createElement('button');
            div.className = 'showStyleControls';
            button.className = 'scVerbose';
            button.textContent = 'On/Off verbodse';
            div.appendChild(button);
            container.insertBefore(div, container.firstChild);
            button.addEventListener('click', function () {
                console.log(getRulesString(false, styleElement));
                showVerbose = !showVerbose;
                updateCssBox(showVerbose, cssBox, styleElement);
            });
        }
    };
    return Utils;
}());
