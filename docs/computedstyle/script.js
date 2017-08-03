"use strict";
function camelCase(input) {
    return input.toLowerCase().replace(/-(.)/g, function (match, group1) {
        return group1.toUpperCase();
    });
}
function diffComputedStyle(element1, element2) {
    var style1 = window.getComputedStyle(element1);
    var style2 = window.getComputedStyle(element2);
    console.log("BEGIN diff " + element1.tagName + " vs. " + element2.tagName);
    for (var i = 0; i < style1.length; i++) {
        var styleKey1 = style1[i];
        var styleKey2 = style2[i];
        if (styleKey1 != styleKey2) {
            console.warn("[" + i + "] " + styleKey1 + " vs. " + styleKey2 + " ; Key is different");
        }
        else {
            var value1 = style1.getPropertyValue(styleKey1);
            var value2 = style2.getPropertyValue(styleKey1);
            if (value1 != value2) {
                console.log("[" + i + "] " + styleKey1 + " : " + value1 + " vs. " + value2);
            }
        }
    }
    console.log("END   diff " + element1.tagName + " vs. " + element2.tagName);
}
var el1 = document.getElementById('a');
var el2 = document.getElementById('b');
diffComputedStyle(el1, el2);
