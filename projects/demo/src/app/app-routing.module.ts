import { NgModule, Component, OnDestroy } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
@Component({
    selector: 'app-a',
    template: '<button (click)="navigate()">navigate</button><nge-markdown file="assets/cheatsheet/a.md"></nge-markdown>'
})
export class A implements OnDestroy {
    constructor(
        private router: Router
    ) {}

    navigate() {
        this.router.navigateByUrl('b');
    }

    ngOnDestroy() {
        console.log('DESTROY A');
    }
}

@Component({
    selector: 'app-b',
    template: '<h1>BBB</h1>'
})
export class B {}

const routes: Routes = [
    { path: 'a', component: A },
    { path: 'b', component: B },
    { path: '**', pathMatch: 'full', redirectTo: 'a' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        scrollOffset: [0, 64],
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
    })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
