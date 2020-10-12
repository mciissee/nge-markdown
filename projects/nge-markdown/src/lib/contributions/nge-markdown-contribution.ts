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

export declare type NgeMarkdownContributionArgs = Record<string, any>;

/** Inject this token to get the list of contributions to nge-markdown api.  */
export const NGE_MARKDOWN_CONTRIBUTION = new InjectionToken<
    NgeMarkdownContribution
>('NGE_MARKDOWN_CONTRIBUTION');

/** Inject to pass arguments to nge-markdown contributions.  */
export const NGE_MARKDOWN_CONTRIBUTION_ARGS = new InjectionToken<
    NgeMarkdownContributionArgs
>('NGE_MARKDOWN_CONTRIBUTION_ARGS');
