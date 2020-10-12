import {
    Injector,
    InjectionToken,
    Injectable,
    Provider,
    Inject,
    Optional,
    Type
} from '@angular/core';
import { NgeMarkdown } from '../nge-markdown';
import {
    NgeMarkdownContribution,
    NGE_MARKDOWN_CONTRIBUTION,
} from './nge-markdown-contribution';

const DATA_LINES = 'data-nge-md-hl-lines';
const DATA_LANGUAGE = 'data-nge-md-hl-language';
const DATA_HIGHLIGHTS = 'data-nge-md-hl-highlights';

/**
 * Injection token to register a highlighter service.
 */
export const NGE_MARKDOWN_HIGHLIGHTER_SERVICE = new InjectionToken<
    NgeMarkdownHighlighterService
>('NGE_MARKDOWN_HIGHLIGHTER_SERVICE');

/**
 * Contribution to add an abstract syntax highlighter.
 */
@Injectable()
export class NgeMarkdownHighlighter implements NgeMarkdownContribution {
    constructor(
        private readonly injector: Injector,
        @Optional()
        @Inject(NGE_MARKDOWN_HIGHLIGHTER_SERVICE)
        private readonly config: NgeMarkdownHighlighterService
    ) {}

    contribute(api: NgeMarkdown) {
        this.addRenderers(api);
        this.addModifiers(api);
    }

    private addRenderers(api: NgeMarkdown) {
        api.addRendererModifier((renderer) => {
            renderer.code = (code, args) => {
                args = args || '';
                const attributes = new Map<string, string>();

                // LANGUAGE
                const language =
                    args.split(' ').slice(0, 1).pop() || 'plaintext';
                attributes.set(DATA_LANGUAGE, language);

                // LINE NUMBERING
                let match = args.match(/lines="(.+?)"/);
                if (match) {
                    attributes.set(DATA_LINES, match[1]);
                }

                // LINE HIGHLIGHTING
                match = args.match(/highlights="(.+?)"/);
                if (match) {
                    attributes.set(DATA_HIGHLIGHTS, match[1]);
                }

                const attribs = Array.from(attributes.entries())
                    .map(([attributeName, attributeValue]) => {
                        return `${attributeName}="${attributeValue}"`;
                    })
                    .join(' ');
                return `<pre ${attribs}><code>${code}</code></pre>`;
            };
            return renderer;
        });
    }

    private addModifiers(api: NgeMarkdown) {
        if (!this.config?.highligtht) {
            return;
        }

        const highlight = this.config.highligtht;
        api.addHtmlModifier(async (element) => {
            const preElements = Array.from(
                element.querySelectorAll(`pre[${DATA_LANGUAGE}]`)
            );
            for (const pre of preElements) {
                await highlight(this.injector, {
                    lines: pre.getAttribute(DATA_LINES) || '',
                    element: pre.querySelector('code') as HTMLElement,
                    language: pre.getAttribute(DATA_LANGUAGE) || 'plaintext',
                    highlights: pre.getAttribute(DATA_HIGHLIGHTS) || '',
                });
            }
        });
    }
}

/**
 * Provider to add an abstract syntax highlighter.
 */
export const NgeMarkdownHighlighterProvider: Provider = {
    provide: NGE_MARKDOWN_CONTRIBUTION,
    multi: true,
    useClass: NgeMarkdownHighlighter,
};

/**
 * Provider to register `NgeMonacoColorizerService` as the syntax highlighter.
 * @param type A reference to NgeMonacoColorizerService type.
 */
export const NgeMarkdownHighlighterMonacoProvider = (type: Type<any>) => {
    return {
        provide: NGE_MARKDOWN_HIGHLIGHTER_SERVICE,
        useValue: {
            highligtht: async (injector, options) => {
                const colorizer = injector.get(type, null);
                const code = options.element;
                const pre = code.parentElement as HTMLElement;
                await colorizer?.colorizeElement({
                    element: code,
                    language: options.language,
                    code: code.innerHTML,
                    lines: options.lines,
                    highlights: options.highlights
                });
                if (!pre.classList.contains('monaco-editor')) {
                    pre.classList.add('monaco-editor');
                    pre.classList.add('monaco-editor-background');
                }
                pre.style.margin = '0.5em 0';
                pre.style.overflow = 'auto';
                pre.style.border = '1px solid #F2F2F2';
            }
        } as NgeMarkdownHighlighterService
    };
};

/**
 * Highlighter service representation.
 */
export interface NgeMarkdownHighlighterService {
    /**
     * Function called to hightlight an HTMLElement code.
     * @param injector Injector reference to use Angular dependency injection.
     * @param options Highlight options.
     */
    highligtht?(
        injector: Injector,
        options: NgeMarkdownHighlightOptions
    ): void | Promise<void>;
}


/**
 * Highlight options.
 */
export interface NgeMarkdownHighlightOptions {
    /** &lt;code&gt;&lt;/code&gt; element to colorize. */
    element: HTMLElement;

    /** Target language (default plaintext) */
    language?: string;

    /**
     * Start line number or a space separated list of line numbers to show.
     *
     * Example:
     *
     * *Show all line numbers starting 1*
     *
     * `"1"`
     *
     * *Show all line numbers from 1 to 4*
     *
     * `"1-4"`
     *
     * *Show lines 2 4 5 6 7 9*
     *
     * `"2 4-7 9"`
     *
     */
    lines?: string;

    /**
     * A space separated list of line numbers to highlight.
     *
     * Example:
     *
     * *Highlight line 1*
     *
     * `"1"`
     *
     * *Highlight all lines from 1 to 4*
     *
     * `"1-4"`
     *
     * *Highlightw lines 2 4 5 6 7 9*
     *
     * `"2 4-7 9"`
     */
    highlights?: string;
}
