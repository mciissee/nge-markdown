import { Injector } from '@angular/core';
import { NGE_MARKDOWN_CONFIG } from '../nge-markdown-config';
import { NgeMarkdownModifier } from '../nge-markdown-modifier';
import { NgeMarkdownContribution } from './nge-markdown-contribution';

/**
 * Contribution to add and abstract syntax highlighter.
 */
export class NgeMarkdownHighlighter implements NgeMarkdownContribution {

    constructor(
        private readonly injector: Injector,
    ) {}

    contribute(modifier: NgeMarkdownModifier) {
        this.addRenderers(modifier);
        this.addHighlighter(modifier);
    }

    private addRenderers(modifier: NgeMarkdownModifier) {
        modifier.addRendererModifier(renderer => {
            renderer.code = (code, args) => {
                args = args || '';
                const attributes = new Map<string, string>();

                // LANGUAGE
                const language = args
                    .split(' ')
                    .slice(0, 1)
                    .pop() || 'plaintext';
                attributes.set('data-nge-markdown-language', language);

                // LINE NUMBERING
                let match = args.match(/lines="(.+?)"/);
                if (match) {
                    attributes.set('data-nge-markdown-lines', match[1]);
                }

                // LINE HIGHLIGHTING
                match = args.match(/highlights="(.+?)"/);
                if (match) {
                    attributes.set('data-nge-markdown-highlights', match[1]);
                }

                const str: string[] = [];
                attributes.forEach((v, k) => {
                    str.push(`${k}="${v}"`);
                });
                return `<pre ${str.join(' ')}><code>${code}</code></pre>`;
            };

            return renderer;
        });
    }

    private addHighlighter(modifier: NgeMarkdownModifier) {
        const config = this.injector.get(NGE_MARKDOWN_CONFIG, null);
        if (!config?.highlightCodeElement) {
            return;
        }
        const highlight = config.highlightCodeElement;
        modifier.addHtmlModifier(async (element) => {
            const preElements = Array.from(element.querySelectorAll('pre[data-nge-markdown-language]'));
            for (const pre of preElements) {
                await highlight(this.injector, {
                    element: pre.querySelector('code') as HTMLElement,
                    language: pre.getAttribute('data-nge-markdown-language') || 'plaintext',
                    lines: pre.getAttribute('data-nge-markdown-lines') || '',
                    highlights: pre.getAttribute('data-nge-markdown-highlights') || '',
                });
            }
        });
    }

}
