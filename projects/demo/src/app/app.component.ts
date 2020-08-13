import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

    cheatsheets: CheatSheet[] = [];

    constructor(
        private readonly http: HttpClient
    ) {}

    async ngOnInit() {
        const cheatsheets = [
            'Admonitions',
            'TabbedSet',
            'Headers',
            'Emphasis',
            'Lists',
            'Links',
            'Images',
            'Code',
            'Tables',
            'Blockquotes',
            'Horizontal Rule',
        ];
        this.cheatsheets = await Promise.all(cheatsheets.map(async e => {
            const url = 'assets/cheatsheet/' + e.toLowerCase().replace(' ', '-') + '.md';
            return {
                title: e,
                markdown: await this.http.get(url, { responseType: 'text' }).toPromise()
            };
        }));
    }
}


interface CheatSheet {
    title: string;
    markdown: string;
}
