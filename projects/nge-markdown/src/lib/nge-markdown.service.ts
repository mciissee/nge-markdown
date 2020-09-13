import {
    ElementRef,
    Inject,
    Injectable,
    Optional
} from '@angular/core';
import * as marked from 'marked';
import { NgeMarkdownContribution } from './contributions/nge-markdown-contribution';
import { MarkedRenderer, MarkedTokenizer } from './marked-types';
import { NgeMarkdownConfig, NGE_MARKDOWN_CONFIG } from './nge-markdown-config';
import { NgeMarkdown } from './nge-markdown';

/**
 * Markdown compiler service.
 */
@Injectable({
    providedIn: 'root',
})
export class NgeMarkdownService {

    constructor(
        @Optional()
        @Inject(NGE_MARKDOWN_CONFIG)
        private readonly config: NgeMarkdownConfig,
    ) {}

    /**
     * Compiles a markdown string to an html string.
     * @param options compilation options.
     * @returns A promise that resolve with the AST of the compiled markdown
     * (with the modifications of the contributions).
     */
    async compile(options: NgeMarkdownCompileOptions) {
        let markdown = this.trimIndent(options.markdown);
        if (options.isHtmlString) {
            markdown = this.decodeHtml(markdown);
        }

        const api = this.createApi(options);
        const renderer = await this.createRenderer(api);
        const tokenizer = await this.createTokenizer(api);
        const markedOptions: marked.MarkedOptions = {
            gfm: true,
            ...(this.config || {}),
            langPrefix: 'language-',
            renderer,
            tokenizer,
        };

        const tokens = await api.computeAst(
            marked.lexer(markdown, markedOptions)
        );

        options.target.nativeElement.innerHTML = marked.parser(
            tokens,
            markedOptions
        );

        await api.computeHtml(options.target.nativeElement);

        return tokens;
    }

    private async createRenderer(modifier: NgeMarkdown) {
        const renderer = await modifier.computeRenderer(
            this.config?.renderer || new MarkedRenderer()
        );
        return renderer;
    }

    private async createTokenizer(modifier: NgeMarkdown) {
        return await modifier.computeTokenizer(
            this.config?.tokenizer || new MarkedTokenizer()
        );
    }

    private createApi(options: NgeMarkdownCompileOptions) {
        const contributions = [...(options.contributions || [])];
        const modifier = new NgeMarkdown();
        contributions.forEach((contrib) => {
            contrib.contribute(modifier);
        });
        return modifier;
    }

    private decodeHtml(html: string): string {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = html;
        return textarea.value;
    }

    private trimIndent(markdown: string): string {
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

/**
 * Parameters of NgeMarkdownService `compile` method.
 */
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
