# Emoji

Emoji contribution add the possibility to use a thousands of emojis in your project documentation with practically zero additional effort.

The emojis are integrated using [emoji-toolkit](https://github.com/joypixels/emoji-toolkit) library.

## Configuration

```typescript highlights="6-9 18 21"
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  NgeMarkdownModule,
  NgeMarkdownEmojiProvider,
} from 'nge-markdown';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgeMarkdownModule,
    BrowserAnimationsModule,
  ],
  providers: [NgeMarkdownEmojiProvider],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

### Arguments

Emoji contribution can accepts arguments from **NGE_MARKDOWN_CONTRIBUTION_ARGS**.

```typescript highlights="6-13 22 26-38"
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  NgeMarkdownModule,
  NgeMarkdownEmojiProvider,
  NgeMarkdownEmojiArgs,
  NgeMarkdownEmojiArgsKey,
  NgeMarkdownContributionArgs,
  NGE_MARKDOWN_CONTRIBUTION_ARGS,
} from 'nge-markdown';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgeMarkdownModule,
    BrowserAnimationsModule,
  ],
  providers: [
    NgeMarkdownEmojiProvider,
    {
      provide: NGE_MARKDOWN_CONTRIBUTION_ARGS,
      useValue: {
        [NgeMarkdownEmojiArgsKey]: {
          // url to load on when required joypixels library (default https://cdn.jsdelivr.net/npm/emoji-toolkit@6.0.1/lib/js/joypixels.min.js)
          joypixelsUrl: '....',
          onLoadJoypixels: (joypixels: any) => {
            console.log(joypixels)
          }
        } as NgeMarkdownEmojiArgs
      }
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

## Usage

Emojis can be integrated in Markdown by putting the shortcode of the emoji between two colons.
You can look up the shortcodes at [Emojipedia](https://emojipedia.org/joypixels/).

Example:

```plaintext
:smile:
```

Result:

😄