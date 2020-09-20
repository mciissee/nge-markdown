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
} from 'nge-markdown';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgeMonacoModule, NgeMonacoColorizerService, NGE_THEMES } from 'nge-monaco';
import { NGE_MARKDOWN_HIGHLIGHTER_CONFIG, NgeMarkdownHighlighterConfig, NgeMarkdownHighlighterProvider } from 'nge-markdown';

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
        {
            provide: NGE_MARKDOWN_HIGHLIGHTER_CONFIG,
            useValue: {
                highligtht: async (injector, options) => {
                    const colorizer = injector.get(NgeMonacoColorizerService, null);
                    const code = options.element;
                    const pre = code.parentElement as HTMLElement;
                    await colorizer?.colorizeElement({
                        element: code,
                        language: options.language,
                        code: code.innerHTML,
                        lines: options.lines,
                        highlights: options.highlights
                    });
                    if (!pre.classList.contains('monaco-editor')) {
                        pre.classList.add('monaco-editor');
                        pre.classList.add('monaco-editor-background');
                    }
                    pre.style.margin = '0.5em 0';
                    pre.style.overflow = 'auto';
                    pre.style.border = '1px solid #F2F2F2';
                }
            } as NgeMarkdownHighlighterConfig
        }
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
