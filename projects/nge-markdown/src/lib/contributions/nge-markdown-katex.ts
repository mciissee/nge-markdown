import { Provider } from '@angular/core';
import { NgeMarkdownModifier } from '../nge-markdown-modifier';
import {
    NgeMarkdownContribution,
    NGE_MARKDOWN_CONTRIBUTION
} from './nge-markdown-contribution';

let katexLoaderPromise: Promise<any> | undefined;

/**
 * Contribution to render math expressions in markdown using [Katex](https://katex.org) library.
 */
export class NgeMarkdownKatex implements NgeMarkdownContribution {

    contribute(modifier: NgeMarkdownModifier) {
        modifier.addHtmlModifier(async (element) => {
            const katex = await this.getOrLoadKatexLib();
            // pattern to search multiline latex between $$...$$ or inline latex between $...$
            const pattern = /(^\$\$(\n(.|\n)+?\n)\$\$)|(\$([^\s][^$]*?[^\s])\$)/gm;
            element.innerHTML = element
                .innerHTML
                .replace(pattern, (match) => {
                    if (match.startsWith('$$')) {
                        return katex.renderToString(
                            // remove $$ from the start and end of the match
                            match.substring(2, match.length - 2)
                        );
                    }
                    return katex.renderToString(
                        // remove $ from the start and the end of the match
                        match.substring(1, match.length - 1)
                    );
                }
            );
        });
    }

    private getOrLoadKatexLib() {
        if (katexLoaderPromise) {
            return katexLoaderPromise;
        }

        if ('katex' in window) {
            return (katexLoaderPromise = Promise.resolve((window as any).katex));
        }

        return (katexLoaderPromise = new Promise<any>(async (resolve) => {
            await Promise.all([
                this.addScript('https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.js'),
                this.addStyle('https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css'),
            ]);
            let interval: any;
            interval = setInterval(() => {
                if ((window as any).katex) {
                    resolve((window as any).katex);
                    clearInterval(interval);
                }
            }, 30);
        }));
    }

    private addStyle(url: string) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.body.appendChild(link);
        return new Promise<any>((resolve, reject) => {
            link.onload = resolve;
            link.onerror = reject;
        });
    }

    private addScript(url: string) {
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

/**
 * Provider to render math expressions in markdown using [Katex](https://katex.org) library.
 */
export const NgeMarkdownKatexProvider: Provider = {
    provide: NGE_MARKDOWN_CONTRIBUTION,
    multi: true,
    useClass: NgeMarkdownKatex,
};
