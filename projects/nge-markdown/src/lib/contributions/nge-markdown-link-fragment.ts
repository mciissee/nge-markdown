import { NgeMarkdownContribution } from './nge-markdown-contribution';
import { NgeMarkdownModifier } from '../nge-markdown-modifier';

export class NgeMarkdownLinkFragment implements NgeMarkdownContribution {
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
