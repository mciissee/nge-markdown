import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NgeDocSettings } from 'nge-doc';

const documentation: NgeDocSettings = {
    meta: {
        name: 'nge-markdown',
        root: '/docs/',
        copyright: '© 2020, nge-markdown',
        repo: {
            name: 'nge-markdown',
            url: 'https://github.com/mciissee/nge-markdown',
        },
    },
    pages: [
        { title: 'Getting Started', href: 'getting-started', renderer: `assets/cheatsheet/admonitions.md` },
        { title: 'Cheat sheet', href: 'cheat-sheet', renderer: `assets/cheatsheet/admonitions.md` },
        { title: 'Playground', href: 'playground', renderer: `assets/cheatsheet/admonitions.md` },
    ],
    markdownRenderer: import('nge-markdown').then(m => m.NgeMarkdownComponent)
};

const routes: Routes = [
    {
        path: 'docs',
        loadChildren: () => import('nge-doc').then(m => m.NgeDocModule),
        data: documentation,
    },
    { path: '**', redirectTo: 'docs', pathMatch: 'full' }
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
