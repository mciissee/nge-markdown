import { Injectable, Provider } from '@angular/core';
import { NgeMarkdown } from '../nge-markdown';
import {
    NgeMarkdownContribution,
    NGE_MARKDOWN_CONTRIBUTION
} from './nge-markdown-contribution';

let promise: Promise<any> | undefined;

/** Key of `NgeMarkdownEmoji` arguments in `NgeMarkdownContributionArgs` map. */
export const NgeMarkdownEmojiArgsKey = 'emoji';

/** Custom arguments of `NgeMarkdownEmoji` contribution */
export declare type NgeMarkdownEmojiArgs = {
    /** joypixels script url. */
    joypixelsUrl: string;

    /** Function called once joypixels is loaded */
    onLoadJoypixels?: (joypixels: any) => void;
};

/**
 * Contribution to use emoji in markdown using [emoji-toolkit](https://github.com/joypixels/emoji-toolkit) library.
 */
@Injectable()
export class NgeMarkdownEmoji implements NgeMarkdownContribution {
    contribute(api: NgeMarkdown) {
        api.addHtmlModifier(async (element) => {
            const joypixels = await this.joypixels(api);
            element.innerHTML = joypixels.shortnameToUnicode(element.innerHTML);
        });
    }

    private joypixels(api: NgeMarkdown) {
        if (promise) {
            return promise;
        }

        if ('joypixels' in window) {
            return (promise = Promise.resolve(
                (window as any).joypixels
            ));
        }

        return (promise = new Promise<any>(async (resolve) => {
            const args = api.contribArguments[NgeMarkdownEmojiArgsKey] as NgeMarkdownEmojiArgs;
            await Promise.all([
                api.addScript(
                    args?.joypixelsUrl || 'https://cdn.jsdelivr.net/npm/emoji-toolkit@6.0.1/lib/js/joypixels.min.js'
                ),
            ]);
            let interval: any;
            interval = setInterval(() => {
                const joypixels = (window as any).joypixels;
                if (joypixels) {
                    if (args?.onLoadJoypixels) {
                        args.onLoadJoypixels(joypixels);
                    }
                    resolve(joypixels);
                    clearInterval(interval);
                }
            }, 30);
        }));
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
