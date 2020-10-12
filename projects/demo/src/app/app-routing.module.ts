import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NgeDocSettings } from 'nge-doc';

const documentation: NgeDocSettings = {
    meta: {
        name: 'nge-markdown',
        root: '/docs/',
        logo: 'assets/images/nge.svg',
        repo: {
            name: 'nge-markdown',
            url: 'https://github.com/mciissee/nge-markdown',
        },
    },
    pages: [
        { title: 'Getting Started', href: 'getting-started', renderer: `assets/docs/getting-started.md` },
        { title: 'Installation', href: 'cheat-sheet', renderer: `assets/docs/installation.md` },
    ],
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
