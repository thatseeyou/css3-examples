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
    Utils.showPreviousSiblingCSS = function () {
        var currentContainer = document.currentScript.parentElement;
        var styleElement = currentContainer.previousElementSibling;
        var cssRules = styleElement.sheet.cssRules;
        var rulesString = '';
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
                        styles += "    " + styleKey + " : " + value + ";\n";
                    else
                        styles += styleKey + " : " + value + "; ";
                }
                if (cssStyleRule.style.length > 1)
                    rulesString += selector + " {\n" + styles + "}\n";
                else
                    rulesString += selector + " { " + styles + "}\n";
            }
        }
        var cssBox = document.createElement("pre");
        cssBox.innerText = rulesString;
        cssBox.className = 'cssBox';
        currentContainer.insertBefore(cssBox, document.currentScript);
    };
    return Utils;
}());
