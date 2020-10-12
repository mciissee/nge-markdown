import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NgeDocSettings, NgeDocLinAction, NgeDocLink } from 'nge-doc';

const editInGithubAction = (url: string) => {
    const base = 'https://github.com/mciissee/nge-markdown/tree/master/projects/demo/src/assets/docs/';
    return {
        title: 'Edit on github',
        icon: 'https://icongr.am/octicons/mark-github.svg',
        run: base + url,
    } as NgeDocLinAction;
};

const documentation: NgeDocSettings = {
    meta: {
        name: 'nge-markdown',
        root: '',
        logo: 'assets/images/nge.svg',
        repo: {
            name: 'nge-markdown',
            url: 'https://github.com/mciissee/nge-markdown',
        },
    },
    pages: [
        {
            title: 'Getting Started',
            href: 'getting-started',
            renderer: `assets/docs/getting-started.md`,
            actions: [editInGithubAction('getting-started.md')]
        },
        {
            title: 'Installation',
            href: 'installation',
            renderer: `assets/docs/installation.md`,
            actions: [editInGithubAction('installation.md')]
        },
        {
            title: 'Usage',
            href: 'usage',
            renderer: `assets/docs/usage.md`,
            actions: [editInGithubAction('usage.md')]
        },
        () => {
            const link = {
                title: 'Contributions',
                href: 'contributions',
                renderer: 'assets/docs/contributions/contributions.md',
                actions: [editInGithubAction('assets/docs/contributions/contributions.md')]
            } as NgeDocLink;
            const contributions = [
                'Admonitions',
                'Emoji',
                'Highlighter',
                'Icons',
                'Katex',
                'LinkAnchor',
                'TabbedSet'
            ];
            link.children = contributions.map(name => {
                const snakecase = name
                    // transform to snake case
                    .replace(/[A-Z]/gm, (match) => '-' + match.toLowerCase())
                    // remove leading dash
                    .slice(1);
                const base = 'https://github.com/mciissee/nge-markdown/tree/master/projects/nge-markdown/src/lib/contributions/';
                return {
                    title: name,
                    href: snakecase,
                    renderer: 'assets/docs/contributions/' + snakecase + '.md',
                    actions: [
                        {
                            title: 'Source code',
                            icon: 'https://icongr.am/octicons/code.svg',
                            run: base + snakecase + '.ts',
                        },
                        editInGithubAction('contributions/' + snakecase + '.md'),
                    ]
                };
            });
            return link;
        },
        {
            title: 'Cheatsheet',
            href: 'cheatsheet',
            renderer: () => import('./cheat-sheet/cheat-sheet.module').then(m => m.CheatSheetModule),
        },
    ],
};

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('nge-doc').then(m => m.NgeDocModule),
        data: documentation,
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
@NgModule({
    imports: [RouterModule.forRoot(routes, {
        scrollOffset: [0, 64],
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
        preloadingStrategy: PreloadAllModules
    })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
