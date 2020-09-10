import { NgeMarkdownContribution, NGE_MARKDOWN_CONTRIBUTION } from './nge-markdown-contribution';
import { NgeMarkdownModifier } from '../nge-markdown-modifier';
import { Provider } from '@angular/core';

export class NgeMarkdownLinkAnchor implements NgeMarkdownContribution {
    contribute(modifier: NgeMarkdownModifier) {
        modifier.addRendererModifier((renderer) => {
            // https://github.com/jfcere/ngx-markdown/issues/161
            renderer.link = (href: string, title: string, text: string) => {
                if (href.startsWith('#')) {
                    const fragment = href.split('#')[1];
                    return `<a href="${location.pathname}#${fragment}">${text}</a>`;
                }
                return `<a href="${href}" target="_blank" >${text}</a>`;
            };
            return renderer;
        });
    }
}

export const NgeMarkdownLinkAnchorProvider: Provider = {
    provide: NGE_MARKDOWN_CONTRIBUTION,
    multi: true,
    useClass: NgeMarkdownLinkAnchor,
};
