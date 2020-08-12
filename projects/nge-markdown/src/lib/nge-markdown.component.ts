import { HttpClient } from '@angular/common/http';
import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    OnChanges,
    Optional,
    Output,
} from '@angular/core';
import {
    NgeMarkdownContribution,
    NGE_MARKDOWN_CONTRIBUTION,
} from './contributions/nge-markdown-contribution';
import { NgeMarkdownService } from './nge-markdown.service';
import * as marked from 'marked';

@Component({
    selector: 'nge-markdown, [nge-markdown]',
    template: `<ng-content></ng-content>`,
    styleUrls: ['./nge-markdown.component.scss'],
})
export class NgeMarkdownComponent implements OnChanges, AfterViewInit {
    /** Link to a markdown file to render. */
    @Input() file?: string;

    /** Markdown string to render. */
    @Input() data?: string;

    /**
     * An event that emit after each rendering pass
     * with the list of tokens parsed from the input markdown.
     */
    @Output() render = new EventEmitter<marked.TokensList>();

    constructor(
        private readonly element: ElementRef<HTMLElement>,
        private readonly markdownService: NgeMarkdownService,
        @Optional()
        private readonly http: HttpClient,
        @Optional()
        @Inject(NGE_MARKDOWN_CONTRIBUTION)
        private readonly contributions: NgeMarkdownContribution[]
    ) {}

    ngOnChanges(): void {
        if (this.file) {
            this.renderFromFile(this.file);
        } else if (this.data) {
            this.renderFromString(this.data);
        }
    }

    ngAfterViewInit(): void {
        if (!this.file && !this.data) {
            this.renderFromString(this.element.nativeElement.innerHTML, true);
        } else {
            this.element.nativeElement.innerHTML = '';
        }
    }

    private renderFromFile(file: string) {
        if (!this.http) {
            throw new Error(
                '[nge-markdown] When using the `file` attribute you *have to* pass the `HttpClient` as a parameter of the `forRoot` method. See README for more information'
            );
        }

        this.http.get(file, { responseType: 'text' }).subscribe({
            next: (markdown) => this.renderFromString(markdown),
        });
    }

    private async renderFromString(markdown: string, isHtmlString = false) {
        const tokens = await this.markdownService.compile({
            target: this.element,
            markdown,
            isHtmlString,
            contributions: this.contributions,
        });
        this.render.emit(tokens);
    }
}
