import { isPlatformBrowser } from '@angular/common';
import {
    Inject,
    Injectable,
    PLATFORM_ID,
    ElementRef,
    Optional,
} from '@angular/core';
import { NgeMarkdownContribution } from './contributions/nge-markdown-contribution';
import { NgeMarkdownModifier } from './nge-markdown-modifier';
import { MarkedTokenizer, MarkedRenderer } from './marked-types';
import * as marked from 'marked';
import { NGE_MARKDOWN_CONFIG, NgeMarkdownConfig } from './nge-markdown-config';


@Injectable({
    providedIn: 'root',
})
export class NgeMarkdownService {

    constructor(
        @Inject(PLATFORM_ID)
        private readonly platform: object,

        @Optional()
        @Inject(NGE_MARKDOWN_CONFIG)
        private readonly config: NgeMarkdownConfig
    ) {}

    /**
     * Compiles a markdown string to an html string.
     * @param options compilation options.
     * @returns AST of the compiled markdown (with the modifications of the contributions).
     */
    async compile(options: NgeMarkdownCompileOptions) {
        let markdown = this.trimIndentation(options.markdown);
        if (options.isHtmlString) {
            markdown = this.decodeHtml(markdown);
        }

        const modifier = new NgeMarkdownModifier();
        (options.contributions || []).forEach((contrib) => {
            contrib.contribute(modifier);
        });

        const renderer = await modifier.computeRenderer(
            this.config?.markedOptions?.renderer || new MarkedRenderer()
        );

        const tokenizer = await modifier.computeTokenizer(
            this.config?.markedOptions?.tokenizer || new MarkedTokenizer()
        );

        const markedOptions: marked.MarkedOptions = {
            ...(this.config?.markedOptions || {}),
            langPrefix: 'language-',
            renderer,
            tokenizer,
        };

        const tokens = await modifier.computeAst(
            marked.lexer(markdown, markedOptions)
        );

        options.target.nativeElement.innerHTML = marked.parser(tokens, markedOptions);

        await modifier.computeHtml(options.target.nativeElement);

        return tokens;
    }

    // https://github.com/jfcere/ngx-markdown/blob/master/lib/src/markdown.service.ts

    private decodeHtml(html: string): string {
        if (isPlatformBrowser(this.platform)) {
            const textarea = document.createElement('textarea');
            textarea.innerHTML = html;
            return textarea.value;
        }
        return html;
    }

    private trimIndentation(markdown: string): string {
        if (!markdown) {
            return '';
        }
        let indentStart: number;
        return markdown
            .split('\n')
            .map((line) => {
                let lineIdentStart = indentStart;
                if (line.length > 0) {
                    lineIdentStart = isNaN(lineIdentStart)
                        ? line.search(/\S|$/)
                        : Math.min(line.search(/\S|$/), lineIdentStart);
                }
                if (isNaN(indentStart)) {
                    indentStart = lineIdentStart;
                }
                return !!lineIdentStart ? line.substring(lineIdentStart) : line;
            })
            .join('\n');
    }
}

interface NgeMarkdownCompileOptions {
    /** Markdown string to compile. */
    markdown: string;
    /** HTMLElement on which to render the compiled markdown.  */
    target: ElementRef<HTMLElement>;
    /** Is the markdown contains html code? */
    isHtmlString?: boolean;
    /** List of contribution to use during the compilation. */
    contributions?: NgeMarkdownContribution[];
}
