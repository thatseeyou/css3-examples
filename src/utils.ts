declare const Prism: any;

class Utils {
    static ready(cb: () => any) {
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
        const style1 = window.getComputedStyle(element1);
        const style2 = window.getComputedStyle(element2);

        console.dir(style1);
        

        const id1 = element1.id ? ` id="${element1.id}"` : '';
        const id2 = element2.id ? ` id="${element2.id}"` : '';

        const desc1 = `<${element1.tagName}${id1}>`;
        const desc2 = `<${element2.tagName}${id2}>`;

        Utils.diffComputedStyle(style1, style2, desc1, desc2);
    }

    static diffComputedStyle(style1: CSSStyleDeclaration, style2: CSSStyleDeclaration, desc1: string, desc2: string) {
        console.log(`BEGIN diff ${desc1} | ${desc2}`);

        for (let i = 0; i < style1.length; i++) {
            const styleKey1 = style1[i];
            const styleKey2 = style2[i];

            if (styleKey1 === styleKey2) {
                const value1 = style1.getPropertyValue(styleKey1);
                const value2 = style2.getPropertyValue(styleKey1);

                if (value1 !== value2) {
                    console.log(`[${i}] ${styleKey1} : ${value1} | ${value2}`);
                }
            }
            else {
                console.warn(`[${i}] ${styleKey1} | ${styleKey2} ; Key is different`);
            }
        }

        console.log(`END   diff ${desc1} | ${desc2}`);
        console.log('');
    }

    /**
     * Create Prism input format from code container
     * 
     * <div>HTML code</div> => <pre class="htmlBox"><code class="language-markup">HTML code</code></pre>
     * <style>CSS code</style> => <pre class="cssBox"><code class="language-css">CSS code</code></pre>
     * 
     * @param {Element} sourceContainer - Source code text will be extracted from sourceElement
     * @param {Element} where - default: nextElementSibling
     */
    static createPrismCodeElementFromSourceContainer(sourceContainer: Element, where?: Element) {
        const container = sourceContainer.parentElement as Element;
        if (where == undefined) {
            where = sourceContainer.nextElementSibling as Element;
        }

        const preBox = document.createElement("pre");
        const codeBox = document.createElement("code");
        preBox.appendChild(codeBox);

        if (sourceContainer.nodeName == 'STYLE') {
            preBox.className = 'cssBox';
            codeBox.className = 'language-css';
            codeBox.textContent = Utils.extractCSSRulesStringFromStyleElement(sourceContainer as HTMLStyleElement, false);
        }
        else if (sourceContainer.nodeName == 'DIV') {
            preBox.className = 'htmlBox';
            codeBox.className = 'language-markup';
            codeBox.textContent = Utils.extractHtmlStringFromContainer(sourceContainer as HTMLElement);
        }
        else {
            codeBox.className = 'language-markup';
        }

        container.insertBefore(preBox, where);
    }

    /**
     * Extract HTML string from container element 
     * 
     * @param {HTMLElement} containerElement 
     */
    static extractHtmlStringFromContainer(containerElement:HTMLElement):string {
        let content = containerElement.outerHTML;

        // 시작하는 <div> 앞의 공백을 </div> 앞의 공백과 맞추는 작업을 한다.
        const lines = content.split('\n');
        lines.shift(); /* lines from 2nd line */
        const minIndentation = lines.reduce((minIndentation:number, line:string) => {
            const numIndentation = line.search(/[^\s]+/);

            if (numIndentation < 0) {
                return minIndentation;
            }

            return (numIndentation < minIndentation) ? numIndentation : minIndentation;
        }, 8);

        content = Array(minIndentation + 1).join(' ') + content;

        return content;
    }

    /**
     * Extract CSS rules string from <style> element
     * 
     * @param {boolean} showVerbose - show as lengthen form
     * @param {HTMLStyleElement} styleElement 
     */
    static extractCSSRulesStringFromStyleElement(styleElement:HTMLStyleElement, showVerbose:boolean):string {
        let rulesString = '';

        if (showVerbose) {
            const cssRules = (styleElement.sheet as CSSStyleSheet).cssRules;

            rulesString = Object.values(cssRules).map(cssRule => {
                if (cssRule.type != CSSRule.STYLE_RULE) 
                    return ''

                const cssStyleRule = cssRule as CSSStyleRule;
                const selector = cssStyleRule.selectorText;

                const styles = Object.values(cssStyleRule.style).map((styleKey: string) => {
                    const value = cssStyleRule.style.getPropertyValue(styleKey);
                    return (cssStyleRule.style.length > 1) ? `    ${styleKey}: ${value};\n` : `${styleKey}: ${value}; `;
                }).join('');

                return (cssStyleRule.style.length > 1) ? `${selector} {\n${styles}}\n` : `${selector} { ${styles}}\n`;
            }).join('');
        }
        else {
            rulesString = styleElement.textContent as string;
        }

        return rulesString;
    }

    /**
     * Add Prism toolbar plugin buttons for cssBox
     * htmlBox buttons is hid by CSS(utils.css)
     * 
     * refer : http://prismjs.com/plugins/toolbar/
     */
    static registerPrismButtons() {
        Prism.plugins.toolbar.registerButton('verbose', {
            text: 'on/off verbosity', // required
            onClick: function (env:any) { // optional
                let prismCodeElement = env.element as HTMLElement;
                let preElement = prismCodeElement.parentElement; 
                if (!preElement) 
                    return;
                let container = preElement.parentElement; 
                if (!container) 
                    return;

                let styleElement = container.previousElementSibling as HTMLStyleElement;

                // toggle verbosity 
                // classList : IE >= 10
                const verbosity = prismCodeElement.classList.contains("style-verbose");
                if (verbosity) {
                    prismCodeElement.classList.remove("style-verbose");
                } else {
                    prismCodeElement.classList.add("style-verbose");
                }

                // reset to original code
                prismCodeElement.textContent = Utils.extractCSSRulesStringFromStyleElement(styleElement, !verbosity);
                Prism.highlightElement(prismCodeElement);
            }
        });
    }

    /**
     * Append htmlBox & cssBox to <script> like followings.
     * 
     * <script>...</script>
     * <div class="sources-container">
     *   <pre class="cssBox"><code class="language-css"></code></pre>
     *   <pre class="htmlBox"><code class="language-markup></code></pre>
     * </div>
     * <p>...</p>
     * <div>...</div>
     */
    static createCodeElementAll() {
        let exampleStyles = document.body.querySelectorAll("style.example");

        Array.prototype.forEach.call(exampleStyles, (exampleStyle:Element) => {
            // 1. html
            let next = exampleStyle.nextElementSibling;
            if (next) {
                // <p>는 opitonal
                if (next.nodeName == 'P') {
                    next = next.nextElementSibling;
                }
                if (next && next.nodeName == 'DIV') {
                    Utils.createPrismCodeElementFromSourceContainer(next, exampleStyle.nextElementSibling as Element);
                }
            }

            // 2. style
            Utils.createPrismCodeElementFromSourceContainer(exampleStyle);

            // 3. wrap html and style with container
            let cssBox = exampleStyle.nextElementSibling as Element;
            let htmlBox = cssBox.nextElementSibling as Element;

            let container = document.createElement("div");
            container.className = "sources-container";
            (<Element>(exampleStyle.parentElement)).insertBefore(container, cssBox);
            
            container.appendChild(cssBox);
            container.appendChild(htmlBox);
        })

        // 3. buttons
        Utils.registerPrismButtons(); 
    }

    /**
     * HTML 파일에서 style과 html를 추출해서 보여준다.
     * 
     * HTML 소스는 다음과 같은 형태로 되어 있어야 한다. <p>는 부연 설명으로 생략가능하다.
     * <style class="example">...</style>
     * <p>...optional...</p>
     * <div>...HTML...</div>
     * 
     * 아래 함수를 수행하면 다음과 같이 <style> 다음에 prism이 생성한 코드가 추가된다. 
     * <style class="example">...</style>
     * <div class="sources-container">
     *   <pre class="cssBox language-css code-toolbar">...</pre>
     *   <pre class="htmlBox language-markup code-toolbar">...</pre>
     * </div>
     * <p>...optional...</p>
     * <div>...HTML...</div>
     */
    static configureShowSources() {
        Utils.ready(() => {
            Utils.createCodeElementAll();

            // 이벤트 핸들링 순서에 따른 문제가 발생할 수 있어서 data-manual을 지정해서 자동으로 적용하는 것을 막은 후에 수동으로 명령을 실행한다.
            Prism.highlightAll();
        });
    }
}
