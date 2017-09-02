declare const Prism: any;

class Utils {
    static ready(cb:()=>any) {
        if (/^loaded|^i|^c/.test(document.readyState)) {
            console.log('already loaded???');
            cb();
            return;
        }   

        let listener:EventListener;

        document.addEventListener('DOMContentLoaded', listener = (evt:any) => {
            document.removeEventListener('DOMContentLoaded', listener);
            cb();
        })
    }

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

    static showSource(sourceElement:Element, where?:Element) {
        let container = sourceElement.parentElement as Element;
        if (where == undefined) {
            where = sourceElement.nextElementSibling as Element;
        }

        var preBox = document.createElement("pre");
        var codeBox = document.createElement("code");
        preBox.appendChild(codeBox);

        if (sourceElement.nodeName == 'STYLE') {
            preBox.className = 'cssBox';
            codeBox.className = 'language-css';
            codeBox.textContent = Utils.getRulesString(false, sourceElement as HTMLStyleElement);
        }
        else if (sourceElement.nodeName == 'DIV') {
            preBox.className = 'htmlBox';
            codeBox.className = 'language-markup';
            codeBox.textContent = Utils.getHtmlString(sourceElement as HTMLElement);
        }
        else {
            codeBox.className = 'language-markup';
        }

        container.insertBefore(preBox, where);
    }


    static getHtmlString(element:HTMLElement):string {
        let content = element.outerHTML;

        // 시작하는 <div> 앞의 공백을 </div> 앞의 공백과 맞추는 작업을 한다.
        let lines = content.split('\n');
        let minIndentation = 8;
        for (let i = 1; i < lines.length; i++) {
            let line = lines[i];
            let numIndentation = line.search(/[^\s]+/);
            /* skip blank line */
            if (numIndentation < 0)
                continue;

            if (numIndentation < minIndentation) {
                minIndentation = numIndentation;
            }
        }

        content = Array(minIndentation + 1).join(' ') + content;

        return content;
    }

    static getRulesString(showVerbose:boolean, styleElement:HTMLStyleElement):string {
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
            rulesString = styleElement.textContent as string;
        }

        return rulesString;
    }

    // refer : http://prismjs.com/plugins/toolbar/
    static registerPrismButtons() {
        Prism.plugins.toolbar.registerButton('verbose', {
            text: 'on/off verbosity', // required
            onClick: function (env:any) { // optional
                let codeElement = env.element as HTMLElement;
                let preElement = codeElement.parentElement; 
                if (!preElement) 
                    return;
                let container = preElement.parentElement; 
                if (!container) 
                    return;

                let styleElement = container.previousElementSibling as HTMLStyleElement;

                // toggle verbosity 
                // classList : IE >= 10
                let verbosity = codeElement.classList.contains("style-verbose");
                if (verbosity) 
                    codeElement.classList.remove("style-verbose");
                else
                    codeElement.classList.add("style-verbose");

                codeElement.textContent = Utils.getRulesString(!verbosity, styleElement);
                Prism.highlightElement(codeElement);
            }
        });
    }

    static showExampleSources() {
        let exampleStyles = document.body.querySelectorAll("style.example");
        for(let i = 0; i < exampleStyles.length; i++) {
            let exampleStyle = exampleStyles[i];

            // <script> 다음에 insert 되기 때문에 .htmlBox 다음에 .cssBox을 추가해야 <script> .cssBox .htmlBox 순서가 된다.

            // 1. html
            let next = exampleStyle.nextElementSibling;
            if (next) {
                // <p>는 opitonal
                if (next.nodeName == 'P') {
                    next = next.nextElementSibling;
                }
                if (next && next.nodeName == 'DIV') {
                    Utils.showSource(next, exampleStyle.nextElementSibling as Element);
                }
            }

            // 2. style
            Utils.showSource(exampleStyle);
        }

        // 3. buttons
        Utils.registerPrismButtons(); 
    }

    static wrapSourcesWithFlex() {
        let exampleStyles = document.body.querySelectorAll("style.example");
        for(let i = 0; i < exampleStyles.length; i++) {
            let exampleStyle = exampleStyles[i];

            let cssBox = exampleStyle.nextElementSibling as Element;
            let htmlBox = cssBox.nextElementSibling as Element;

            let flexBox = document.createElement("div");
            flexBox.className = "sources-container";
            (<Element>(exampleStyle.parentElement)).insertBefore(flexBox, cssBox);
            
            flexBox.appendChild(cssBox);
            flexBox.appendChild(htmlBox);
        }
    }

    static configureShowSources() {
        Utils.ready(() => {
            Utils.showExampleSources();
            // 이벤트 핸들링 순서에 따른 문제가 발생할 수 있어서 data-manual을 지정해서 자동으로 적용하는 것을 막은 후에 수동으로 명령을 실행한다.
            Utils.wrapSourcesWithFlex();

            Prism.highlightAll();
        });
    }
}
