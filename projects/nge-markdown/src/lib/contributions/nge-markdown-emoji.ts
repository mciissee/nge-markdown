import { Injectable, Provider } from '@angular/core';
import { NgeMarkdownTransformer } from '../nge-markdown-transformer';
import {
    NgeMarkdownContribution,
    NGE_MARKDOWN_CONTRIBUTION
} from './nge-markdown-contribution';

let promise: Promise<any> | undefined;

/** Key of `NgeMarkdownEmoji` arguments in `NgeMarkdownContributionArgs` map. */
export const NgeMarkdownEmojiArgsKey = 'nge-markdown-emoji';

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
    contribute(api: NgeMarkdownTransformer) {
        api.addMarkdownTransformer(async markdown => {
            const joypixels = await this.joypixels(api);
            const lines = markdown.split('\n');
            const length = lines.length;
            let insideCodeBlock = false;
            for (let i = 0; i < length; i++) {
                const curr = lines[i];
                if (curr.startsWith('```')) {
                    insideCodeBlock = !insideCodeBlock;
                }
                if (insideCodeBlock) {
                    continue;
                }
                lines[i] = joypixels.shortnameToUnicode(lines[i]);
            }
            return lines.join('\n');
        });
    }

    private joypixels(api: NgeMarkdownTransformer) {
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
            }, 300);
        }));
    }

}

/**
 * Provider to use emoji in markdown using [emoji-toolkit](https://github.com/joypixels/emoji-toolkit) library.
 */
export const NgeMarkdownEmojiProvider: Provider = {
    provide: NGE_MARKDOWN_CONTRIBUTION,
    multi: true,
    useClass: NgeMarkdownEmoji,
};
