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
}