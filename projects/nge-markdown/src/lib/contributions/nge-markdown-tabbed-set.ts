import { Provider } from '@angular/core';
import { NgeMarkdownModifier } from '../nge-markdown-modifier';
import { NgeMarkdownContribution, NGE_MARKDOWN_CONTRIBUTION } from './nge-markdown-contribution';

let TABSET_COUNTER = 0;

interface Tab {
    title: string;
    content: Element[];
}

export class NgeMarkdownTabbedSet implements NgeMarkdownContribution {

    contribute(modifier: NgeMarkdownModifier) {
        this.createStyleSheet();
        modifier.addHtmlModifier((element) => {
            const open = /^===\s*(.+)/;
            const close = /^===\s*$/;
            const processed: Element[] = [];
            const toRemoves: Element[] = [];
            element.querySelectorAll('p').forEach((paragraph) => {
                if (processed.indexOf(paragraph) !== -1) {
                    return;
                }

                const match = paragraph.innerHTML.match(open);
                if (match) {
                    const tabs: Tab[] = [];
                    let tab: Tab = {
                        title: match[1],
                        content: []
                    };

                    let node = paragraph.nextElementSibling;
                    while (node) {
                        let push = true;
                        const innerHTML = node.innerHTML.trim();
                        if (innerHTML.match(open)) {
                            tabs.push(tab);
                            tab = {
                                title: innerHTML.replace('===', '').trim(),
                                content: [],
                            };
                            push = false;
                            toRemoves.push(node);
                        } else if (innerHTML.match(close)) {
                            tabs.push(tab);
                            toRemoves.push(node);
                            break;
                        }

                        if (push) {
                            tab.content.push(node);
                        }

                        processed.push(node);
                        node = node.nextElementSibling;
                    }

                    paragraph.parentElement?.replaceChild(
                        this.createTabs(tabs),
                        paragraph
                    );

                    paragraph.remove();
                    toRemoves.forEach(e => e.remove());
                }
            });
        });
    }

    private createTabs(tabs: Tab[]) {
        const tabset = document.createElement('div');
        tabset.className = 'nge-md-tabbed-set';

        let i = 0;
        TABSET_COUNTER++;
        tabs.forEach((e) => {
            const checkbox = document.createElement('input');
            checkbox.type = 'radio';
            checkbox.id = 'nge-md-tabbed-' + TABSET_COUNTER + '-' + i;
            checkbox.name = 'nge-md-tabbed-' + TABSET_COUNTER;
            if (i === 0) {
                checkbox.setAttribute('checked', 'checked');
            }

            const label = document.createElement('label');
            label.setAttribute('for', checkbox.id);
            label.innerHTML = e.title;

            const content = document.createElement('div');
            content.className = 'nge-md-tabbed-content';
            e.content.forEach((c) => content.appendChild(c));

            tabset.append(checkbox, label, content);
            i++;
        });
        return tabset;
    }

    private createStyleSheet() {
        if (document.body.hasAttribute('nge-markdown-tabbed-set')) {
            return;
        }
        document.body.setAttribute('nge-markdown-tabbed-set', '');

        const style = document.createElement('style');
        style.innerHTML = `
            /*  TAB SET */
            .nge-md-tabbed-set {
                display: flex;
                position: relative;
                flex-wrap: wrap;
            }

            .nge-md-tabbed-set .highlight {
                background: #ddd;
            }

            .nge-md-tabbed-set .nge-md-tabbed-content {
                display: none;
                order: 99;
                width: 100%;
            }
            .nge-md-tabbed-set .nge-md-tabbed-content :first-child {
                margin: 0;
            }

            .nge-md-tabbed-set label {
                width: auto;
                padding: 0.25em;
                font-size: 100%;
                cursor: pointer;
            }

            .nge-md-tabbed-set input {
                position: absolute;
                opacity: 0;
            }

            .nge-md-tabbed-set input:nth-child(n+1) {
                color: #333333;
            }

            .nge-md-tabbed-set input:nth-child(n+1):checked + label {
                color: #ff5252;
                transition: all 0.3s;
                background-color: rgba(255, 82, 82, 0.1);
                border-bottom: 1px solid;
            }

            .nge-md-tabbed-set input:nth-child(n+1):checked + label + .nge-md-tabbed-content {
                display: block;
                border-top: 1px solid #F5F5F5;
            }
        `;
        document.body.appendChild(style);
    }

}

export const NgeMarkdownTabbedSetProvider: Provider = {
    provide: NGE_MARKDOWN_CONTRIBUTION,
    multi: true,
    useClass: NgeMarkdownTabbedSet,
};
