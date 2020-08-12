import { InjectionToken } from '@angular/core';
import { NgeMarkdownModifier } from '../nge-markdown-modifier';

export interface NgeMarkdownContribution {
    contribute(computer: NgeMarkdownModifier): void;
}

export const NGE_MARKDOWN_CONTRIBUTION = new InjectionToken<NgeMarkdownContribution>('NGE_MARKDOWN_CONTRIBUTION');
