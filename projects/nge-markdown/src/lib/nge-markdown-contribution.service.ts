import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { shareReplay, take } from 'rxjs/operators';

declare type NgeMarkdownDependency = ['style'|'script', string, Record<string, string>?];

@Injectable({
    providedIn: 'root'
})
export class NgeMarkdownContributionService {
    private readonly resources: Record<string, Observable<Event>> = {};

    constructor(
        @Inject(DOCUMENT)
        private document: any
    ) {}

    /**
     * Injects styles and scripts from given urls to target place in DOM
     * This method loads style and script from same url once.
     *
     * @param resources An array of [type, url, attributes] tuple where:
     *  - type is the type of the resource to load `script`| `style`
     *  - `url` is the url to a style/script to load
     *  - `attributes` is a map of optional attributes to add to the element.
     * @param targetEl Target element for the placing style tag. It can be a selector or a element reference
     */
    loadDependencies(resources: NgeMarkdownDependency[], targetEl: HTMLElement | string = 'head') {
        return forkJoin(
            resources.map(tuple => {
                const type = tuple[0];
                const url = tuple[1];
                const attrs = tuple[2];
                let cache = this.resources[url];
                if (cache) {
                    return cache;
                }
                if (type === 'script') {
                    cache = this.loadScript(url, attrs, targetEl);
                } else {
                    cache = this.loadStyle(url, attrs, targetEl);
                }

                return this.resources[url] = cache.pipe(
                    take(1),
                    shareReplay(1)
                );
            })
        );
    }

    private loadStyle(
        url: string,
        attributes?: { [s: string]: string },
        targetEl: HTMLElement | string = 'head'
    ): Observable<Event> {
        return new Observable<Event>(observer => {
            const style: HTMLLinkElement = this.document.createElement(
                'link'
            );
            if (attributes) {
                for (const key in attributes) {
                    if (attributes.hasOwnProperty(key)) {
                        style.setAttribute(key, attributes[key]);
                    }
                }
            }

            style.onload = (event: Event) => {
                observer.next(event);
                observer.complete();
            };

            style.onerror = err => {
                observer.error(err);
            };

            style.href = url;
            style.rel = 'stylesheet';

            const targetElement: HTMLElement | null =
                typeof targetEl === 'string'
                    ? this.document.querySelector(targetEl)
                    : targetEl;
            if (!targetElement) {
                throw new Error('Cannot find element' + targetEl.toString());
            }
            targetElement.appendChild(style);
        });
    }

    private loadScript(
        url: string,
        attributes?: { [s: string]: string },
        targetEl: HTMLElement | string = 'head'
    ): Observable<Event> {
        return new Observable<Event>(observer => {
            const script: HTMLScriptElement = this.document.createElement(
                'script'
            );
            if (attributes) {
                for (const key in attributes) {
                    if (attributes.hasOwnProperty(key)) {
                        script.setAttribute(key, attributes[key]);
                    }
                }
            }

            script.onload = (event: Event) => {
                observer.next(event);
                observer.complete();
            };

            script.onerror = err => {
                observer.error(err);
            };

            script.src = url;

            const targetElement: HTMLElement | null =
                typeof targetEl === 'string'
                    ? this.document.querySelector(targetEl)
                    : targetEl;
            if (!targetElement) {
                throw new Error('Cannot find element' + targetEl.toString());
            }
            targetElement.appendChild(script);
        });
    }
}
