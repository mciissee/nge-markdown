import * as marked from 'marked';
import { InjectionToken, Injector } from '@angular/core';

/**
 * Global configuration of NgeMarkdownModule
 */
export declare type NgeMarkdownConfig = Omit<
    marked.MarkedOptions,
    'highlight' | 'sanitizer' | 'langPrefix'
> & {
    /** A space separated list of css classes names to add to codespan elements.  */
    codeSpanClassList?: string;
    /**
     * Function called to hightlight an HTMLElement code.
     * @param injector Injector reference to use Angular dependency injection.
     * @param options Highlight options.
     */
    highlightCodeElement?(injector: Injector, options: NgeMarkdownHighlightOptions): void | Promise<void>;
};

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

export const NGE_MARKDOWN_CONFIG = new InjectionToken<NgeMarkdownConfig>(
    'NGE_MARKDOWN_CONFIG'
);
