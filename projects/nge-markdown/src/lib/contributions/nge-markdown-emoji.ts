import { Provider } from '@angular/core';
import { NgeMarkdownModifier } from '../nge-markdown-modifier';
import {
    NgeMarkdownContribution,
    NGE_MARKDOWN_CONTRIBUTION,
} from './nge-markdown-contribution';

let joypixelsLoaderPromise: Promise<any> | undefined;

/**
 * Contribution to emoji in markdown using [emoji-toolkit](https://github.com/joypixels/emoji-toolkit) library.
 */
export class NgeMarkdownEmoji implements NgeMarkdownContribution {
    contribute(modifier: NgeMarkdownModifier) {
        modifier.addHtmlModifier(async (element) => {
            const joypixels = await this.requireJoypixels();
            element.innerHTML = joypixels.shortnameToUnicode(element.innerHTML);
        });
    }

    private requireJoypixels() {
        if (joypixelsLoaderPromise) {
            return joypixelsLoaderPromise;
        }

        if ('joypixels' in window) {
            return (joypixelsLoaderPromise = Promise.resolve(
                (window as any).joypixels
            ));
        }

        return (joypixelsLoaderPromise = new Promise<any>(async (resolve) => {
            await Promise.all([
                this.addScript(
                    'https://cdn.jsdelivr.net/npm/emoji-toolkit@6.0.1/lib/js/joypixels.min.js'
                ),
            ]);
            let interval: any;
            interval = setInterval(() => {
                if ((window as any).joypixels) {
                    resolve((window as any).joypixels);
                    clearInterval(interval);
                }
            }, 30);
        }));
    }

    private addScript(url: string) {
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

/**
 * Provider to emoji in markdown using [emoji-toolkit](https://github.com/joypixels/emoji-toolkit) library.
 */
export const NgeMarkdownEmojiProvider: Provider = {
    provide: NGE_MARKDOWN_CONTRIBUTION,
    multi: true,
    useClass: NgeMarkdownEmoji,
};
