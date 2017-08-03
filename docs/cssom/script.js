"use strict";
function getStyleSheetsHierarchy() {
    var styleSheets = document.styleSheets;
    Array.prototype.forEach.call(styleSheets, function (styleSheet, index) {
        dumpStyleSheet(0, index, styleSheet);
    });
}
function dumpStyleSheet(level, index, styleSheet) {
    var indent = Array(level * 5 + 1).join(' ');
    // describe me
    if (styleSheet.ownerNode) {
        if (styleSheet.ownerNode.nodeName == 'LINK') {
            console.log(indent + "[" + level + "-" + index + "] <link href=\"" + styleSheet.href + "\">");
        }
        else if (styleSheet.ownerNode.nodeName == 'STYLE') {
            console.log(indent + "[" + level + "-" + index + "] <style>");
        }
    }
    if (styleSheet.ownerRule) {
        console.log(indent + "[" + level + "-" + index + "]" + styleSheet.ownerRule.cssText);
    }
    // examine rules
    // ref : https://developer.mozilla.org/en-US/docs/Web/API/CSSRule
    if (styleSheet.cssRules) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            var cssRule = styleSheet.cssRules[i];
            if (cssRule.type == CSSRule.STYLE_RULE /* 1 */) {
                console.log(indent + "     " + cssRule.cssText);
            }
            else if (cssRule.type == CSSRule.IMPORT_RULE /* 3 */) {
                dumpStyleSheet(level + 1, i, cssRule.styleSheet);
            }
            else {
            }
        }
    }
}
getStyleSheetsHierarchy();
