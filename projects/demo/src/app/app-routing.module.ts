import { NgModule, Component, OnDestroy } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

const routes: Routes = [];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        scrollOffset: [0, 64],
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
    })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
