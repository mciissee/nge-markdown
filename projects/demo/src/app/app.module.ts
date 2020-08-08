import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
    NgeMarkdownModule,
    NGE_MARKDOWN_CONTRIBUTION,
    NgeMarkdownAdmonitions,
    NgeMarkdownTabbedSet,
    NgeMarkdownLinkFragment,
} from 'nge-markdown';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        NgeMarkdownModule,
        AppRoutingModule,
    ],
    providers: [
        {
            provide: NGE_MARKDOWN_CONTRIBUTION,
            multi: true,
            useClass: NgeMarkdownTabbedSet,
        },
        {
            provide: NGE_MARKDOWN_CONTRIBUTION,
            multi: true,
            useClass: NgeMarkdownAdmonitions,
        },
        {
            provide: NGE_MARKDOWN_CONTRIBUTION,
            multi: true,
            useClass: NgeMarkdownLinkFragment,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
