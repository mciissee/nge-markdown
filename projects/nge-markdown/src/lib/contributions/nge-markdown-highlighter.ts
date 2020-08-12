import { NgeMarkdownModifier } from '../nge-markdown-modifier';
import { NgeMarkdownContribution } from './nge-markdown-contribution';

let prismLoaderPromise: Promise<any> | undefined;

/**
 * Contribution to add Prism syntax highlighter.
 */
export class NgeMarkdownHighlighter implements NgeMarkdownContribution {

    contribute(modifier: NgeMarkdownModifier) {
        this.addRenderers(modifier);
        this.addHighlighter(modifier);
    }

    private addRenderers(modifier: NgeMarkdownModifier) {
        modifier.addRendererModifier(renderer => {
            renderer.code = (code, args) => {
                const attribs: string[] = [];
                const classes: string[] = [];

                args = args || '';

                // LANGUAGE
                let language = args
                    .split(' ')
                    .slice(0, 1)
                    .pop();
                language = language ? 'language-' + language : '';
                classes.push(language);

                // LINE NUMBERS

                let linenums = '';
                let match = args.match(/linenums="(.+?)"/);
                if (match) {
                    linenums = match[1];
                    const startLine = Number.parseInt(linenums, 10);
                    if (linenums === 'true' || startLine) {
                        classes.push('line-numbers');
                    }
                    if (startLine) {
                        attribs.push(`data-start="${linenums}"`);
                    }
                }

                // LINES TO HIGHLIGHT

                let highlights = '';
                match = args.match(/highlights="(.+?)"/);
                if (match) {
                    highlights = match[1];
                    classes.push('line-highlight');
                    attribs.push(`data-line="${highlights}"`);
                }

                return `<pre class="${classes.join(' ')}" ${attribs.join(' ')}><code>${code}</code></pre>`;
            };
            renderer.codespan = (code) => {
                console.log(code);
                return `<code class="language-none">${code}</code>`;
            };
            return renderer;
        });
    }

    private addHighlighter(modifier: NgeMarkdownModifier) {
        modifier.addHtmlModifier(async (element) => {
            const prism = await this.loadPrism();
            prism.highlightAllUnder(element);
        });
    }

    private loadPrism() {
        if (prismLoaderPromise) {
            return prismLoaderPromise;
        }

        return prismLoaderPromise = new Promise<any>(async resolve => {
            await Promise.all([
                this.loadScript('https://cdn.jsdelivr.net/npm/prismjs@1.21.0/components/prism-core.js'),
                this.loadStyle('https://cdn.jsdelivr.net/npm/prismjs@1.21.0/themes/prism.css'),

                // https://prismjs.com/plugins/auto-loader/
                this.loadScript('https://cdn.jsdelivr.net/npm/prismjs@1.21.0/plugins/autoloader/prism-autoloader.min.js'),

                // https://prismjs.com/plugins/line-numbers/
                this.loadScript('https://cdn.jsdelivr.net/npm/prismjs@1.21.0/plugins/line-numbers/prism-line-numbers.min.js'),
                this.loadStyle('https://cdn.jsdelivr.net/npm/prismjs@1.21.0/plugins/line-numbers/prism-line-numbers.css'),

                // https://prismjs.com/plugins/line-highlight/
                this.loadScript('https://cdn.jsdelivr.net/npm/prismjs@1.21.0/plugins/line-highlight/prism-line-highlight.min.js'),
                this.loadStyle('https://cdn.jsdelivr.net/npm/prismjs@1.21.0/plugins/line-highlight/prism-line-highlight.css'),

                // https://prismjs.com/plugins/autolinker/
                this.loadScript('https://cdn.jsdelivr.net/npm/prismjs@1.21.0/plugins/autolinker/prism-autolinker.min.js'),
                this.loadStyle('https://cdn.jsdelivr.net/npm/prismjs@1.21.0/plugins/autolinker/prism-autolinker.css'),
            ]);

            const prism = (window as any).Prism;
            prism.manual = true;
            resolve(prism);
        });
    }

    private loadStyle(url: string) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.body.appendChild(link);
        return new Promise<any>((resolve, reject) => {
            link.onload = resolve;
            link.onerror = reject;
        });
    }

    private loadScript(url: string) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        document.body.appendChild(script);
        return new Promise<any>((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
        });
    }

}
