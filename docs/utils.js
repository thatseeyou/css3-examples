"use strict";
var Utils = (function () {
    function Utils() {
    }
    Utils.ready = function (cb) {
        if (/^loaded|^i|^c/.test(document.readyState)) {
            console.log('already loaded???');
            cb();
            return;
        }
        var listener;
        document.addEventListener('DOMContentLoaded', listener = function (evt) {
            document.removeEventListener('DOMContentLoaded', listener);
            console.log('ready!!!');
            cb();
        });
    };
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
    Utils.showSource = function (sourceElement, where) {
        var container = sourceElement.parentElement;
        if (where == undefined) {
            where = sourceElement.nextElementSibling;
        }
        var preBox = document.createElement("pre");
        var codeBox = document.createElement("code");
        preBox.appendChild(codeBox);
        if (sourceElement.nodeName == 'STYLE') {
            preBox.className = 'cssBox';
            codeBox.className = 'language-css';
            codeBox.textContent = Utils.getRulesString(false, sourceElement);
        }
        else if (sourceElement.nodeName == 'DIV') {
            preBox.className = 'htmlBox';
            codeBox.className = 'language-markup';
            codeBox.textContent = Utils.getHtmlString(sourceElement);
        }
        else {
            codeBox.className = 'language-markup';
        }
        container.insertBefore(preBox, where);
    };
    Utils.getHtmlString = function (element) {
        return element.innerHTML;
    };
    Utils.getRulesString = function (showVerbose, styleElement) {
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
            rulesString = styleElement.textContent;
        }
        return rulesString;
    };
    // refer : http://prismjs.com/plugins/toolbar/
    Utils.registerPrismButtons = function () {
        Prism.plugins.toolbar.registerButton('verbose', {
            text: 'on/off verbosity',
            onClick: function (env) {
                var codeElement = env.element;
                if (!codeElement.parentElement)
                    return;
                var styleElement = codeElement.parentElement.previousElementSibling;
                // toggle verbosity 
                // classList : IE >= 10
                var verbosity = codeElement.classList.contains("style-verbose");
                if (verbosity)
                    codeElement.classList.remove("style-verbose");
                else
                    codeElement.classList.add("style-verbose");
                codeElement.textContent = Utils.getRulesString(!verbosity, styleElement);
                Prism.highlightElement(codeElement);
            }
        });
    };
    Utils.showExampleSources = function () {
        var exampleStyles = document.body.querySelectorAll("style.example");
        for (var i = 0; i < exampleStyles.length; i++) {
            var exampleStyle = exampleStyles[i];
            // 1. html
            var next = exampleStyle.nextElementSibling;
            if (next) {
                console.debug();
                if (next.nodeName == 'P') {
                    next = next.nextElementSibling;
                }
                if (next && next.nodeName == 'DIV') {
                    Utils.showSource(next, exampleStyle.nextElementSibling);
                }
            }
            // 2. style
            Utils.showSource(exampleStyle);
        }
        // 3. buttons
        Utils.registerPrismButtons();
    };
    Utils.configureShowSources = function () {
        Utils.ready(function () {
            Utils.showExampleSources();
            // 이벤트 핸들링 순서에 따른 문제가 발생할 수 있어서 data-manual을 지정해서 자동으로 적용하는 것을 막은 후에 수동으로 명령을 실행한다.
            Prism.highlightAll();
        });
    };
    return Utils;
}());
