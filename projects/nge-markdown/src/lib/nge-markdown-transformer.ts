import { NgeMarkdownContributionArgs } from './contributions/nge-markdown-contribution';
import { MarkedTokenizer, MarkedRenderer, MarkedTokensList } from './marked-types';
import { NgeMarkdownConfig } from './nge-markdown-config';

declare type AstTransformer = (tokens: MarkedTokensList) => MarkedTokensList | Promise<MarkedTokensList>;
declare type HtmlTransformer = (element: HTMLElement) => void | Promise<void>;
declare type MarkdownTransformer = (markdown: string) => string | Promise<string>;
declare type RendererTransformer = (renderer: MarkedRenderer) => MarkedRenderer | Promise<MarkedRenderer>;
declare type TokenizerTransformer = (tokenizer: MarkedTokenizer) => MarkedTokenizer | Promise<MarkedTokenizer>;

/**
 * Nge markdown transformer used by the contributions.
 */
export class NgeMarkdownTransformer {

    private readonly astTransformers: AstTransformer[] = [];
    private readonly htmlTransformers: HtmlTransformer[] = [];
    private readonly markdownTransformers: MarkdownTransformer[] = [];
    private readonly rendererTransformers: RendererTransformer[] = [];
    private readonly tokenizerTransformers: TokenizerTransformer[] = [];

    constructor(
        /** Configuration option */
        readonly config: NgeMarkdownConfig,
        /** Contribution arguments */
        readonly contribArguments: NgeMarkdownContributionArgs,
    ) {}

    /**
     * Registers a function to call to update the ast generated by the markdown compiler.
     * @param transform the function to call.
     */
    addAstTransformer(transform: AstTransformer) {
        if (transform == null) {
            throw new ReferenceError('argument "transform" is required');
        }

        this.astTransformers.push(transform);
    }

    /**
     * Registers a function to call to transform the html generated by the markdown compiler.
     * @param transformer the function to call.
     */
    addHtmlTransformer(transformer: HtmlTransformer) {
        if (transformer == null) {
            throw new ReferenceError('argument "transform" is required');
        }

        this.htmlTransformers.push(transformer);
    }

    /**
     * Registers a function to call to transform the markdown before it's parsed by the markdown compiler.
     * @param transform the function to call.
     */
    addMarkdownTransformer(transform: MarkdownTransformer) {
        if (transform == null) {
            throw new ReferenceError('argument "transform" is required');
        }

        this.markdownTransformers.push(transform);
    }

    /**
     * Registers a function to call to update marked library renderer.
     * @param transform the function to call.
     */
    addRendererTransformer(transform: RendererTransformer) {
        if (transform == null) {
            throw new ReferenceError('argument "transform" is required');
        }

        this.rendererTransformers.push(transform);
    }

    /**
     * Registers a function to call to update marked library tokenizer.
     * @param transform the function to call.
     */
    addTokenizerTransformer(transform: TokenizerTransformer) {
        if (transform == null) {
            throw new ReferenceError('argument "transform" is required');
        }

        this.tokenizerTransformers.push(transform);
    }


    /**
     * Apply the registered ast transformer functions to the given ast.
     * @param ast the ast to transform.
     * @returns the transformed ast.
     */
    async transformAst(ast: MarkedTokensList): Promise<MarkedTokensList> {
        if (ast == null) {
            throw new ReferenceError('argument "ast" is required');
        }

        for (const transform of this.astTransformers) {
            ast = await transform(ast);
        }

        return ast;
    }

    /**
     * Apply the registered html transformer functions to the given html.
     * @param element the html element to transform.
     * @returns the transformed html.
     */
    async transformHTML(element: HTMLElement): Promise<HTMLElement> {
        if (element == null) {
            throw new ReferenceError('argument "html" is required');
        }

        for (const transform of this.htmlTransformers) {
            await transform(element);
        }

        return element;
    }

    /**
     * Apply the registered markdown transformer functions to the given markdown.
     * @param markdown the markdown to transform.
     * @returns the transformed markdown.
     */
    async transformMarkdown(markdown: string): Promise<string> {
        if (markdown == null) {
            throw new ReferenceError('argument "markdown" is required');
        }

        for (const transform of this.markdownTransformers) {
            markdown = await transform(markdown);
        }

        return markdown;
    }

    /**
     * Apply the registered renderer transformer functions to the given renderer.
     * @param renderer the renderer to transform.
     * @returns the transformed renderer.
     */
    async transformRenderer(renderer: MarkedRenderer): Promise<MarkedRenderer> {
        if (renderer == null) {
            throw new ReferenceError('argument "renderer" is required');
        }

        for (const compute of this.rendererTransformers) {
            renderer = await compute(renderer);
        }

        return renderer;
    }

    /**
     * Apply the registered tokenizer transformer functions to the given tokenizer.
     * @param tokenizer the tokenizer to transform.
     * @returns the transformed tokenizer.
     */
    async transformTokenizer(tokenizer: MarkedTokenizer): Promise<MarkedTokenizer> {
        if (tokenizer == null) {
            throw new ReferenceError('argument "tokenizer" is required');
        }

        for (const transform of this.tokenizerTransformers) {
            tokenizer = await transform(tokenizer);
        }

        return tokenizer;
    }

    /**
     * Add new stylesheet element to the document.
     * @param url url to the stylesheet.
     * @returns A promise that resolves once the element is loaded.
     */
    addStyle(url: string) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.body.appendChild(link);
        return new Promise<any>((resolve, reject) => {
            link.onload = resolve;
            link.onerror = reject;
        });
    }

    /**
     * Add new script element to the document.
     * @param url url to the script.
     * @returns A promise that resolves once the element is loaded.
     */
    addScript(url: string) {
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