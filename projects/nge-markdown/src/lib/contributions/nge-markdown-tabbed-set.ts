import { NgeMarkdownContribution } from './nge-markdown-contribution';
import { NgeMarkdownModifier } from '../nge-markdown-modifier';

let TABSET_COUNTER = 0;

interface Tab {
    title: string;
    content: Element[];
}

export class NgeMarkdownTabbedSet implements NgeMarkdownContribution {
    contribute(modifier: NgeMarkdownModifier) {
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
}
