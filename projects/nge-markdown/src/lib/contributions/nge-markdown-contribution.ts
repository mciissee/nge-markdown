import { InjectionToken } from '@angular/core';
import { NgeMarkdown } from '../nge-markdown';

/**
 * Implements this interface to contribute to nge-markdown.
 */
export interface NgeMarkdownContribution {
    /**
     * Contributes to nge-markdown api.
     * @param api nge-markdown api.
     */
    contribute(api: NgeMarkdown): void;
}

/** Inject this token to get the list of contributions to nge-markdown api.  */
export const NGE_MARKDOWN_CONTRIBUTION = new InjectionToken<
    NgeMarkdownContribution
>('NGE_MARKDOWN_CONTRIBUTION');
