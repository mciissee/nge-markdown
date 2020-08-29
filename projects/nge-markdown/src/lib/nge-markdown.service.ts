import {
    ElementRef,
    Inject,
    Injectable,
    Injector,
    Optional,
} from '@angular/core';
import { NgeMarkdownContribution } from './contributions/nge-markdown-contribution';
import { NgeMarkdownHighlighter } from './contributions/nge-markdown-highlighter';
import { MarkedRenderer, MarkedTokenizer } from './marked-types';
import { NgeMarkdownConfig, NGE_MARKDOWN_CONFIG } from './nge-markdown-config';
import { NgeMarkdownModifier } from './nge-markdown-modifier';
import * as marked from 'marked';

@Injectable({
    providedIn: 'root',
})
export class NgeMarkdownService {

    constructor(
        @Optional()
        @Inject(NGE_MARKDOWN_CONFIG)
        private readonly config: NgeMarkdownConfig,
        private readonly injector: Injector
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

        const modifier = this.createModifier(options);
        const renderer = await this.createRenderer(modifier);
        const tokenizer = await this.createTokenizer(modifier);
        const markedOptions: marked.MarkedOptions = {
            ...(this.config || {}),
            langPrefix: 'language-',
            renderer,
            tokenizer,
        };

        const tokens = await modifier.computeAst(
            marked.lexer(markdown, markedOptions)
        );

        options.target.nativeElement.innerHTML = marked.parser(
            tokens,
            markedOptions
        );

        await modifier.computeHtml(options.target.nativeElement);

        return tokens;
    }

    private createModifier(options: NgeMarkdownCompileOptions) {
        const contributions = [...(options.contributions || [])];
        if (this.config?.highlightCodeElement) {
            contributions.push(new NgeMarkdownHighlighter(this.injector));
        }

        const modifier = new NgeMarkdownModifier();
        contributions.forEach((contrib) => {
            contrib.contribute(modifier);
        });

        return modifier;
    }

    private async createRenderer(modifier: NgeMarkdownModifier) {
        const renderer = await modifier.computeRenderer(
            this.config?.renderer || new MarkedRenderer()
        );
        if (this.config?.codeSpanClassList) {
            renderer.codespan = (code) => `
            <code class="${this.config.codeSpanClassList}">
                ${code}
            </code>
            `;
        }
        return renderer;
    }

    private async createTokenizer(modifier: NgeMarkdownModifier) {
        return await modifier.computeTokenizer(
            this.config?.tokenizer || new MarkedTokenizer()
        );
    }

    // https://github.com/jfcere/ngx-markdown/blob/master/lib/src/markdown.service.ts

    private decodeHtml(html: string): string {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = html;
        return textarea.value;
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
