import {
    Inject,
    Injectable,
    Optional
} from '@angular/core';
import * as marked from 'marked';
import { NgeMarkdownContribution, NgeMarkdownContributionArgs, NGE_MARKDOWN_CONTRIBUTION_ARGS } from './contributions/nge-markdown-contribution';
import { MarkedRenderer, MarkedTokenizer } from './marked-types';
import { NgeMarkdownConfig, NGE_MARKDOWN_CONFIG } from './nge-markdown-config';
import { NgeMarkdownTransformer } from './nge-markdown-transformer';

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
        @Optional()
        @Inject(NGE_MARKDOWN_CONTRIBUTION_ARGS)
        private readonly contribArgs: NgeMarkdownContributionArgs,
    ) {
        this.config = config || {};
        this.contribArgs = contribArgs || {};
    }

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

        const transformer = this.createTransformer(options);
        const renderer = await this.createRenderer(transformer);
        const tokenizer = await this.createTokenizer(transformer);

        const markedOptions: marked.MarkedOptions = {
            gfm: true,
            ...this.config,
            langPrefix: 'language-',
            renderer,
            tokenizer,
        };

        const tokens = await transformer.transformAst(
            marked.lexer(
                await transformer.transformMarkdown(markdown),
                markedOptions
            )
        );

        // COMPUTE THE HTML IN NEW DOCUMENT OBJECT SO SCRIPTS WILL NOT BE EXECUTED
        // DURING THE COMPUTATION
        const dom = new DOMParser().parseFromString(
            marked.parser(
                tokens,
                markedOptions
            ),
            'text/html'
        );
        await transformer.transformHTML(dom.body);

        options.target.innerHTML = dom.body.innerHTML;

        return tokens;
    }

    private async createRenderer(api: NgeMarkdownTransformer) {
        const renderer = await api.transformRenderer(
            this.config?.renderer || new MarkedRenderer()
        );
        return renderer;
    }

    private async createTokenizer(api: NgeMarkdownTransformer) {
        return await api.transformTokenizer(
            this.config?.tokenizer || new MarkedTokenizer()
        );
    }

    private createTransformer(options: NgeMarkdownCompileOptions) {
        const contributions = [...(options.contributions || [])];
        const transformer = new NgeMarkdownTransformer(
            this.config,
            this.contribArgs
        );
        contributions.forEach((contrib) => {
            contrib.contribute(transformer);
        });
        return transformer;
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
    target: HTMLElement;
    /** Is the markdown contains html code? */
    isHtmlString?: boolean;
    /** List of contribution to use during the compilation. */
    contributions?: NgeMarkdownContribution[];
}
