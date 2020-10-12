import { Injectable, Provider } from '@angular/core';
import { NgeMarkdownTransformer } from '../nge-markdown-transformer';
import {
    NgeMarkdownContribution,
    NGE_MARKDOWN_CONTRIBUTION
} from './nge-markdown-contribution';

/**
 * Contribution to use icons in markdown library using https://icongr.am/.
 */
@Injectable()
export class NgeMarkdownIcons implements NgeMarkdownContribution {
    contribute(api: NgeMarkdownTransformer) {
        // octicons = octicons ?? api.addStyle('https://unpkg.com/@icon/octicons/octicons.css');
        const pattern = /@(\w+)\s+([\w-]+)((\s+(?:color|size)=[^\s]+)*?)?@/gm;
        api.addHtmlTransformer(async element => {
            element.innerHTML = element
                .innerHTML
                .replace(pattern, (_: string, type: string,  name: string, params?: string) => {
                    params = (params ?? '')
                        .trim()
                        .split(' ')
                        .filter(e => e.trim())
                        .join('&');
                    params = params ? '?' + params : '';
                    return `<img src="https://icongr.am/${type.trim()}/${name.trim()}.svg${params}"/>`;
                });
        });
    }
}

/**
 * Provider to use icons in markdown library using https://icongr.am/.
 */
export const NgeMarkdownIconsProvider: Provider = {
    provide: NGE_MARKDOWN_CONTRIBUTION,
    multi: true,
    useClass: NgeMarkdownIcons,
};
