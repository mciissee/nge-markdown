import { Injectable, Provider } from '@angular/core';
import { NgeMarkdown } from '../nge-markdown';
import {
    NgeMarkdownContribution,
    NGE_MARKDOWN_CONTRIBUTION
} from './nge-markdown-contribution';

let promise: Promise<any> | undefined;

/** Key of `NgeMarkdownKatex` arguments in `NgeMarkdownContributionArgs` map. */
export const NgeMarkdownKatexArgsKey = 'nge-markdown-katex';

/** Custom arguments of NgeMarNgeMarkdownKatexkdownKatex contribution */
export declare type NgeMarkdownKatexArgs = {
    /** Katex library style url. */
    katexStyleUrl?: string;
    /** Katex library script url.  */
    katexScriptUrl?: string;
    /** Function called once katex is loaded */
    onLoadKatex?: (katex: any) => void;
};

/**
 * Contribution to render math expressions in markdown using [Katex](https://katex.org) library.
 */
@Injectable()
export class NgeMarkdownKatex implements NgeMarkdownContribution {
    contribute(api: NgeMarkdown) {
        api.addHtmlModifier(async (element) => {
            const katex = await this.katex(api);
            // pattern to search multiline latex between $$...$$ or inline latex between $...$
            const pattern = /(\$\$\n((.|\s|\n)+?)\n\$\$)|(\$([^\s][^$\n]+?[^\s])\$)/gm;
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

    private katex(api: NgeMarkdown) {
        if (promise) {
            return promise;
        }

        if ('katex' in window) {
            return (promise = Promise.resolve((window as any).katex));
        }

        return (promise = new Promise<any>(async (resolve) => {
            const args = api.contribArguments[NgeMarkdownKatexArgsKey] as NgeMarkdownKatexArgs;
            await Promise.all([
                api.addScript(
                    args?.katexScriptUrl || 'https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.js'
                ),
                api.addStyle(
                    args?.katexStyleUrl || 'https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css'
                ),
            ]);
            let interval: any;
            interval = setInterval(() => {
                const katex = (window as any).katex;
                if (katex) {
                    if (args?.onLoadKatex) {
                        args.onLoadKatex(katex);
                    }
                    resolve(katex);
                    clearInterval(interval);
                }
            }, 30);
        }));
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
