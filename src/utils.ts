class Utils {
    static camelCase(input: string) {
        return input.toLowerCase().replace(/-(.)/g, function (match, group1) {
            return group1.toUpperCase();
        });
    }

    static diffComputedStyleForElements(element1: Element, element2: Element) {
        let style1 = window.getComputedStyle(element1);
        let style2 = window.getComputedStyle(element2);

        let id1 = element1.id ? ` id="${element1.id}"`: '';
        let id2 = element2.id ? ` id="${element2.id}"`: '';

        let desc1 = `<${element1.tagName}${id1}>`;
        let desc2 = `<${element2.tagName}${id2}>`;

        Utils.diffComputedStyle(style1, style2, desc1, desc2);
    }

    static diffComputedStyle(style1: CSSStyleDeclaration, style2: CSSStyleDeclaration, desc1: string, desc2: string) {
        console.log(`BEGIN diff ${desc1} | ${desc2}`);

        for (let i = 0; i < style1.length; i++) {
            let styleKey1 = style1[i];
            let styleKey2 = style2[i];
            if (styleKey1 != styleKey2) {
                console.warn(`[${i}] ${styleKey1} | ${styleKey2} ; Key is different`);
            }
            else {
                let value1 = style1.getPropertyValue(styleKey1);
                let value2 = style2.getPropertyValue(styleKey1);

                if (value1 != value2) {
                    console.log(`[${i}] ${styleKey1} : ${value1} | ${value2}`);
                }
            }
        }

        console.log(`END   diff ${desc1} | ${desc2}`);
        console.log('');
    }

    static showPreviousSiblingCSS(showVerbose:boolean = false) {
        let currentContainer = document.currentScript.parentElement as HTMLElement;
        let styleElement = document.currentScript.previousElementSibling as HTMLStyleElement; 

        var cssBox = document.createElement("pre");
        currentContainer.insertBefore(cssBox, document.currentScript);
        cssBox.className = 'cssBox';

        updateCssBox(showVerbose, cssBox, styleElement);
        
        function updateCssBox(showVerbose:boolean, cssBox:HTMLElement, styleElement:HTMLStyleElement) {
            let rulesString = getRulesString(showVerbose, styleElement);
            cssBox.innerText = rulesString;
            addButtons(cssBox);
        }

        function getRulesString(showVerbose:boolean, styleElement:HTMLStyleElement) {
            let rulesString = '';

            if (showVerbose) {
                let cssRules = (styleElement.sheet as CSSStyleSheet).cssRules;

                for (let i = 0; i < cssRules.length; i++) {
                    let cssRule = cssRules[i];

                    if (cssRule.type == CSSRule.STYLE_RULE) {
                        let cssStyleRule = cssRule as CSSStyleRule;
                        let selector = cssStyleRule.selectorText;

                        let styles = '';
                        for (let j = 0; j < cssStyleRule.style.length; j++) {
                            let styleKey = cssStyleRule.style[j];
                            let value = cssStyleRule.style.getPropertyValue(styleKey);
                            if (cssStyleRule.style.length > 1)
                                styles += `    ${styleKey}: ${value};\n`;
                            else
                                styles += `${styleKey}: ${value}; `;
                        }

                        if (cssStyleRule.style.length > 1)
                            rulesString += `${selector} {\n${styles}}\n`;
                        else
                            rulesString += `${selector} { ${styles}}\n`;

                    }
                }
            }
            else {
                let textContent = styleElement.textContent as string;
                // let leadingSpace = rulesString.match(/^\s+/);
                let numFirstIndentation = textContent.search(/[^\s]+/);
                if (numFirstIndentation < 0)
                    numFirstIndentation = 0;

                let lines = textContent.split('\n');
                for (let line of lines) {
                    let numIndentation = line.search(/[^\s]+/);
                    /* skip blank line */
                    if (numIndentation < 0)
                        continue;

                    let trimLength = numIndentation > numFirstIndentation ? numFirstIndentation : numIndentation;

                    rulesString += line.substr(trimLength) + '\n';
                }
                rulesString = rulesString.trim();
            }

            return rulesString;
        }

        function addButtons(container: HTMLElement) {
            let div = document.createElement('div');
            let button = document.createElement('button');
            div.className = 'showStyleControls';
            button.className = 'scVerbose';
            button.textContent = 'On/Off verbodse';

            div.appendChild(button);
            container.insertBefore(div, container.firstChild);

            button.addEventListener('click', () => {
                console.log(getRulesString(false, styleElement));
                showVerbose = !showVerbose;
                updateCssBox(showVerbose, cssBox, styleElement);
            });
        }
    }
}