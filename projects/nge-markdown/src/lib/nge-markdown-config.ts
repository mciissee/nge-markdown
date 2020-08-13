import * as marked from 'marked';
import { InjectionToken } from '@angular/core';

export interface NgeMarkdownConfig {
    markedOptions?: marked.MarkedOptions;
}

export const NGE_MARKDOWN_CONFIG = new InjectionToken<NgeMarkdownConfig>('NGE_MARKDOWN_CONFIG');
