import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
    NgeMarkdownModule,
    NgeMarkdownTabbedSetProvider,
    NgeMarkdownAdmonitionsProvider,
    NgeMarkdownLinkAnchorProvider,
    NgeMarkdownKatexProvider,
    NgeMarkdownEmojiProvider,
    NgeMarkdownIconsProvider,
    NgeMarkdownHighlighterProvider,
    NgeMarkdownHighlighterMonacoProvider
} from 'nge-markdown';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgeMonacoModule, NgeMonacoColorizerService, NGE_THEMES } from 'nge-monaco';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        NgeMarkdownModule,
        NgeMonacoModule.forRoot({
            theming: {
                themes: NGE_THEMES.map(theme => 'assets/themes/' + theme),
                default: 'github'
            }
        }),
        AppRoutingModule,
    ],
    providers: [
        NgeMarkdownKatexProvider,
        NgeMarkdownIconsProvider,
        NgeMarkdownEmojiProvider,
        NgeMarkdownTabbedSetProvider,
        NgeMarkdownLinkAnchorProvider,
        NgeMarkdownAdmonitionsProvider,
        NgeMarkdownHighlighterProvider,
        NgeMarkdownHighlighterMonacoProvider(NgeMonacoColorizerService)
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
